import axios from "axios";

const tbAxios = axios.create({
    baseURL: "http://localhost:8080",
    headers: {
        Accept: 'application/json',
    },
});

export { tbAxios };