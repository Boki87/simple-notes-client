<template>
    <div @click="openNote" class="w-full max-h-36 min-h-[100px] block bg-gray-50 rounded-md overflow-hidden p-3 cursor-pointer hover:bg-gray-200 transition-all duration-300 relative" :class="{'bg-gray-200' : isActive}">
        <span class="text-gray-400 text-sm">{{updatedAt}}</span>
        <h4>{{note.title}}</h4>        
        <p class="text-gray-500 text-sm mt-3 overflow-ellipsis overflow-hidden prose" v-html="note.body"></p>        
    </div>
</template>
<script>
import {watchEffect, ref, computed} from 'vue'
import {useRouter, useRoute} from 'vue-router' 
import {format} from 'date-fns'
export default {
    props: {
        note: {
            type: Object,
            required: true
        }
    },

    setup(props) {

        const router = useRouter()
        const route = useRoute()
        const isActive = ref(false)


        function openNote() {
            router.push({
                name: 'home',
                query: {
                    ...route.query,
                    note: props.note.id
                }
            })
        }

        let updatedAt = computed(() => {
            return format(new Date(props.note.updated_at), 'dd MMM yy')
        })

        watchEffect(() => {
            
            if(route.query.note && props.note.id == route.query.note) {                
                isActive.value = true
            }else{
                isActive.value = false
            }
        })

        return {
            openNote,
            isActive,
            updatedAt
        }
    },
}
</script>