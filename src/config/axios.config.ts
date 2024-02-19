import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://strapi-todolist.onrender.com/api",
});

export default axiosInstance;
