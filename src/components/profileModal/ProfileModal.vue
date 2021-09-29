<template>
    <teleport to="#modal-container" :disabled="!showProfileModal">
        <Modal :modalActive="showProfileModal" @closeModal="closeModal">
            <template v-slot:title>
                <span class="text-xl text-center font-bold">
                    Profile Card
                </span>
            </template>

            <template v-slot:default v-if="user">                
                <form @submit.prevent="updateUserRequest">
                    <div class="">                        
                        <img v-if="userAvatar!=''" :src="userAvatar" class="object-contain" alt="">
                        <div v-if="userAvatar==''" class="w-full h-80 bg-gray-300 text-white flex items-center justify-center text-9xl">
                                <i class="fas fa-image"></i>
                        </div>


                        <label for="avatarInput" class="w-full h-12 rounded-md transition duration-300 active:duration-0 active:text-gray-900 bg-gray-100 text-gray-800 hover:bg-gray-200  active:bg-gray-400 flex items-center justify-center cursor-pointer mt-5">Select image</label>
                        <input type="file" class="hidden" id="avatarInput" name="avatarInput" @change="handleAvatarSelected">
                    </div>
                    <div class="mt-5">
                        <label for="">Name:</label>
                        <input required type="text" id="name" placeholder="" class="block w-full text-lg border-gray-300 border rounded-md h-12 px-3 focus:ring-2 focus:ring-gray-400 outline-none text-gray-700" v-model="updatedName">                
                    </div>
                    <div class="mt-5">
                        <label for="">Email:</label>
                        <input disabled required type="text" id="name" placeholder="" class="block w-full text-lg border-gray-300 border rounded-md h-12 px-3 focus:ring-2 focus:ring-gray-400 outline-none text-gray-700" :value="user.email">                
                    </div>
                    <div class="mt-5">
                        <AppButton :loading="isLoading" :disabled="isLoading">
                            Update
                        </AppButton>
                    </div>

                </form>
            </template>
        </Modal>
    </teleport>
</template>
<script>
import {computed, ref, watch} from 'vue'
import {useStore} from 'vuex'
import Modal from '../ui/Modal.vue'
import AppButton from '../ui/AppButton.vue'
import {api, s3url} from '../../api'
export default {

    props: {
        showProfileModal: {
            type: Boolean,
            requred: true
        }
    },

    components: {
        Modal,
        AppButton
    },

    emits: ['closeModal'],

    setup(props, {emit}) {

        const store = useStore()

        const imageFile = ref("")
        const imageUrl = ref("")
        const updatedName = ref("")        

        const isLoading = ref(false)        

        const user = computed(() => {
            return store.getters.user
        })

        const userAvatar = computed(() => {
            if(imageUrl.value != "") {
                return imageUrl.value
            }            

            if(user.value.avatar != null && user.value.avatar != "") {
                return `${s3url}/${user.value.avatar}`
            }

            return ""
        })

        function closeModal() {
            emit('closeModal')
        }

        function handleAvatarSelected(event) {
            if(event.target.files.length === 0) {
                imageFile.value = ""
                imageUrl.value = ""
                return
            }            
            imageFile.value = event.target.files[0]
        }



        async function updateUserRequest() {
            isLoading.value = true
            try {
                                
                let userUpdateRes = await api.put(`/api/user`, {name: updatedName.value})
                let updatedUser = userUpdateRes.data.user
                
                if(imageFile.value != "") {
                    let form = new FormData()
                    form.append('avatar', imageFile.value)
                    let avatarUpdateRes = await api.post(`/api/avatar`, form)
                    let updatedAvatar = avatarUpdateRes.data.user.avatar 

                    updatedUser.avatar = updatedAvatar
                }                 
                store.commit('SET_USER', updatedUser)
                isLoading.value = false
                closeModal()
            } catch (error) {
                isLoading.value = false
                console.log(error)
            }
        }


        watch(imageFile, () => {       
            if(imageFile.value == "") {                
                return
            }
            let fileReader = new FileReader()

            fileReader.readAsDataURL(imageFile.value)

            fileReader.addEventListener('load', () => {                
                imageUrl.value = fileReader.result
            })
        })

        watch(() => props.showProfileModal, () => {            
            if(!props.showProfileModal) {     
                document.querySelector("#avatarInput").value = null       
                imageFile.value = ""
                imageUrl.value = ""
            }else{
                updatedName.value = user.value.name
            }
        })

        return {
            closeModal,
            user,
            handleAvatarSelected,            
            userAvatar,
            updatedName,
            updateUserRequest,
            isLoading
        }
    },
}
</script>