<template>
    <div v-if="showNote" class="flex-grow h-full p-5 overflow-y-auto">
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
                <input type="text" class="border-none text-4xl font-bold pt-3 outline-none focus:outline-none" :value="note.title" @input="noteTitleChangeHandler">
                
                <p class="mb-8 mt-2">
                    <span class="text-gray-500">
                        Last modified at: 
                    </span>
                    <span class="text-gray-700 font-bold">
                        {{updatedAt}}
                    </span>
                </p>                
                <div v-if="editor" class="flex flex-wrap gap-2 mb-4">
                    
                    <button @click="editor.chain().focus().toggleHeading({level: 1}).run()" class="px-3 h-6 flex items-center justify-center border border-gray-400 rounded-sm" :class="{'bg-gray-300': editor.isActive('heading', { level: 1 })}">h1</button>
                    <button @click="editor.chain().focus().toggleHeading({level: 2}).run()" class="px-3 h-6 flex items-center justify-center border border-gray-400 rounded-sm" :class="{'bg-gray-300': editor.isActive('heading', { level: 2 })}">h2</button>
                    <button @click="editor.chain().focus().toggleHeading({level: 3}).run()" class="px-3 h-6 flex items-center justify-center border border-gray-400 rounded-sm" :class="{'bg-gray-300': editor.isActive('heading', { level: 3 })}">h3</button>
                    <button @click="editor.chain().focus().toggleHeading({level: 4}).run()" class="px-3 h-6 flex items-center justify-center border border-gray-400 rounded-sm" :class="{'bg-gray-300': editor.isActive('heading', { level: 4 })}">h4</button>
                    
                    <button @click="editor.chain().focus().toggleBold().run()" class="px-3 h-6 flex items-center justify-center border border-gray-400 rounded-sm font-bold" :class="{'bg-gray-300': editor.isActive('bold')}">B</button>

                    <button @click="editor.chain().focus().toggleItalic().run()" class="px-3 h-6 flex items-center justify-center border border-gray-400 rounded-sm italic" :class="{'bg-gray-300': editor.isActive('italic')}">I</button>

                    <button @click="editor.chain().focus().toggleBulletList().run()" class="px-3 h-6 flex items-center justify-center border border-gray-400 rounded-sm" :class="{'bg-gray-300': editor.isActive('bulletList')}">ul</button>
                    <button @click="editor.chain().focus().toggleOrderedList().run()" class="px-3 h-6 flex items-center justify-center border border-gray-400 rounded-sm" :class="{'bg-gray-300': editor.isActive('orderedList')}">ol</button>

                    <button @click="editor.chain().focus().toggleCodeBlock().run()" class="px-3 h-6 flex items-center justify-center border border-gray-400 rounded-sm" :class="{'bg-gray-300': editor.isActive('codeBlock')}">CODE</button>
                    
                </div>
                <EditorContent class="flex-grow overflow-auto" :editor="editor" />
                
                <!-- <textarea class="outline-none flex-grow resize-none" placeholder="Note content here" :value="note.body" @input="noteBodyChangeHandler"></textarea> -->
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
import {useEditor, EditorContent} from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

export default {
    components: {
        EditorContent
    },

    setup() {
        const router = useRouter()
        const route = useRoute()
        const {fetchNote, loadingNote, updateNote, updatingNote, deleteNote} = useNotes()
        const {folders} = useFolders()        

        const note = ref(null)

        const showNote = ref(false)
        const updatedAt = ref(null)
        let flag = ref(null)
        const {openConfirmDialog} = useConfirmModal()

        const editor = useEditor({
            content: '',
            extensions: [StarterKit],
            editorProps: {
                attributes: {
                    class: 'text-gray-600 prose prose-sm lg:prose focus:outline-none h-full max-h-full overflow-auto'
                }
            },
            onUpdate: (context) => {                
                note.value.body = context.editor.getHTML()
                flag.value = +new Date()
            }
        })

        let folderName = computed(() => {
            return folders.value.filter(folder => folder.id == route.query.folder)[0].name
        })


        function formatDate(timstamp) {
            return format(new Date(timstamp), 'dd MMM yy, h:mm a')
        }

        function updateNoteApiCall() {
            updateNote(route.query.note, note.value)
            updatedAt.value = formatDate(new Date())
        }

        watch(() => route.query.note, () => {     
            if(route.query.note) {
                fetchNote(route.query.note).then(res => {
                    note.value = res
                    updatedAt.value = formatDate(note.value.updated_at)
                    editor.value.commands.setContent(res.body)
                })  
                .catch(err => {
                    showNote.value = false    
                })
                showNote.value = true
            }else{
                showNote.value = false
            }
        })
        
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
                updateNoteApiCall()
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
            confirmDelete,
            editor
        }
    },
}
</script>
