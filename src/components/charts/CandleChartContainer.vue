<template>
  <div class="d-flex h-100">
    <div class="flex-fill w-100 flex-column align-items-stretch d-flex h-100">
      <div class="d-flex me-0">
        <div class="ms-1 ms-md-2 d-flex flex-wrap flex-md-nowrap align-items-center w-auto">
          <span class="ms-md-2 text-nowrap">{{ strategyName }} | {{ timeframe || '' }}</span>
          <VSelect
            v-model="pair"
            class="ms-md-2"
            :items="availablePairs"
            style="min-width: 7em"
            density="compact"
            :clearable="false"
            @update:model-value="refresh"
          />
          <b-button
            title="Refresh chart"
            class="ms-2"
            :disabled="!!!pair"
            size="sm"
            @click="refresh"
          >
            <VIcon icon="mdi-refresh" />
          </b-button>
          <div class="d-flex flex-column">
            <div class="d-flex flex-row flex-wrap">
              <small v-if="dataset" class="ms-2 text-nowrap" title="Long entry signals"
                >Long entries: {{ dataset.enter_long_signals || dataset.buy_signals }}</small
              >
              <small v-if="dataset" class="ms-2 text-nowrap" title="Long exit signals"
                >Long exit: {{ dataset.exit_long_signals || dataset.sell_signals }}</small
              >
            </div>
            <div class="d-flex flex-row flex-wrap">
              <small v-if="dataset && dataset.enter_short_signals" class="ms-2 text-nowrap"
                >Short entries: {{ dataset.enter_short_signals }}</small
              >
              <small v-if="dataset && dataset.exit_short_signals" class="ms-2 text-nowrap"
                >Short exits: {{ dataset.exit_short_signals }}</small
              >
            </div>
          </div>
        </div>
        <div class="ms-auto d-flex align-items-center w-auto">
          <b-form-checkbox v-model="settingsStore.useHeikinAshiCandles"
            ><small class="text-nowrap">Heikin Ashi</small></b-form-checkbox
          >

          <div class="ms-2">
            <PlotConfigSelect></PlotConfigSelect>
          </div>

          <div class="ms-2 me-0 me-md-1">
            <b-button size="sm" title="Plot configurator" @click="showConfigurator">
              <VIcon icon="mdi-cog" width="12" height="12" />
            </b-button>
          </div>
        </div>
      </div>
      <div class="h-100 w-100 d-flex">
        <div class="flex-grow-1">
          <CandleChart
            v-if="hasDataset"
            :dataset="dataset"
            :trades="trades"
            :plot-config="plotStore.plotConfig"
            :heikin-ashi="settingsStore.useHeikinAshiCandles"
            :use-u-t-c="settingsStore.timezone === 'UTC'"
            :theme="settingsStore.chartTheme"
            :slider-position="sliderPosition"
            :color-up="colorStore.colorUp"
            :color-down="colorStore.colorDown"
          >
          </CandleChart>
          <div v-else class="m-auto">
            <b-spinner v-if="isLoadingDataset" label="Spinning" />

            <div v-else style="font-size: 1.5rem">
              {{ noDatasetText }}
            </div>
          </div>
        </div>
        <transition name="fade">
          <div v-if="!plotConfigModal" v-show="showPlotConfig" class="w-25">
            <PlotConfigurator :columns="datasetColumns" :is-visible="showPlotConfig ?? false" />
          </div>
        </transition>
      </div>
    </div>
    <b-modal
      v-if="plotConfigModal"
      id="plotConfiguratorModal"
      v-model="showPlotConfigModal"
      title="Plot Configurator"
      ok-only
      hide-backdrop
    >
      <PlotConfigurator :is-visible="showPlotConfigModal" :columns="datasetColumns" />
    </b-modal>
  </div>
</template>

<script setup lang="ts">
import CandleChart from '@frequi/components/charts/CandleChart.vue';
import PlotConfigSelect from '@frequi/components/charts/PlotConfigSelect.vue';
import PlotConfigurator from '@frequi/components/charts/PlotConfigurator.vue';
import { usePlotConfigStore } from '@frequi/stores/plotConfig';
import { useSettingsStore } from '@frequi/stores/settings';
import { ChartSliderPosition, LoadingStatus, PairHistory, Trade } from '@frequi/types';

