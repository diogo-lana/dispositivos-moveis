import axios from "axios";

const BASE_URL = "http://192.168.100.5:8000";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export default api;
