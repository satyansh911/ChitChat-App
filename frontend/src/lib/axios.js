import axios from "axios";

export const axiosInstance = axios.create({
    baseURL : "http://locahost:5001/api",
    withCredentials : true,
});