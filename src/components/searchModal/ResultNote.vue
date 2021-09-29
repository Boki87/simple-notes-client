<template>
    <div @click="openNote" class="w-full bg-gray-100 rounded-md h-14 flex items-center pl-5 space-x-2 cursor-pointer hover:bg-gray-300 text-gray-600 hover:text-gray-700">
            <span>{{note.folder_name}}</span>
            <i class="fas fa-chevron-right"></i>
            <span>{{ note.title }}</span>
    </div>
</template>
<script>
import {useRouter} from 'vue-router'
export default {
    props: {
        note: {
            type: Object,
            required: true
        }
    },
    emits: ['closeModal'],
    setup(props, {emit}) {

        const router = useRouter()

        function openNote() {
            router.push({
                name: 'home',
                query: {
                    folder: props.note.folder_id,
                    note: props.note.id
                }
            })
            emit('closeModal')
        }

        return {
            openNote
        }
    },
}
</script>