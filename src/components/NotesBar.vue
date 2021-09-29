<template>
        <transition name="animation" mode="out-in">
            <div v-show="showNotesBar" class="w-[300px] min-w-[300px] h-full bg-white p-6 flex flex-col border-r border-gray-100 z-0 relative">
                    <div v-if="loadingNotes" class="w-full h-full flex items-center justify-center absolute top-0 left-0">
                        <i class="fas fa-circle-notch fa-lg fa-spin text-gray-600"></i>
                    </div>

                    <template v-else>
                            <div>

                                <h1 class="text-xl font-bold mb-3">{{ folderName }}</h1>

                                <AppButton 
                                    @click="addNewNote" 
                                    :loading="loadingNewNote" 
                                    :disabled="loadingNewNote" 
                                    alignLeft
                                >
                                    <i class="fas fa-plus"></i>
                                    <span>Add new note</span>
                                </AppButton>
                            </div>

                                
                                <div class="mt-5 flex-grow overflow-auto space-y-3">
                                    <NoteCard 
                                        v-for="note in notes"
                                        :note="note"
                                        :key="note.id"
                                    />                                    
                                </div>
                    </template>
            </div>


        </transition>    
</template>
<script>
import {ref, watchEffect, onMounted, watch} from 'vue'
import {useRouter, useRoute} from 'vue-router'
import useNotes from '../api/useNotes'
import useFolders from '../api/useFolders'
import NoteCard from './NoteCard.vue'
import AppButton from './ui/AppButton.vue'
export default {
    components: {
        NoteCard,
        AppButton
    },
    setup(props) {
        
        const router = useRouter()
        const route = useRoute()
        const {notes, fetchNotes, loadingNotes, loadingNewNote, createNote} = useNotes()
        const {folders} = useFolders()

        const showNotesBar = ref(false)

        const folderName = ref('')

        const addNewNote = () => {            
            createNote(route.query.folder)
        }
 
        

        watch(() => [route.query.folder,route.query.note] , ([newFolder, newNote], [prevFolder, prevNote]) => {                        
            if(newFolder) {                
                 folderName.value = folders.value.filter(folder => folder.id == route.query.folder)[0].name

                 showNotesBar.value = true                
                 if(newFolder != prevFolder) {                     
                    showNotesBar.value = false
                    setTimeout(() => {                        
                            showNotesBar.value = true                                                
                            fetchNotes(route.query.folder)
                    }, 350)
                     
                 }
                    
                 
                
            }else{
                folderName.value = ''
                showNotesBar.value = false
            }
        })        

        // onMounted(() => {
        //     fetchNotes(route.query.folder)
        // })

        return {
            showNotesBar,
            notes,
            loadingNotes,
            folderName,
            addNewNote,
            loadingNewNote
        }
    },
}
</script>
<style scoped>
    .animation-leave-active,
    .animation-enter-active {
        transition: all 0.4s ease;        
    }

    .animation-enter-from,
    .animation-leave-to {
        opacity: 0;
        transform: translateX(-400px);
    }
</style>