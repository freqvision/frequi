<template>
  <div :title="hint">
    <VIcon icon="mdi-information-outline" />
  </div>
</template>

<script setup lang="ts">
defineProps({
  hint: { type: String, required: true },
});
</script>

<style lang="scss" scoped></style>
