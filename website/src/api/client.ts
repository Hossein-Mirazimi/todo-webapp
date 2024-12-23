import axios from "axios";

export const fetchClient = axios.create({
    baseURL: 'https://jsonplaceholder.typicode.com',
});