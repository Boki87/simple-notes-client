<template>
    <teleport to="#modal-container" :disabled="!isConfirmOpen">
        <Modal :modalActive="isConfirmOpen" :hideClose="true" @closeModal="confirmDialog(0)">
            <template v-slot:default>
                <div class="text-center text-xl">
                    {{confirmMessage}}
                </div>
                <div class="flex space-x-4 justify-center mt-6">
                    <AppButton @click="confirmDialog(1)">
                        <span>Confirm</span>
                    </AppButton>
                    <AppButton @click="confirmDialog(0)">
                        <span>Cancel</span>
                    </AppButton>
                </div>
            </template>
        </Modal>
    </teleport>
</template>
<script>
import Modal from '../ui/Modal.vue'
import useConfirmModal from './useConfirmModal'
import AppButton from '../ui/AppButton.vue'
export default {
    props: {
        message: {
            type: String,
            required: false,
            default: 'Confirm'
        }
    },

    components: {
        Modal,
        AppButton
    },
    setup() {
        const {confirmMessage, isConfirmOpen, openConfirmDialog, confirmDialog} = useConfirmModal()


        return {
            confirmMessage,
            isConfirmOpen,
            confirmDialog
        }
    },
}
</script>