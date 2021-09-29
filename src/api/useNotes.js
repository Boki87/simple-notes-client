import { ref } from "vue";
import { api } from "./index";

const notes = ref([]);
const note = ref(null);
const loadingNotes = ref(false);
const loadingNewNote = ref(false);
const loadingNote = ref(false);
const updatingNote = ref(false);

export default function useNotes() {
  const fetchNotes = async (folderId) => {
    loadingNotes.value = true;
    try {
      let res = await api.get(`/api/notes/folder/${folderId}`);
      notes.value = res.data;
      loadingNotes.value = false;
    } catch (err) {
      console.log(err);
      loadingNotes.value = false;
    }
  };

  const createNote = async (folderId) => {
    loadingNewNote.value = true;
    try {
      let res = await api.post(`/api/notes/folder/${folderId}`);
      notes.value.push(res.data);
      loadingNewNote.value = false;
    } catch (error) {
      console.log(error);
      loadingNewNote.value = false;
    }
  };

  const fetchNote = async (noteId) => {
    loadingNote.value = true;

    return api
      .get(`/api/notes/${noteId}`)
      .then((res) => {
        loadingNote.value = false;
        return res.data;
      })
      .catch((err) => {
        console.log(err);
        loadingNote.value = false;
      });
    // loadingNote.value = false;
    // note.value = res.data;
    // } catch (error) {
    //   console.log(error);
    //   loadingNote.value = false;
    // }
  };

  const updateNote = async (noteId, payload) => {
    console.log(payload);
    try {
      updatingNote.value = true;
      let res = await api.put(`/api/notes/${noteId}`, payload);
      notes.value.map((n) => {
        if (n.id == res.data.id) {
          n.title = res.data.title;
          n.body = res.data.body;
          n["updated_at"] = res.data["updated_at"];
        }

        return n;
      });
      updatingNote.value = false;
    } catch (error) {
      console.log(error);
      updatingNote.value = false;
    }
  };

  const searchNotes = async (str) => {
    try {
      let res = await api.get(`/api/notes/search/${str}`);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const deleteNote = (id) => {
    return api.delete(`api/notes/${id}`).then(() => {
      notes.value = notes.value.filter((n) => n.id !== id);
    });
  };

  return {
    notes,
    fetchNotes,
    loadingNotes,
    createNote,
    loadingNewNote,
    fetchNote,
    loadingNote,
    note,
    updatingNote,
    updateNote,
    searchNotes,
    deleteNote,
  };
}
