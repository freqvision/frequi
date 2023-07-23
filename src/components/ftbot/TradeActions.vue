<template>
  <div class="d-flex flex-column">
    <VBtn
      v-if="botApiVersion <= 1.1"
      class="text-start"
      size="small"
      title="Forceexit"
      icon="disabled_by_default"
      @click="$emit('forceExit', trade)"
    >
      Forceexit
    </VBtn>
    <VBtn
      v-if="botApiVersion > 1.1"
      class="text-start"
      size="small"
      title="Forceexit limit"
      icon="disabled_by_default"
      @click="$emit('forceExit', trade, 'limit')"
    >
      Forceexit limit
    </VBtn>
    <VBtn
      v-if="botApiVersion > 1.1"
      class="text-start mt-1"
      size="small"
      title="Forceexit market"
      icon="disabled_by_default"
      @click="$emit('forceExit', trade, 'market')"
    >
      Forceexit market
    </VBtn>
    <VBtn
      v-if="botApiVersion > 2.16"
      class="text-start mt-1"
      size="small"
      title="Forceexit partial"
      icon="tab_close"
      @click="$emit('forceExitPartial', trade)"
    >
      Forceexit partial
    </VBtn>
    <VBtn
      v-if="botApiVersion >= 2.24 && trade.open_order_id"
      class="btn-xs text-start mt-1"
      size="small"
      title="Cancel open orders"
      icon="close"
      @click="$emit('cancelOpenOrder', trade)"
    >
      Cancel open order
    </VBtn>
    <VBtn
      v-if="botApiVersion >= 2.28"
      class="text-start mt-1"
      size="small"
      title="Reload"
      icon="sync_problem"
      @click="$emit('reloadTrade', trade)"
    >
      Reload Trade
    </VBtn>
    <VBtn
      class="text-start mt-1"
      size="small"
      title="Delete trade"
      icon="delete"
      @click="$emit('deleteTrade', trade)"
    >
      Delete
    </VBtn>
  </div>
</template>

<script setup lang="ts">
import { Trade } from '@frequi/types';

defineProps({
  botApiVersion: {
    type: Number,
    default: 1.0,
  },
  trade: {
    type: Object as () => Trade,
    required: true,
  },
});
defineEmits(['forceExit', 'forceExitPartial', 'cancelOpenOrder', 'reloadTrade', 'deleteTrade']);
</script>

<style scoped lang="scss"></style>
