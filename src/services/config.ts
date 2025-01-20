import axios from "axios";

const BASE_URL = "https://localhost:7286/api";

export const https = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
