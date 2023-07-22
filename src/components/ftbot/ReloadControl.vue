<template>
  <div class="d-flex align-items-center ms-2">
    <VCheckbox
      v-model="autoRefreshLoc"
      class="ms-auto float-end my-auto mt-1"
      title="AutoRefresh"
    ></VCheckbox>
    <VBtn
      class="m-1"
      color="secondary"
      size="24"
      title="Auto Refresh All bots"
      @click="botStore.allRefreshFull"
    >
      <VIcon>refresh</VIcon>
    </VBtn>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useBotStore } from '@frequi/stores/ftbotwrapper';

const botStore = useBotStore();
const autoRefreshLoc = computed({
  get() {
    return botStore.globalAutoRefresh;
  },
  set(newValue: boolean) {
    botStore.setGlobalAutoRefresh(newValue);
  },
});
</script>

<style scoped></style>
