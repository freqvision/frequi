<template>
  <VRow>
    <VCol v-if="gridLayoutMultiPane.h != 0" cols="12" md="3">
      <VCard title="Multi Pane" class="h-100">
        <VCardText class="h-100">
          <div class="mt-1 d-flex justify-content-center">
            <BotControls class="mt-1 mb-2" />
          </div>
          <b-tabs content-class="mt-3" class="mt-1">
            <b-tab title="Pairs combined" active>
              <PairSummary
                :pairlist="botStore.activeBot.whitelist"
                :current-locks="botStore.activeBot.activeLocks"
                :trades="botStore.activeBot.openTrades"
              />
            </b-tab>
            <b-tab title="General">
              <BotStatus />
            </b-tab>
            <b-tab title="Performance">
              <BotPerformance class="performance-view" />
            </b-tab>
            <b-tab title="Balance" lazy>
              <BotBalance />
            </b-tab>
            <b-tab title="Time Breakdown" lazy>
              <PeriodBreakdown />
            </b-tab>

            <b-tab title="Pairlist" lazy>
              <PairListLive />
            </b-tab>
            <b-tab title="Pair Locks" lazy>
              <PairLockList />
            </b-tab>
          </b-tabs>
        </VCardText>
      </VCard>
    </VCol>
    <VCol cols="12" md="9">
      <VRow>
        <VCol v-if="gridLayoutTradeDetail.h != 0" cols="12" style="min-height: 600px">
          <VCard title="Chart" class="h-100">
            <VCardText class="h-100">
              <CandleChartContainer
                :available-pairs="botStore.activeBot.whitelist"
                :historic-view="!!false"
                :timeframe="botStore.activeBot.timeframe"
                :trades="botStore.activeBot.allTrades"
              >
              </CandleChartContainer>
            </VCardText>
          </VCard>
        </VCol>
        <VCol v-if="gridLayoutOpenTrades.h != 0" cols="12">
          <VCard title="Open Trades">
            <VCardText>
              <TradeList
                class="open-trades"
                :trades="botStore.activeBot.openTrades"
                title="Open trades"
                :active-trades="true"
                empty-text="Currently no open trades."
              />
            </VCardText>
          </VCard>
        </VCol>
        <VCol
          v-if="
            botStore.activeBot.detailTradeId &&
            botStore.activeBot.tradeDetail &&
            gridLayoutTradeDetail.h != 0
          "
          cols="12"
        >
          <VCard title="Trade Detail">
            <VCardText>
              <TradeDetail
                :trade="botStore.activeBot.tradeDetail"
                :stake-currency="botStore.activeBot.stakeCurrency"
              />
            </VCardText>
          </VCard>
        </VCol>
        <VCol v-if="gridLayoutTradeHistory.h != 0" cols="12">
          <VCard title="Closed Trades">
            <VCardText>
              <trade-list
                class="trade-history"
                :trades="botStore.activeBot.closedTrades"
                title="Trade history"
                :show-filter="true"
                empty-text="No closed trades so far."
              />
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </VCol>
  </VRow>
</template>

<script setup lang="ts">
import { GridItemData } from '@frequi/types';

import BotBalance from '@frequi/components/ftbot/BotBalance.vue';
import BotControls from '@frequi/components/ftbot/BotControls.vue';
import BotStatus from '@frequi/components/ftbot/BotStatus.vue';
import CandleChartContainer from '@frequi/components/charts/CandleChartContainer.vue';
import PeriodBreakdown from '@frequi/components/ftbot/PeriodBreakdown.vue';
import PairListLive from '@frequi/components/ftbot/PairListLive.vue';
import PairLockList from '@frequi/components/ftbot/PairLockList.vue';
import PairSummary from '@frequi/components/ftbot/PairSummary.vue';
import BotPerformance from '@frequi/components/ftbot/BotPerformance.vue';
import TradeDetail from '@frequi/components/ftbot/TradeDetail.vue';
import TradeList from '@frequi/components/ftbot/TradeList.vue';

import { ref, computed } from 'vue';
import { useLayoutStore, findGridLayout, TradeLayout } from '@frequi/stores/layout';
import { useBotStore } from '@frequi/stores/ftbotwrapper';

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
    return layoutStore.tradingLayout;
  }
  return [...layoutStore.getTradingLayoutSm];
});

const gridLayoutMultiPane = computed(() => {
  return findGridLayout(gridLayoutData.value, TradeLayout.multiPane);
});

const gridLayoutOpenTrades = computed(() => {
  return findGridLayout(gridLayoutData.value, TradeLayout.openTrades);
});

const gridLayoutTradeHistory = computed(() => {
  return findGridLayout(gridLayoutData.value, TradeLayout.tradeHistory);
});

const gridLayoutTradeDetail = computed(() => {
  return findGridLayout(gridLayoutData.value, TradeLayout.tradeDetail);
});

const gridLayoutChartView = computed(() => {
  return findGridLayout(gridLayoutData.value, TradeLayout.chartView);
});

const responsiveGridLayouts = computed(() => {
  return {
    sm: layoutStore.getTradingLayoutSm,
  };
});
</script>

<style scoped></style>
