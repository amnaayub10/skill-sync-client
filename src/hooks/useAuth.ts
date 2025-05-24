import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export function useLogin() {
  return useMutation({
    mutationFn: (credentials) => {
      return axios.post("/api/auth/login", credentials);
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (userData) => {
      return axios.post("/api/auth/register", userData);
    },
  });
}