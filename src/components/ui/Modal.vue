<template>
<transition name="modal-animtaion">
    <div @click="emitClose" v-show="modalActive" class="w-full h-screen fixed top-0 left-0 z-50">
        <div class="absolute top-o left-o w-full h-full bg-black bg-opacity-70"></div>

        <transition name="modal-animtaion-inner">
            <div @click.stop v-show="modalActive" class="min-h-[100px] max-w-[500px] bg-white rounded-md shadow-md relative m-auto mt-16">
                    <div v-if="!notClosable && !hideClose" @click="emitClose" class="w-7 h-7 bg-transparent absolute top-2 right-2 p-1 flex items-center justify-center rounded-full cursor-pointer hover:bg-gray-200">
                        <i class="fas fa-times"></i>
                    </div>
                    
                    <div class="text-lg text-center py-2">
                        <slot name="title"></slot>
                    </div>
                    <div class="p-5">
                        <slot></slot>
                    </div>

            </div>
        </transition>

    </div>
</transition>
</template>
<script>
export default {
    props: {
        modalActive: {
            type: Boolean,
            required: true
        },
        notClosable: {
            type: Boolean,   
            required: false         
        },
        hideClose: {
            type: Boolean            
        }
    },
    emits: ['closeModal'],
    setup(props, {emit}) {
        

        const emitClose = () => {        
            if(props.notClosable) {
                return
            }    
            emit('closeModal')
        }

        

        return {        
            emitClose
        }
    },
}
</script>
<style scoped>
    .modal-animtaion-enter-active,
    .modal-animtaion-leave-active {
        transition: opacity 0.4s ease-in-out;
        opacity: 1;
    }

    .modal-animtaion-enter-from,
    .modal-animtaion-leave-to {
        opacity: 0
    }


    .modal-animtaion-inner-leave-active {
        transition: all 0.3s ease;
    }

    .modal-animtaion-inner-enter-active {
        transition: all 0.3s ease;
    }

    .modal-animtaion-inner-enter-from,
    .modal-animtaion-inner-leave-to {
        opacity: 0.6;
        transform: translateY(-100px);
    }

</style>