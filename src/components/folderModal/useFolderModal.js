import { ref, reactive } from "vue";

const showFolderModal = ref(false);
const folderModalState = ref("add");
const folderModalData = ref(null);

export default function useFolderModal() {
  const openFolderModal = (modalState, data) => {
    folderModalData.value = data || null;
    folderModalState.value = modalState || "add";
    showFolderModal.value = true;
  };

  const closeFolderModal = () => {
    showFolderModal.value = false;
    folderModalData.value = null;
  };

  return {
    openFolderModal,
    showFolderModal,
    folderModalData,
    closeFolderModal,
    folderModalState,
  };
}
