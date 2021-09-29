<template>
    <div v-if="showNote" class="flex-grow h-full p-5">
        <div v-if="!loadingNote && note" class="mx-auto max-w-[800px] min-w-[300px] flex flex-col h-full">
            <div class="w-full border-b border-gray-200 mb-5 flex items-center h-14 space-x-3 text-gray-600">
                    <span class="text-lg">{{ folderName }}</span>
                    <span>
                        <i class="fas fa-chevron-right"></i>
                    </span>
                    <span class="text-lg">
                        {{note.title}}
                    </span>               
                    <span v-if="updatingNote">
                        <i class="fas fa-circle-notch fa-spin text-gray-600"></i>
                    </span>     
                    <div class="flex-grow"></div>

                    <div @click="confirmDelete" class="w-10 h-10 flex items-center justify-center bg-white rounded-full hover:bg-gray-200 transition-all duration-300 cursor-pointer">
                        <i class="fas fa-trash-alt text-gray-500"></i>
                    </div>
            </div>
            <div class="flex-grow flex flex-col">
                <input type="text" class="border-none text-4xl font-bold pt-3 outline-none" :value="note.title" @input="noteTitleChangeHandler">
                
                <p class="mb-8 mt-2">
                    <span class="text-gray-500">
                        Last modified at: 
                    </span>
                    <span class="text-gray-700 font-bold">
                        {{updatedAt}}
                    </span>
                </p>

                

                <textarea class="outline-none flex-grow resize-none" placeholder="Note content here" :value="note.body" @input="noteBodyChangeHandler"></textarea>
            </div>
        </div>
        <div v-if="loadingNote" class="w-full h-full flex items-center justify-center text-3xl">
            <i class="fas fa-circle-notch fa-lg fa-spin text-gray-600"></i>
        </div>
    </div>
</template>
<script>
import {ref, watchEffect, watch, onMounted, computed} from 'vue'
import {useRouter, useRoute} from 'vue-router' 
import useNotes from '../api/useNotes'
import useFolders from '../api/useFolders'
import {debounce} from '../utils'
import {format} from 'date-fns'
import useConfirmModal from '../components/confirmDialog/useConfirmModal'
export default {
    setup() {
        const router = useRouter()
        const route = useRoute()
        const {fetchNote, loadingNote, updateNote, updatingNote, deleteNote} = useNotes()
        const {folders} = useFolders()        

        const note = ref(null)

        const showNote = ref(false)
        const updatedAt = ref(null)

        const {openConfirmDialog} = useConfirmModal()


        let folderName = computed(() => {
            return folders.value.filter(folder => folder.id == route.query.folder)[0].name
        })


        function formatDate(timstamp) {
            return format(new Date(timstamp), 'dd MMM yy, h:mm a')
        }

        function updateNotApiCall() {
            updateNote(route.query.note, note.value)
            updatedAt.value = formatDate(new Date())
        }

        watch(() => route.query.note, () => {     
            if(route.query.note) {
                console.log('fetch note')
                fetchNote(route.query.note).then(res => {
                    note.value = res
                    updatedAt.value = formatDate(note.value.updated_at)
                })  
                .catch(err => {
                    showNote.value = false    
                })
                showNote.value = true
            }else{
                showNote.value = false
            }
        })

        let flag = ref(null)
        function noteTitleChangeHandler(event) {
            note.value.title = event.target.value
           flag.value = +new Date()
        }

        function noteBodyChangeHandler(event) {
            note.value.body = event.target.value
           flag.value = +new Date()
        }

        function confirmDelete() {
            openConfirmDialog('Sure you want to delte this note?', () => {
                deleteNote(note.value.id)
                .then(res => {
                    router.replace({
                        name: 'home',
                        query: {
                            folder: route.query.folder
                        }
                    })
                })
                
            })
        }

        watch(() => flag.value, debounce(() => {                            
                updateNotApiCall()
            }, 500), {deep: true, immediate:false})

        return {
            showNote,
            note,
            folderName,
            loadingNote,
            updatingNote,
            updatedAt,
            noteTitleChangeHandler,
            noteBodyChangeHandler,
            confirmDelete
        }
    },
}
</script>