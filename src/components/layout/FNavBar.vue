<template>
  <VCard class="mb-2 mt-1 overflow-visible">
    <VCardText class="pa-1 d-flex justify-space-between align-center">
      <div>
        <div class="d-flex align-center">
          <div v-for="{ title, route, show } in menu" :key="route" class="ma-1">
            <VBtn
              v-if="show"
              :color="currentRoute === route ? 'primary' : 'default'"
              variant="text"
              size="small"
              :to="route"
              >{{ title }}</VBtn
            >
          </div>
          <div>
            <VBtn v-if="botStore.botCount === 1" variant="text" size="small" @click="clickLogout()"
              >Sign Out</VBtn
            >
          </div>
        </div>
      </div>
      <div class="d-flex align-center">
        <div class="text-left text-caption mr-2" style="line-height: 1.1">
          <div>
            {{
              (botStore.activeBotorUndefined && botStore.activeBotorUndefined.botName) ||
              'No bot selected'
            }}
          </div>
          <div>
            <span
              v-if="botStore.activeBotorUndefined && botStore.activeBotorUndefined.isBotOnline"
              class="text-success"
              >Online</span
            >
            <span v-else class="text-red">Offline</span>
          </div>
        </div>
        <div class="d-flex justify-content-between align-center">
          <VMenu v-if="botStore.botCount > 1">
            <template #activator="{ props }">
              <VCard color="primary" v-bind="props" variant="outlined">
                <VCardText class="pa-1">
                  <BotEntry :bot="botStore.selectedBotObj" :no-buttons="true" />
                </VCardText>
              </VCard>
            </template>
            <BotList :small="true" />
          </VMenu>
          <ReloadControl class="me-3" />
        </div>
      </div>
    </VCardText>
  </VCard>

  <LoginModal v-if="!botStore.botCount && route?.path !== '/login'" />
</template>

<script setup lang="ts">
import LoginModal from '@frequi/views/LoginModal.vue';
import Favico from 'favico.js';
import ReloadControl from '@frequi/components/ftbot/ReloadControl.vue';
import BotEntry from '@frequi/components/BotEntry.vue';
import BotList from '@frequi/components/BotList.vue';
import { ref, onBeforeUnmount, onMounted, watch, computed } from 'vue';
import { OpenTradeVizOptions, useSettingsStore } from '@frequi/stores/settings';
import { useLayoutStore } from '@frequi/stores/layout';
import { useBotStore } from '@frequi/stores/ftbotwrapper';
import { useRoute } from 'vue-router';
import router from '@frequi/router';

const botStore = useBotStore();

const settingsStore = useSettingsStore();
const layoutStore = useLayoutStore();
const route = useRoute();
const favicon = ref<Favico | undefined>(undefined);
const pingInterval = ref<number>();

const clickLogout = () => {
  botStore.removeBot(botStore.selectedBot);
  // TODO: This should be per bot
};

const topMenu = [
  {
    title: 'Trade',
    route: '/freqtrade/trade',
    show: !botStore.canRunBacktest,
  },
  {
    title: 'Dashboard',
    route: '/freqtrade/dashboard',
    show: !botStore.canRunBacktest,
  },
  {
    title: 'Chart',
    route: '/freqtrade/graph',
    show: true,
  },
  {
    title: 'Logs',
    route: '/freqtrade/logs',
    show: true,
  },
  {
    title: 'Backtest',
    route: '/freqtrade/backtest',
    show: botStore.canRunBacktest,
  },
  {
    title: 'Pairlist Config',
    route: '/freqtrade/pairlist_config',
    show: (botStore.activeBot?.isWebserverMode ?? false) && botStore.activeBot.botApiVersion >= 2.3,
  },

  {
    title: 'Trades',
    route: '/freqtrade/open_trades',
    show: !botStore.canRunBacktest,
  },
  {
    title: 'History',
    route: '/freqtrade/trade_history',
    show: !botStore.canRunBacktest,
  },

  {
    title: 'Settings',
    route: '/freqtrade/settings',
    show: true,
  },
];

const currentRoute = computed(() => {
  return router.currentRoute.value.path;
});

const menu = computed(() => {
  return topMenu.filter(({ show }) => {
    return show;
  });
});

const setOpenTradesAsPill = (tradeCount: number) => {
  if (!favicon.value) {
    favicon.value = new Favico({
      animation: 'none',
      // position: 'up',
      // fontStyle: 'normal',
      // bgColor: '#',
      // textColor: '#FFFFFF',
    });
  }
  if (tradeCount !== 0 && settingsStore.openTradesInTitle === 'showPill') {
    favicon.value.badge(tradeCount);
  } else {
    favicon.value.reset();
    console.log('reset');
  }
};
const resetDynamicLayout = (): void => {
  console.log(`resetLayout called for ${route?.fullPath}`);
  switch (route?.fullPath) {
    case '/trade':
      layoutStore.resetTradingLayout();
      break;
    case '/dashboard':
      layoutStore.resetDashboardLayout();
      break;
    default:
  }
};
const setTitle = () => {
  let title = 'freqUI';
  if (settingsStore.openTradesInTitle === OpenTradeVizOptions.asTitle) {
    title = `(${botStore.activeBotorUndefined?.openTradeCount}) ${title}`;
  }
  if (botStore.activeBotorUndefined?.botName) {
    title = `${title} - ${botStore.activeBotorUndefined?.botName}`;
  }
  document.title = title;
};

onBeforeUnmount(() => {
  console.log(botStore.canRunBacktest, '???');
  if (pingInterval.value) {
    clearInterval(pingInterval.value);
  }
});

onMounted(async () => {
  await settingsStore.loadUIVersion();
  pingInterval.value = window.setInterval(botStore.pingAll, 60000);
});

settingsStore.$subscribe((_, state) => {
  const needsUpdate = settingsStore.openTradesInTitle !== state.openTradesInTitle;
  if (needsUpdate) {
    setTitle();
    setOpenTradesAsPill(botStore.activeBotorUndefined?.openTradeCount || 0);
  }
});

watch(
  () => botStore.activeBotorUndefined?.botName,
  () => setTitle(),
);
watch(
  () => botStore.activeBotorUndefined?.openTradeCount,
  () => {
    if (settingsStore.openTradesInTitle === OpenTradeVizOptions.showPill) {
      setOpenTradesAsPill(botStore.activeBotorUndefined?.openTradeCount ?? 0);
    } else if (settingsStore.openTradesInTitle === OpenTradeVizOptions.asTitle) {
      setTitle();
    }
  },
);
</script>

<style lang="scss" scoped>
.logo {
  vertical-align: middle;
  height: 30px;
}

.dropdown-toggle::after {
  display: none;
}

.navbar-brand-title {
  padding-left: 0.5em;
}
.navbar {
  padding: 0.2rem 0rem;
}

.router-link-active,
.nav-link:active {
  color: white !important;
}
</style>
