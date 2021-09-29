<template>
  
    <router-view />
  
    <ConfirmDialog />
    <SearchModal />
</template>
<script>
import {ref} from 'vue'
import ConfirmDialog from './components/confirmDialog/ConfirmDialog.vue'
import SearchModal from './components/searchModal/SearchModal.vue'
export default {
    components: {
        ConfirmDialog,
        SearchModal
    },

    setup() {
        let showConfirm = ref(false)


        return {
            showConfirm
        }
    }
    
}
</script>