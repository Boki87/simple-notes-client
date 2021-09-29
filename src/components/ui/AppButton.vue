<template>
    <button  
        class="border-0 block w-full h-12 rounded-md transition duration-300 active:duration-0 active:text-gray-900 px-3 space-x-3" :disabled="disabled"        
        :class="{
            'opacity-50 pointer-events-none' : disabled, 
            'text-left': alignLeft,
            'bg-white text-gray-700 hover:bg-gray-200  active:bg-gray-300' : bg == 'white',
            'bg-gray-100 text-gray-800 hover:bg-gray-200  active:bg-gray-400' : bg != 'white',
        }"
    >
            <slot v-if="!loading"></slot>
        <div v-else class="w-full h-full flex items-center justify-center">
            <i class="fas fa-circle-notch fa-spin"></i>
        </div>
    </button>
</template>

<script>
import { stringifyQuery } from 'vue-router'
export default {    
    props: {
        disabled: {
            required: false,
            type: Boolean
        },
        loading: {
            required: false,
            type: Boolean
        },
        alignLeft: {
            required: false,            
            type: Boolean
        },
        bg: {
            required: false,
            type: String
        }
    }    
}
</script>