import {ref} from 'vue'

const isSearchModalOpen = ref(false)

export default function useSearchModal() {

    const openSearchModal = () => {
        isSearchModalOpen.value = true
    }

    const closeSearchModal = () => {
        isSearchModalOpen.value = false
    }

    return {
        isSearchModalOpen,
        openSearchModal,
        closeSearchModal
    }
}