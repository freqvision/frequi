<template>
  <div class="d-flex h-100 p-0 align-items-start">
    <!--    <textarea v-model="formattedLogs" class="h-100" readonly></textarea>-->
<!--    <VTextarea v-model="formattedLogs" class="log-viewer" rows="25" readonly></VTextarea>-->
    <div ref="scrollContainer" class="border p-1 text-start pb-5 w-100 h-100 overflow-auto">
      <pre
        v-for="(log, index) in botStore.activeBot.lastLogs"
        :key="index"
        class="m-0 overflow-visible"
        style="line-height: unset"
      ><span class="text-muted">{{ log[0] }} <span :class="getLogColor(log[3])">{{ log[3].padEnd(7, ' ') }}</span> {{ log[2] }} - </span><span class="text-{{ log[1] }}">{{ log[4] }}</span
      ></pre>
    </div>
    <div class="d-flex flex-column gap-1 ms-1">
      <b-button id="refresh-logs" size="sm" title="Reload Logs" @click="refreshLogs">
        <VIcon icon="mdi-refresh" />
      </b-button>
      <b-button size="sm" title="Scroll to bottom" @click="scrollToBottom">
        <VIcon icon="mdi-arrow-down-thick" />
      </b-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBotStore } from '@frequi/stores/ftbotwrapper';
import { onMounted } from 'vue';

const botStore = useBotStore();
const scrollContainer = ref<HTMLElement | null>(null);

onMounted(async () => {
  refreshLogs();
});

async function refreshLogs() {
  await botStore.activeBot.getLogs();
  scrollToBottom();
}

function getLogColor(logLevel: string) {
  switch (logLevel) {
    case 'WARNING':
      return 'text-warning';
    case 'ERROR':
      return 'text-danger';
    default:
      return 'text-secondary';
  }
}

function scrollToBottom() {
  if (scrollContainer.value) {
    scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight;
  }
}
</script>

<style lang="scss" scoped>
textarea {
  width: 100%;
  min-height: 6em;
  resize: none;
  font-size: 0.75rem;
}
</style>
