import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://fullstack-todo-react-ts-backend-strapi.onrender.com/api",
  timeout: 5000,
});

export default axiosInstance;
