<template>
  <div class="d-inline-block">
    <div :class="isProfitable ? 'triangle-up' : 'triangle-down'"></div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  profit: { type: Number, required: true },
});
const isProfitable = computed(() => {
  return props.profit > 0;
});
</script>

<style scoped lang="scss">
.triangle-up {
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 0.45rem 0.7rem 0.45rem;
  border-color: transparent transparent rgba(var(--v-theme-success), 1) transparent;
}
.triangle-down {
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0.7rem 0.45rem 0 0.45rem;
  border-color: rgba(var(--v-theme-error), 1) transparent transparent transparent;
}
</style>
