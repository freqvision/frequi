<template>
  <b-card no-body class="mb-2">
    <template #header>
      <div
        class="d-flex flex-row align-items-center justify-content-between"
        role="button"
        @click="visible = !visible"
      >
        <span class="fw-bold fd-italic">Blacklist</span>
        <VIcon
          v-if="!visible"
          icon="mdi-chevron-down"
          :class="!visible ? 'visible' : 'invisible'"
          role="button"
          class="fs-4"
        />
        <VIcon
          v-if="visible"
          icon="mdi-chevron-up"
          :class="visible ? 'visible' : 'invisible'"
          role="button"
          class="fs-4"
        />
      </div>
    </template>
    <b-collapse v-model="visible">
      <b-card-body>
        <div class="d-flex mb-4 align-items-center gap-2">
          <span class="col-auto">Copy from:</span
          ><b-form-select v-model="copyFromConfig" size="sm" :options="configNames" />
          <b-button title="Copy" size="sm" @click="pairlistStore.duplicateBlacklist(copyFromConfig)"
            ><VIcon icon="mdi-content-copy"
          /></b-button>
        </div>
        <b-input-group
          v-for="(item, i) in pairlistStore.config.blacklist"
          :key="i"
          class="mb-2"
          size="sm"
        >
          <b-form-input v-model="pairlistStore.config.blacklist[i]" />
          <b-input-group-append>
            <b-button size="sm" @click="pairlistStore.removeFromBlacklist(i)"
              ><VIcon icon="mdi-close"
            /></b-button>
          </b-input-group-append>
        </b-input-group>
        <b-button size="sm" @click="pairlistStore.addToBlacklist()">Add</b-button>
      </b-card-body>
    </b-collapse>
  </b-card>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import { usePairlistConfigStore } from '@frequi/stores/pairlistConfig';
const pairlistStore = usePairlistConfigStore();
const copyFromConfig = ref('');
const visible = ref(false);

const configNames = computed(() =>
  pairlistStore.savedConfigs.filter((c) => c.name !== pairlistStore.config.name).map((c) => c.name),
);
</script>
<style lang="scss" scoped></style>
