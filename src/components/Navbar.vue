<template>
    <div class="w-[300px] min-w-[300px] h-full bg-gray-50 p-6 flex flex-col z-10">
        <div>
            
                <div @click="showProfileModal=true" class="w-full h-14 flex items-center bg-white rounded-md text-gray-600 pl-4 space-x-3 cursor-pointer hover:bg-gray-300 transition-all duration-300">
                    <i v-if="userAvatar == ''" class="fas fa-user fa-lg"></i>
                    <div v-if="userAvatar != ''" class="w-10 h-10 bg-gray-400 flex items-center justify-center">
                            <img :src="userAvatar" class="object-cover min-h-full min-w-full" alt="user avatar">
                    </div>
                    <span class="text-md">
                        {{userName}}
                    </span>
                </div>
            

            <AppButton @click="openSearchModal" alignLeft bg="white" class="mt-6">
                <div class="w-full h-full flex items-center space-x-3">
                    <i class="fas fa-search"></i>
                    <div class="flex-grow">Search notes...</div>
                    <div class="border border-gray-400 rounded-md flex items-center justify-center text-sm p-1 text-gray-500">
                        ⌘K
                    </div>
                </div>

            </AppButton>
        </div>


        <div class="mt-10 flex-grow overflow-y-auto">   
            <template v-if="!loadingFolders">
                <FolderBtn 
                    class="mt-4" 
                    v-for="folder in folders" 
                    :folder="folder" 
                    :key="folder.id"  
                     @deleteFolder="deleteFolderAttempt"
                     @editFolder="editFolderAttempt"
                />
            </template>         
            <div v-else class="text-center">
                <i class="fas fa-circle-notch fa-spin"></i>
            </div>
        </div>

        <div>

            <AppButton @click="openFolderModal('add')" alignLeft bg="white" class="mt-6">
                <i class="fas fa-plus"></i>
                <span>Add new folder</span>
            </AppButton>

            <AppButton @click="logOut" alignLeft bg="white" class="mt-6">
                <i class="fas fa-sign-out-alt transform rotate-180"></i>
                <span>Logout</span>
            </AppButton>
        </div>
        
        <FolderModal />        
        <ProfileModal :showProfileModal="showProfileModal" @closeModal="closeProfileModal"/>        
    </div>    
</template>
<script>
import {onMounted, ref, computed} from 'vue'
import {useStore} from 'vuex'
import {useRouter} from 'vue-router'
import AppButton from '../components/ui/AppButton.vue'
import FolderBtn from '../components/ui/FolderBtn.vue'
import useFolders from '../api/useFolders'
import FolderModal from './folderModal/FolderModal.vue'
import useFolderModal from './folderModal/useFolderModal'
import useConfirmModal from '../components/confirmDialog/useConfirmModal'
import useSearchModal from '../components/searchModal/useSearchModal'
import ProfileModal from './profileModal/ProfileModal.vue'
import {s3url} from '../api'
export default {

    components: {
        AppButton,
        FolderBtn,
        FolderModal,
        ProfileModal
    },

    setup() {

        let showProfileModal = ref(false)
        let newFolderModalShow = ref(false)
        const store = useStore();
        const router = useRouter();

        const {folders, fetchFolders, loadingFolders, deleteFolder} = useFolders()
        const {openConfirmDialog} = useConfirmModal()
        const {openFolderModal} = useFolderModal()
        const {openSearchModal} = useSearchModal()


        let userName = computed(() => {
            return store.getters.user?.name || ''        
        })

        let userAvatar = computed(() => {
            return store.getters.user?.avatar ? `${s3url}/${store.getters.user.avatar}` : ''        
        })

        const logOut = () => {
            store.dispatch('logOut')
            .then(() => {
                router.push({name: 'login'})
            })
        }


        const closeNewFolderModal = () => {            
            newFolderModalShow.value = false
        }

        const deleteFolderAttempt = (id) => {
             openConfirmDialog('Delete folder?', () => {              
                 router.replace({name:"home"})
                 deleteFolder(id)
            })
        }


        const editFolderAttempt = (folder) => {            
                openFolderModal('edit', folder)
        }


        const closeProfileModal = () => {
            showProfileModal.value = false
        }

        onMounted(async () => {
            await fetchFolders()

            router.replace({
                name: 'home'                    
            })
            if(folders.value.length > 0) {
                setTimeout(() => {
                    router.push({
                        name: 'home',
                        query: {
                            folder: folders.value[0].id
                        }
                    })
                }, 300)
            }

            window.addEventListener('keydown', (e) => {                                
               if(e.metaKey && e.keyCode == 75) {
                   openSearchModal()
               }
            })
        }) 

        return {
            userName,
            folders,
            loadingFolders,
            logOut,
            newFolderModalShow,
            closeNewFolderModal,
            fetchFolders,            
            deleteFolderAttempt,
            openFolderModal,
            editFolderAttempt,
            openSearchModal,
            closeProfileModal,
            showProfileModal,
            userAvatar
        }
    },
}
</script>