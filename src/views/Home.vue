<template>
    <div class="w-full h-full flex">
        <Navbar />
        <NotesBar />
        <Note />
    </div>
</template>
<script>
import Navbar from '../components/Navbar.vue'
import NotesBar from '../components/NotesBar.vue'
import Note from '../components/Note.vue'
export default {

    components: {
        Navbar,
        NotesBar,
        Note
    },

    setup() {
        
    },
}
</script>