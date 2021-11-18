<template>
    <teleport to="#modal-container" :disabled="!isSearchModalOpen">
        <Modal :modalActive="isSearchModalOpen" :hideClose="true" @closeModal="closeSearchModal">            
            <div class="w-full flex h-10 mb-4 items-center">
                <div class="h-full flex items-center justify-center">
                    <i class="fas fa-search text-gray-500"></i>
                </div>
                <input id="searchInput" type="text" placeholder="Search notes..." class="flex-grow h-full pl-4 text-xl text-gray-700 ring-0 outline-none" v-model="searchStr">        
                <div class="border border-gray-400 rounded-md flex items-center justify-center text-sm p-1 text-gray-500 w-9 h-9">
                    esc
                </div>        
            </div>
            <div class="">
                <div v-if="loading" class="text-center">
                    <i class="fas fa-circle-notch fa-spin text-xl text-gray-500"></i>
                </div>
                <div v-if="!loading && !searchErr" class="space-y-2">
                    <ResultNote v-for="note in searchResults" @closeModal="closeSearchModal" :note="note" :key="note.id" />                    
                </div>
                <div v-if="!loading && searchErr" class="text-center text-red-300">
                    <span>No notes found</span>
                </div>
            </div>
        </Modal>
    </teleport>
</template>
<script>
import {ref, watch, onMounted} from 'vue'
import Modal from '../ui/Modal.vue'
import useSearchModal from './useSearchModal'
import useNotes from '../../api/useNotes'
import {debounce} from '../../utils'
import ResultNote from './ResultNote.vue'
export default {
    components: {
        Modal,
        ResultNote
    },
    setup() {
        
        const searchStr = ref('')
        const searchErr = ref(false)
        const loading = ref(false)
        const searchResults = ref([])
        const {isSearchModalOpen, closeSearchModal} = useSearchModal()
        const {searchNotes} = useNotes()
        
        watch( () => searchStr.value, debounce(() => {
            loading.value = true
            searchErr.value = false
            if(searchStr.value == "") {
                searchResults.value = []
                loading.value = false                
                return
            }
            
            searchNotes(searchStr.value).then(res => {           
                
                searchResults.value = res
                loading.value = false                
                if(res.length == 0) {                                
                    searchErr.value = true
                }else{                    
                    searchErr.value = false
                }
            })
            .catch((err) => {                
                searchErr.value = true
                loading.value = false
            })
            
        }, 500))

        watch(() => isSearchModalOpen.value, (newV, oldV) => {
            if(!newV) {
                searchResults.value = []
                searchStr.value = ''
            }else{
                console.log('focus', document.querySelector('#searchInput'))
                setTimeout(() => {

                    document.querySelector('#searchInput').focus()
                }, 300)
            }      
        })   

        onMounted(() => {
             window.addEventListener('keydown', (e) => {                                                 
               if(e.keyCode == 27) {
                  closeSearchModal()
               }
            })
        })

        return {
            isSearchModalOpen,
            closeSearchModal,
            searchStr,
            searchResults,
            loading,
            searchErr
        }
    },
}
</script>