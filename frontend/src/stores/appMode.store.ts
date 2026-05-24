// frontend/src/stores/appMode.store.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

export type AppMode = 'project' | 'graduation';

export const useAppModeStore = defineStore('appMode', () => {
  const mode = ref<AppMode | null>(
    sessionStorage.getItem('appMode') as AppMode | null
  );

  function setMode(m: AppMode) {
    mode.value = m;
    sessionStorage.setItem('appMode', m);
  }

  function clearMode() {
    mode.value = null;
    sessionStorage.removeItem('appMode');
  }

  return { mode, setMode, clearMode };
});
