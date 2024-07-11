import axios from "axios";

const api = axios.create({
    baseURL: `http://${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}`
})

export default api;
