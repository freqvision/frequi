<template>
  <div class="d-flex h-100 p-0 align-items-start">
    <!--    <textarea v-model="formattedLogs" class="h-100" readonly></textarea>-->
    <VTextarea v-model="formattedLogs" class="log-viewer" rows="25" readonly></VTextarea>
    <b-button id="refresh-logs" size="sm" @click="botStore.activeBot.getLogs">
      <VIcon icon="mdi-refresh" />
    </b-button>
  </div>
</template>

<script setup lang="ts">
import { useBotStore } from '@frequi/stores/ftbotwrapper';
import { onMounted, computed } from 'vue';

const botStore = useBotStore();

onMounted(async () => {
  botStore.activeBot.getLogs();
});

const formattedLogs = computed(() => {
  let result = '';
  for (let i = 0, len = botStore.activeBot.lastLogs.length; i < len; i += 1) {
    const log = botStore.activeBot.lastLogs[i];
    result += `${log[0]} - ${log[2]} - ${log[3]} - ${log[4]}\n`;
  }
  return result;
});
</script>

<style lang="scss" scoped>
textarea {
  width: 100%;
  min-height: 6em;
  resize: none;
  font-size: 0.75rem;
}
</style>