import { useBotStore } from '@frequi/stores/ftbotwrapper';
import { computed, onMounted, ref, watch } from 'vue';
import { useColorStore } from '@frequi/stores/colors';

const props = defineProps({
  trades: { required: false, default: () => [], type: Array as () => Trade[] },
  availablePairs: { required: true, type: Array as () => string[] },
  timeframe: { required: true, type: String },
  historicView: { required: false, default: false, type: Boolean },
  plotConfigModal: { required: false, default: true, type: Boolean },
  /** Only required if historicView is true */
  timerange: { required: false, default: '', type: String },
  /** Only required if historicView is true */
  strategy: { required: false, default: '', type: String },
  freqaiModel: { required: false, default: undefined, type: String },
  sliderPosition: {
    required: false,
    type: Object as () => ChartSliderPosition,
    default: () => undefined,
  },
});
const settingsStore = useSettingsStore();
const colorStore = useColorStore();
const botStore = useBotStore();
const plotStore = usePlotConfigStore();

const pair = ref('');
const showPlotConfig = ref<boolean>();

const dataset = computed((): PairHistory => {
  if (props.historicView) {
    return botStore.activeBot.history[`${pair.value}__${props.timeframe}`]?.data;
  }
  return botStore.activeBot.candleData[`${pair.value}__${props.timeframe}`]?.data;
});
const strategyName = computed(() => props.strategy || dataset.value?.strategy || '');
const datasetColumns = computed(() => (dataset.value ? dataset.value.columns : []));
const hasDataset = computed(() => dataset.value && dataset.value.data.length > 0);
const isLoadingDataset = computed((): boolean => {
  if (props.historicView) {
    return botStore.activeBot.historyStatus === LoadingStatus.loading;
  }

  return botStore.activeBot.candleDataStatus === LoadingStatus.loading;
});
const noDatasetText = computed((): string => {
  const status = props.historicView
    ? botStore.activeBot.historyStatus
    : botStore.activeBot.candleDataStatus;

  switch (status) {
    case LoadingStatus.not_loaded:
      return 'Not loaded yet.';
    case LoadingStatus.loading:
      return 'Loading...';
    case LoadingStatus.success:
      return 'No data available';
    case LoadingStatus.error:
      return 'Failed to load data';
    default:
      return 'Unknown';
  }
});
const showPlotConfigModal = ref(false);

function showConfigurator() {
  if (props.plotConfigModal) {
    showPlotConfigModal.value = !showPlotConfigModal.value;
  } else {
    showPlotConfig.value = !showPlotConfig.value;
  }
}

function refresh() {
  console.log('refresh', pair.value, props.timeframe);
  if (pair.value && props.timeframe) {
    if (props.historicView) {
      botStore.activeBot.getPairHistory({
        pair: pair.value,
        timeframe: props.timeframe,
        timerange: props.timerange,
        strategy: props.strategy,
        freqaimodel: props.freqaiModel,
      });
    } else {
      botStore.activeBot.getPairCandles({
        pair: pair.value,
        timeframe: props.timeframe,
      });
    }
  }
}

watch(
  () => props.availablePairs,
  () => {
    if (!props.availablePairs.find((p) => p === pair.value)) {
      [pair.value] = props.availablePairs;
      refresh();
    }
  },
);

watch(
  () => botStore.activeBot.selectedPair,
  () => {
    pair.value = botStore.activeBot.selectedPair;
    refresh();
  },
);

onMounted(() => {
  showPlotConfig.value = props.plotConfigModal;
  if (botStore.activeBot.selectedPair) {
    pair.value = botStore.activeBot.selectedPair;
  } else if (props.availablePairs.length > 0) {
    [pair.value] = props.availablePairs;
  }
  plotStore.plotConfigChanged();
  if (!hasDataset.value) {
    refresh();
  }
});
</script>

<style scoped lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
