<template>
    <div class="w-full h-full bg-gray-50 flex items-center justify-center">

        <div class="w-80 rounded-lg bg-white shadow-md p-5">
            <h4 class="text-center text-xl my-2">Simple Notes</h4>            
            <form @submit.prevent="attemptLogin">
                <div class="mt-5">
                    <label for="">Email:</label>
                    <input required type="email" id="email" placeholder="john.doe@email.com" class="block w-full text-lg border-gray-300 border rounded-md h-12 px-3 focus:ring-2 focus:ring-gray-400 outline-none text-gray-600" v-model="form.email">                
                </div>

                <div class="mt-5">
                    <label for="">Name:</label>
                    <input required type="text" id="name" placeholder="John Doe" class="block w-full text-lg border-gray-300 border rounded-md h-12 px-3 focus:ring-2 focus:ring-gray-400 outline-none text-gray-600" v-model="form.name">                
                </div>

                <div class="mt-5">
                    <label for="">Password:</label>
                    <input required type="password" id="password" placeholder="abc123" class="block w-full text-lg border-gray-300 border rounded-md h-12 px-3 focus:ring-2 focus:ring-gray-400 outline-none text-gray-600" v-model="form.password">
                </div>
                
                <div v-if="error" class="text-red-400 text-center text-md mt-5">
                    Wrong credentials
                </div>
                <div class="mt-5 flex space-x-2">                    
                        <AppButton type="submit" :loading="loading" :disabled="loading">          
                            <i class="fas fa-sign-in-alt"></i>          
                            <span>Registger</span>
                        </AppButton>                                                
                </div>
                <div class="mt-5 text-md text-center">
                    <p>
                            <span>
                                Already have an account?
                            </span>
                            <router-link :to="{name:'login'}" class="text-blue-400 hover:underline">
                                Login here
                            </router-link>
                    </p>
                </div>
                <div class="mt-5 text-center">
                    <span>or</span>
                </div>
            </form>
                <div class="mt-5">
                    <a :href="googleAuth">
                        <AppButton :loading="loading" :disabled="loading">          
                            <i class="fab fa-google"></i>
                        </AppButton> 
                    </a>
                </div>
        </div>  

    </div>
</template>
<script>
import {apiUrl} from '../api'
import {reactive, ref} from 'vue'
import {useStore} from 'vuex'
import {useRouter} from 'vue-router'
import AppButton from '../components/ui/AppButton.vue'
export default {
    components: {
        AppButton
    },
    setup() {

        let loading = ref(false)
        const store = useStore()
        const router = useRouter()

        let form = reactive({
            name: 'guest',
            email: 'guest@gmail.com',
            password: '1234567',            
        })

        let error = ref(false)
        

    const attemptLogin = () => {
        loading.value = true
        error.value = false
        store.dispatch('register', {...form, password_confirmation: form.password }).then( (res) => {            
            loading.value = false            
            router.push({name:'home'})                
        })
        .catch(err => {            
            loading.value = false
            error.value = true
            console.log(err)
        })
    }

        let googleAuth = apiUrl + 'api/login/google'

        return {
            form,
            attemptLogin,
            loading,
            error,
            googleAuth
        }
    },
}
</script>