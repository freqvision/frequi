<template>
  <div class="copy-container position-relative">
    <VIcon
      v-if="isSupported && isValid"
      icon="mdi-content-copy"
      role="button"
      class="copy-button position-absolute end-0 mt-1 me-2"
      @click="copy(typeof content === 'string' ? content : JSON.stringify(content))"
    />
    <pre class="text-start border p-1 mb-0"><code>{{ content }}</code></pre>
  </div>
</template>

<script setup lang="ts">
import { useClipboard } from '@vueuse/core';

defineProps({
  content: { type: [String, Array<string>], required: true },
  isValid: { type: Boolean, default: true },
});

const { copy, isSupported } = useClipboard();
</script>

<style lang="scss" scoped>
.copy-container {
  .copy-button {
    opacity: 0;
  }

  &:hover {
    .copy-button {
      opacity: 1;
    }
  }
}
</style>
