<template>
  <footer class="">
    <!-- Only visible on xs (phone) viewport! -->
    <hr class="my-0" />
    <div class="d-flex flex-align-center justify-content-between px-2">
      <router-link
        v-if="!botStore.canRunBacktest"
        class="nav-link navbar-nav align-items-center"
        to="/freqtrade/open_trades"
      >
        <VIcon icon="mdi-folder-open" />
        Trades
      </router-link>
      <router-link
        v-if="!botStore.canRunBacktest"
        class="nav-link navbar-nav align-items-center"
        to="/freqtrade/trade_history"
      >
        <VIcon icon="mdi-folder-lock" />
        History
      </router-link>
      <router-link
        v-if="!botStore.canRunBacktest"
        class="nav-link navbar-nav align-items-center"
        to="/freqtrade/pairlist"
      >
        <VIcon icon="mdi-view-list" />
        Pairlist
      </router-link>
      <router-link
        v-if="!botStore.canRunBacktest"
        class="nav-link navbar-nav align-items-center"
        to="/freqtrade/balance"
      >
        <VIcon icon="mdi-bank" />
        Balance
      </router-link>
      <router-link
        v-if="!botStore.canRunBacktest"
        class="nav-link navbar-nav align-items-center"
        to="/freqtrade/dashboard"
      >
        <VIcon icon="mdi-view-dashboard-outline" />
        Dashboard
      </router-link>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { useBotStore } from '@frequi/stores/ftbotwrapper';

const botStore = useBotStore();
</script>

<style lang="scss" scoped>
[data-theme='dark'] {
  .router-link-active,
  .nav-link:active {
    color: white !important;
  }
}
</style>
