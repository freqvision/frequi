<template>
  <form class="d-flex" @submit.prevent="save">
    <b-form-input
      v-model="newName"
      size="sm"
      class="w-100"
      placeholder="Bot name"
      style="border-style: solid; border-width: 1px"
      autofocus
    />

    <div class="d-flex ms-2">
      <b-button type="submit" size="sm" title="Save">
        <VIcon icon="mdi-check" />
      </b-button>

      <b-button class="ms-1" size="sm" title="Cancel" @click="$emit('cancelled')">
        <VIcon icon="mdi-close" />
      </b-button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { useBotStore } from '@frequi/stores/ftbotwrapper';
import { BotDescriptor } from '@frequi/types';
import { onMounted, ref } from 'vue';

const props = defineProps({
  bot: { type: Object as () => BotDescriptor, required: true },
});
const emit = defineEmits(['cancelled', 'saved']);
const botStore = useBotStore();
const newName = ref<string>('');

onMounted(() => {
  newName.value = props.bot.botName;
});

const save = () => {
  botStore.updateBot(props.bot.botId, {
    botName: newName.value,
  });

  emit('saved');
};
</script>
