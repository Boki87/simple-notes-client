<template>
    <div>
        logging in ...
    </div>
</template>
<script>
import {onMounted} from 'vue'
import {useRouter, useRoute} from 'vue-router'
import {useStore} from 'vuex'
export default {
    setup() {
        const router = useRouter()
        const route = useRoute()
        const store = useStore()
        

        onMounted(() => {
            console.log(route.query)
            let token = route.query.token
            localStorage.setItem('simple-notes-token', token)
            store.dispatch('autoLogin')
            .then(() => {
                router.push({name:'home'})
            })
        })

    },
}
</script>