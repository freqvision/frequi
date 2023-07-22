<template>
  <main>
    <BotAlerts />
    <router-view />
  </main>
</template>

<script setup lang="ts">
import BotAlerts from '@frequi/components/ftbot/BotAlerts.vue';
</script>
<style lang="scss" scoped>
.container-main {
  padding: 0;
}
</style>
