<template>
  <VBtn class="nav-link" icon @click="toggleNight">
    <VIcon :icon="themeIcon" size="24" />
  </VBtn>
</template>

<script setup lang="ts">
import { useSettingsStore } from '@frequi/stores/settings';
import { useColorMode } from 'bootstrap-vue-next';
import { onMounted, ref } from 'vue';

const mode = useColorMode();

const activeTheme = ref('');
const settingsStore = useSettingsStore();
const emit = defineEmits(['change']);
const themeIcon = ref('');

const setTheme = (themeName: string) => {
  // If theme is already active, do nothing.
  if (activeTheme.value === themeName) {
    return;
  }
  if (themeName.toLowerCase() === 'bootstrap' || themeName.toLowerCase() === 'bootstrap_dark') {
    // const styles = document.getElementsByTagName('style');
    if (activeTheme.value) {
      // Only transition if simple mode is active
      document.body.classList.add('ft-theme-transition');
      window.setTimeout(() => {
        document.body.classList.remove('ft-theme-transition');
      }, 1000);
    }
    mode.value = themeName.toLowerCase() === 'bootstrap' ? 'light' : 'dark';
  }
  // Save the theme as localstorage
  settingsStore.currentTheme = themeName;
  activeTheme.value = themeName;
  const theme = themeName.toLowerCase() === 'bootstrap' ? 'light' : 'dark';
  themeIcon.value = theme === 'light' ? 'dark_mode' : 'light_mode';
  emit('change', theme);
};

onMounted(() => {
  if (settingsStore.currentTheme) setTheme(settingsStore.currentTheme);
});

const toggleNight = () => {
  setTheme(activeTheme.value === 'bootstrap' ? 'bootstrap_dark' : 'bootstrap');
};
</script>

<style scoped></style>
