<script setup lang="ts">
import { Trade } from '@frequi/types';
import { ref } from 'vue';
import TradeActions from './TradeActions.vue';

defineProps({
  trade: { type: Object as () => Trade, required: true },
  id: { type: Number, required: true },
  botApiVersion: { type: Number, required: true },
});
const emit = defineEmits([
  'forceExit',
  'forceExitPartial',
  'cancelOpenOrder',
  'reloadTrade',
  'deleteTrade',
]);
const popoverOpen = ref(false);

function forceExitHandler(item: Trade, ordertype: string | undefined = undefined) {
  popoverOpen.value = false;
  emit('forceExit', item, ordertype);
}
function forceExitPartialHandler(item: Trade) {
  popoverOpen.value = false;
  emit('forceExitPartial', item);
}
function cancelOpenOrderHandler(item: Trade) {
  popoverOpen.value = false;
  emit('cancelOpenOrder', item);
}
function handleReloadTrade(item: Trade) {
  popoverOpen.value = false;
  emit('reloadTrade', item);
}

function deleteTradeHandler(item: Trade) {
  popoverOpen.value = false;
  emit('deleteTrade', item);
}
</script>

<template>
  <div>
    <b-button
      :id="`btn-actions-${id}`"
      class="btn-xs"
      size="sm"
      title="Actions"
      @click="popoverOpen = !popoverOpen"
    >
      <VIcon icon="mdi-gesture-tap" />
    </b-button>
    <b-popover
      container="body"
      :target="`btn-actions-${id}`"
      :title="`Actions for ${trade.pair}`"
      triggers="manual"
      :show="popoverOpen"
      placement="left"
    >
      <trade-actions
        :trade="trade"
        :bot-api-version="botApiVersion"
        @force-exit="forceExitHandler"
        @force-exit-partial="forceExitPartialHandler"
        @delete-trade="deleteTradeHandler"
        @cancel-open-order="cancelOpenOrderHandler"
        @reload-trade="handleReloadTrade"
      />
      <VBtn class="mt-1 w-100 text-start" icon="cancel" @click="popoverOpen = false">
        Close Actions menu
      </VBtn>
    </b-popover>
  </div>
</template>

<style scoped></style>
