import { ref } from "vue";

const isConfirmOpen = ref(false);
const confirmMessage = ref("Confirm?");
const callbackFn = ref(null);

export default function useConfirmDialog() {
  let defaultMsg = "Confirm?";

  const openConfirmDialog = (msg, cb) => {
    confirmMessage.value = msg ? msg : defaultMclosableclosableclosablesg;
    isConfirmOpen.value = true;
    callbackFn.value = cb;
  };

  const confirmDialog = (bool) => {
    if (bool == 1) {
      callbackFn.value();
      isConfirmOpen.value = false;
    } else {
      callbackFn.value = null;
      isConfirmOpen.value = false;
    }
  };

  return {
    confirmMessage,
    isConfirmOpen,
    openConfirmDialog,
    confirmDialog,
  };
}
