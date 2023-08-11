import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { initBots, useBotStore } from '@frequi/stores/ftbotwrapper';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/freqtrade',
    name: 'Home',
    component: () => import('@frequi/views/HomeView.vue'),
    meta: {
      allowAnonymous: true,
    },
  },
  {
    path: '/freqtrade/trade',
    name: 'Freqtrade Trading',
    component: () => import('@frequi/views/TradingView.vue'),
  },
  {
    path: '/freqtrade/graph',
    name: 'Freqtrade Graph',
    component: () => import('@frequi/views/ChartsView.vue'),
  },
  {
    path: '/freqtrade/logs',
    name: 'Freqtrade Logs',
    component: () => import('@frequi/views/LogView.vue'),
  },
  {
    path: '/freqtrade/backtest',
    name: 'Freqtrade Backtest',
    component: () => import('@frequi/views/BacktestingView.vue'),
  },
  {
    path: '/freqtrade/dashboard',
    name: 'Freqtrade Dashboard',
    component: () => import('@frequi/views/DashboardView.vue'),
  },
  {
    path: '/freqtrade/balance',
    name: 'Freqtrade Balance',
    component: () => import('@frequi/components/ftbot/BotBalance.vue'),
  },
  {
    path: '/freqtrade/open_trades',
    component: () => import('@frequi/views/TradesList.vue'),
  },

  {
    path: '/freqtrade/trade_history',
    component: () => import('@frequi/views/TradesList.vue'),
    props: { history: true },
  },
  {
    path: '/freqtrade/pairlist',
    component: () => import('@frequi/components/ftbot/FTBotAPIPairList.vue'),
  },
  {
    path: '/freqtrade/settings',
    name: 'Freqtrade Settings',
    component: () => import('@frequi/views/SettingsView.vue'),
  },
  {
    path: '/freqtrade/login',
    name: 'Login',
    component: () => import('@frequi/views/LoginView.vue'),
    meta: {
      allowAnonymous: true,
    },
  },
  {
    path: '/freqtrade/pairlist_config',
    name: 'Pairlist Configuration',
    component: () => import('@frequi/views/PairlistConfigView.vue'),
  },
  {
    path: '/(.*)*',
    name: '404',
    component: () => import('@frequi/views/Error404View.vue'),
  },
];

const router = createRouter({
  history: createWebHistory('/'),
  routes,
});

router.beforeEach(async (to, from, next) => {
  // Init bots here...
  initBots();
  const botStore = useBotStore();

  if (!to.meta?.allowAnonymous && !botStore.hasBots) {
    // Forward to login if login is required
    next({
      path: '/freqtrade/login',
      query: { redirect: to.fullPath },
    });
  } else {
    next();
  }
});

export default router;
