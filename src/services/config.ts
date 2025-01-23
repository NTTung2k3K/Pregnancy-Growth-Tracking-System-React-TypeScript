import axios from "axios";
import { CookiesTokenService } from "./cookies.service";

export const BASE_URL = "https://localhost:7286/api";

export const configHeaders = () => {
  return {
    Authorization: `Bearer ${CookiesTokenService.get()}`,
    "Content-Type": "application/json",
  };
};

export const https = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
