<template>
  <div>
    <div class="mb-2">
      <label class="me-auto h3">Pair Locks</label>
      <b-button class="float-end" size="sm" @click="botStore.activeBot.getLocks">
        <VIcon icon="mdi-refresh" />
      </b-button>
    </div>
    <div>
      <b-table class="table-sm" :items="botStore.activeBot.activeLocks" :fields="tableFields">
        <template #cell(actions)="row">
          <b-button
            class="btn-xs ms-1"
            size="sm"
            title="Delete trade"
            @click="removePairLock(row.item)"
          >
            <VIcon icon="mdi-delete" />
          </b-button>
        </template>
      </b-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { timestampms } from '@frequi/shared/formatters';
import { Lock } from '@frequi/types';

import { showAlert } from '@frequi/stores/alerts';
import { useBotStore } from '@frequi/stores/ftbotwrapper';
import { TableField } from 'bootstrap-vue-next';
const botStore = useBotStore();

const tableFields: TableField[] = [
  { key: 'pair', label: 'Pair' },
  { key: 'lock_end_timestamp', label: 'Until', formatter: (value) => timestampms(value as number) },
  { key: 'reason', label: 'Reason' },
  { key: 'actions' },
];

const removePairLock = (item: Lock) => {
  console.log(item);
  if (item.id !== undefined) {
    botStore.activeBot.deleteLock(item.id);
  } else {
    showAlert('This Freqtrade version does not support deleting locks.');
  }
};
</script>

<style scoped></style>
