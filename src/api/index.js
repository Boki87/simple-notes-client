import axios from "axios";

const s3url = `https://simple-notes-avatars.s3.eu-central-1.amazonaws.com`;

const apiUrl = process.env.NODE_ENV == "production"
      ? "https://simple-notes-api-vq656.ondigitalocean.app"
      : "http://localhost:8000",

const api = axios.create({
  baseURL:apiUrl,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage["simple-notes-token"];
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

export { api, s3url, apiUrl };
