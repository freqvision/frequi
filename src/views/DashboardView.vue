<template>
  <VRow>
    <VCol cols="12" md="8">
      <VCard title="Bot comparison" class="h-100">
        <VCardText class="h-100">
          <bot-comparison-list />
        </VCardText>
      </VCard>
    </VCol>
    <VCol cols="12" md="4">
      <VCard :title="`Daily Profit ${botStore.botCount > 1 ? 'combined' : ''}`" class="h-100">
        <VCardText class="h-100">
          <DailyChart
            v-if="botStore.allDailyStatsSelectedBots"
            :daily-stats="botStore.allDailyStatsSelectedBots"
            :show-title="false"
          />
        </VCardText>
      </VCard>
    </VCol>
    <VCol cols="12" md="8">
      <VCard class="h-100">
        <VCardTitle>
          <div class="d-flex justify-content-center">
            Open Trades
            <InfoBox
              class="ms-2"
              hint="Open trades of all selected bots. Click on a trade to go to the trade page for that trade/bot."
            />
          </div>
        </VCardTitle>
        <VCardText class="h-100">
          <trade-list active-trades :trades="botStore.allOpenTradesSelectedBots" multi-bot-view />
        </VCardText>
      </VCard>
    </VCol>
    <VCol cols="12" md="4">
      <VCard title="Cumulative Profit" class="h-100">
        <VCardText class="h-100">
          <CumProfitChart
            :trades="botStore.allTradesSelectedBots"
            :open-trades="botStore.allOpenTradesSelectedBots"
            :show-title="false"
          />
        </VCardText>
      </VCard>
    </VCol>
    <VCol cols="12" md="8">
      <VCard class="h-100">
        <VCardTitle>
          <div class="d-flex justify-content-center">
            Closed Trades
            <InfoBox
              class="ms-2"
              hint="Closed trades for all selected bots. Click on a trade to go to the trade page for that trade/bot."
            />
          </div>
        </VCardTitle>
        <VCardText class="h-100">
          <trade-list
            :active-trades="false"
            show-filter
            :trades="botStore.allClosedTradesSelectedBots"
            multi-bot-view
          />
        </VCardText>
      </VCard>
    </VCol>
    <VCol cols="12" md="4">
      <VCard title="Profit Distribution" class="h-100">
        <VCardText class="h-100">
          <ProfitDistributionChart :trades="botStore.allTradesSelectedBots" :show-title="false" />
        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12">
      <VCard title="Trades Log" class="h-100">
        <VCardText class="h-100">
          <TradesLogChart
            style="height: 500px"
            :trades="botStore.allTradesSelectedBots"
            :show-title="false"
          />
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

import DailyChart from '@frequi/components/charts/DailyChart.vue';
import CumProfitChart from '@frequi/components/charts/CumProfitChart.vue';
import TradesLogChart from '@frequi/components/charts/TradesLog.vue';
import ProfitDistributionChart from '@frequi/components/charts/ProfitDistributionChart.vue';
import BotComparisonList from '@frequi/components/ftbot/BotComparisonList.vue';
import TradeList from '@frequi/components/ftbot/TradeList.vue';
import DraggableContainer from '@frequi/components/layout/DraggableContainer.vue';
import InfoBox from '@frequi/components/general/InfoBox.vue';

import { DashboardLayout, findGridLayout, useLayoutStore } from '@frequi/stores/layout';
import { useBotStore } from '@frequi/stores/ftbotwrapper';
import { GridItemData } from '@frequi/types';

const botStore = useBotStore();

const layoutStore = useLayoutStore();
const currentBreakpoint = ref('');

const breakpointChanged = (newBreakpoint: string) => {
  // console.log('breakpoint:', newBreakpoint);
  currentBreakpoint.value = newBreakpoint;
};
const isResizableLayout = computed(() =>
  ['', 'sm', 'md', 'lg', 'xl'].includes(currentBreakpoint.value),
);
const isLayoutLocked = computed(() => {
  return layoutStore.layoutLocked || !isResizableLayout.value;
});

const gridLayoutData = computed((): GridItemData[] => {
  if (isResizableLayout.value) {
    return layoutStore.dashboardLayout;
  }
  return [...layoutStore.getDashboardLayoutSm];
});

const layoutUpdatedEvent = (newLayout) => {
  if (isResizableLayout.value) {
    console.log('newlayout', newLayout);
    console.log('saving dashboard');
    layoutStore.dashboardLayout = newLayout;
  }
};

const gridLayoutDaily = computed((): GridItemData => {
  return findGridLayout(gridLayoutData.value, DashboardLayout.dailyChart);
});

const gridLayoutBotComparison = computed((): GridItemData => {
  return findGridLayout(gridLayoutData.value, DashboardLayout.botComparison);
});

const gridLayoutAllOpenTrades = computed((): GridItemData => {
  return findGridLayout(gridLayoutData.value, DashboardLayout.allOpenTrades);
});
const gridLayoutAllClosedTrades = computed((): GridItemData => {
  return findGridLayout(gridLayoutData.value, DashboardLayout.allClosedTrades);
});

const gridLayoutCumChart = computed((): GridItemData => {
  return findGridLayout(gridLayoutData.value, DashboardLayout.cumChartChart);
});
const gridLayoutProfitDistribution = computed((): GridItemData => {
  return findGridLayout(gridLayoutData.value, DashboardLayout.profitDistributionChart);
});
const gridLayoutTradesLogChart = computed((): GridItemData => {
  return findGridLayout(gridLayoutData.value, DashboardLayout.tradesLogChart);
});

const responsiveGridLayouts = computed(() => {
  return {
    sm: layoutStore.getDashboardLayoutSm,
  };
});

onMounted(async () => {
  await botStore.allGetDaily({ timescale: 30 });
  // botStore.activeBot.getTrades();
  botStore.activeBot.getOpenTrades();
  botStore.activeBot.getProfit();
});
</script>

<style scoped></style>
