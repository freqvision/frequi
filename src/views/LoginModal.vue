<template>
  <div>
    <b-button @click="openLoginModal()"
      ><VIcon icon="mdi-login" class="me-1" />{{ loginText }}</b-button
    >
    <b-modal
      id="modal-prevent-closing"
      v-model="loginViewOpen"
      title="Login to your bot"
      @ok="handleOk"
    >
      <login
        ref="loginForm"
        in-modal
        :existing-auth="loginInfo"
        @login-result="handleLoginResult"
      />
    </b-modal>
  </div>
</template>

<script setup lang="ts">
import Login from '@frequi/components/BotLogin.vue';
import { AuthStorageWithBotId } from '@frequi/types';
import { nextTick, ref } from 'vue';

defineProps({
  loginText: { required: false, default: 'Login', type: String },
});
const loginViewOpen = ref(false);
const loginForm = ref<typeof Login>();
const loginInfo = ref<AuthStorageWithBotId | undefined>(undefined);
const handleLoginResult = (result: boolean) => {
  if (result) {
    loginViewOpen.value = false;
  }
};
const handleOk = (evt) => {
  evt.preventDefault();
  loginForm.value?.handleSubmit();
};
const openLoginModal = async (botInfo: AuthStorageWithBotId | undefined = undefined) => {
  loginInfo.value = botInfo;
  await nextTick();
  console.log('botinfo', botInfo);
  loginForm.value?.reset();
  loginViewOpen.value = true;
};
defineExpose({
  openLoginModal,
});
</script>

<style scoped></style>
