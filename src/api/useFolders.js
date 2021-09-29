import { ref } from "vue";
import { api } from "./index";

const folders = ref([]);
const loadingFolders = ref(false);

export default function useFolders() {
  const fetchFolders = async () => {
    loadingFolders.value = true;
    try {
      let res = await api.get("/api/folders");
      folders.value = res.data;
      loadingFolders.value = false;
    } catch (err) {
      console.log(err);
      loadingFolders.value = false;
    }
  };

  const createFolder = (name) => {
    return api
      .post("/api/folders", { name })
      .then((res) => {
        folders.value = [...folders.value, res.data];
        loadingFolders.value = false;
      })
      .catch((err) => {
        console.log(err);
        loadingFolders.value = false;
      });
  };

  const deleteFolder = (id) => {
    return api
      .delete(`/api/folders/${id}`)
      .then((res) => {
        if (res.data == 1) {
          folders.value = folders.value.filter((folder) => folder.id != id);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const updateFolder = (id, name) => {
    return api
      .put(`/api/folders/${id}`, { name })
      .then((res) => {
        folders.value.map((folder) => {
          if (folder.id == id) {
            folder.name = res.data.name;
          }

          return folder;
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return {
    folders,
    fetchFolders,
    loadingFolders,

    createFolder,
    deleteFolder,
    updateFolder,
  };
}
