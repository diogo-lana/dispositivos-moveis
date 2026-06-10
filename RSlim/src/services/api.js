import axios from "axios";

const api = axios.create({
  baseURL: "https://6a285d334e1e783349a5737b.mockapi.io/api/rslim",
});

export default api;