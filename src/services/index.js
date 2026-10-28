import axios from "axios";

export const AXIOS = axios.create({
    baseURL: "https://api-tarefas-0od0.onrender.com/"
    // baseURL: "http://localhost:3000"
})