<template>
  <div class="d-flex flex-row">
    <b-form-group class="flex-grow-1" :label="label" label-for="indicatorSelector">
      <VSelect
        v-model="selAvailableIndicator"
        :items="columns"
        density="compact"
        :clearable="false"
        @update:model-value="emitIndicator"
      />
    </b-form-group>
    <b-button size="sm" title="Abort" class="ms-1 mt-auto" variant="secondary" @click="abort">
      <VIcon icon="mdi-close" />
    </b-button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

const props = defineProps({
  modelValue: { required: false, default: '', type: String },
  columns: { required: true, type: Array as () => string[] },
  label: { required: true, type: String },
});
const emit = defineEmits(['update:modelValue', 'indicatorSelected']);

const selAvailableIndicator = ref('');

function emitIndicator() {
  emit('indicatorSelected', selAvailableIndicator.value);
  emit('update:modelValue', selAvailableIndicator.value);
}
function abort() {
  selAvailableIndicator.value = '';
  emitIndicator();
}

onMounted(() => {
  selAvailableIndicator.value = props.modelValue;
});

watch(
  () => props.modelValue,
  (newValue) => {
    selAvailableIndicator.value = newValue;
  },
);
</script>

<style scoped></style>
