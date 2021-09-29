<template>
    <teleport to="#modal-container" :disabled="!showFolderModal">
        <Modal :modalActive="showFolderModal" @closeModal="closeModal">
            <template v-slot:title>
                <span v-if="folderModalState == 'add'">Add New Folder</span>
                <span v-if="folderModalState == 'edit'">Edit Folder</span>
            </template>
            <template v-slot:default>
                <form @submit.prevent="formSubmitHandler">
                    <div class="mt-5">
                        <label for="">Folder Name:</label>
                        <input required type="text" id="folder_name" placeholder="New Notes Folder" class="block w-full text-lg border-gray-300 border rounded-md h-12 px-3 focus:ring-2 focus:ring-gray-400 outline-none text-gray-700" v-model="folderName">                
                    </div>
                    <div class="mt-5">
                        <AppButton type="submit" :loading="loadingFolders" :disabled="loadingFolders">
                            <span class="text-xl font-bold">{{folderModalState == 'add' ? 'Add' : 'Save'}}</span>
                        </AppButton>
                    </div>
                </form>
            </template>
        </Modal>
    </teleport>
</template>
<script>
import {ref, watch} from 'vue'
import Modal from '../ui/Modal.vue'
import AppButton from '../ui/AppButton.vue'
import useFolders from '../../api/useFolders'
import useFolderModal from '../folderModal/useFolderModal'

export default {
    components: {
        AppButton,
        Modal
    },
    setup(props) {

        const {showFolderModal, folderModalData, closeFolderModal, folderModalState} = useFolderModal()

        const folderName = ref('')

        watch(() => folderModalData, () => {                        
            if(folderModalData.value) {
                folderName.value = folderModalData.value.name
            }else{
                folderName.value = ''
            }            
        }, { deep: true })

        const {createFolder, loadingFolders, updateFolder} = useFolders()

        const closeModal = () => {      
            folderName.value = ''         
            closeFolderModal()
        }

        const attemptCreateFolder = () => {
            createFolder(folderName.value).then(() => {
                closeModal()
            })            
        }

        const attemptUpdateFolder = () => {            
            updateFolder(folderModalData.value.id, folderName.value).then(() => {
                closeModal()
            })            
        }



        function formSubmitHandler() {
            if(folderModalState.value == 'add') {
                attemptCreateFolder()
            }else{
                attemptUpdateFolder()
            }
        }


        watch(() => props.modalActive, () => {            
            if(!props.modalActive) {
                folderName.value = ''
            }
        })


        return {
            closeModal,
            loadingFolders,
            formSubmitHandler,
            folderName,            
            showFolderModal,
            folderModalState
        }
    },
}
</script>