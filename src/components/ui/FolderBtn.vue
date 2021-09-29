<template>
    <div @click="setActiveFolder" class="border-0 w-full h-12 rounded-md transition duration-300 active:duration-0 active:text-gray-900 px-3 space-x-3 bg-gray-50 text-gray-600 hover:bg-gray-300  active:bg-gray-200 flex items-center cursor-pointer relative" :class="{'bg-gray-200' : isActive}">
        <div class="h-full flex-grow flex items-center space-x-3">
            <i class="fas fa-folder-open"></i>
            <span>{{ folder.name }}</span>
        </div>
        <i class="fas fa-ellipsis-h" @click="showOptions = !showOptions"></i>

        <div v-if="showOptions" v-click-away="closeOptions" class="absolute top-11 right-1 w-32 z-10 shadow-md rounded-md bg-white overflow-hidden">
            <div @click="deleteFolder" class="h-9 border-b border-gray-300 border-opacity-50 flex items-center pl-3 hover:bg-gray-50 space-x-2">
                <i class="far fa-edit"></i>
                <span>Delete</span>
            </div>
            <div @click="editFolder" class="h-9 flex items-center pl-3 hover:bg-gray-50 space-x-2">
                <i class="fas fa-trash-alt"></i>
                <span>Edit</span>
            </div>
        </div>
    </div>
</template>
<script>
import {ref, watchEffect} from 'vue'
import {useRouter, useRoute} from 'vue-router'
export default {
    
    props: {
        folder: {
            type: Object,
            required: true
        }
    },

    emits: [
        'deleteFolder',
        'editFolder',
    ],

    setup(props, {emit}) {

        const router = useRouter()
        const route = useRoute()
        const isActive = ref(false)

        let showOptions = ref(false)
        
        let folder = props.folder

        function closeOptions() {            
            if(showOptions.value) {
                showOptions.value = false
            }
        }


        function setActiveFolder() {
            if(route.query.folder == props.folder.id) {
                return
            }
            router.push({
                name: 'home',
                query: {                    
                    folder:props.folder.id
                }
            })
        }


        function editFolder() {
            showOptions.value = false
            emit('editFolder', props.folder)
        }
        function deleteFolder() {
            showOptions.value = false
            emit('deleteFolder', props.folder.id)
        }

        watchEffect(() => {
            if(route.query.folder == props.folder.id) {
                isActive.value = true
            }else{
                isActive.value = false
            }
        })

        return {
            folder,
            showOptions,
            closeOptions,
            setActiveFolder,
            isActive,
            editFolder,
            deleteFolder
        }
    },
}
</script>