import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://strapi-todolist.onrender.com/api",
  timeout: 5000,
});

export default axiosInstance;
