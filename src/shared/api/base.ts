import axios from "axios";

// Expo bundles EXPO_PUBLIC_* env vars via babel-plugin-transform-inline-environment-variables
declare const process: { env: Record<string, string | undefined> }

export const apiClient = axios.create({
  baseURL: process.env['EXPO_PUBLIC_API_URL'],
  timeout: 10_000,
  headers: {
    "Content-Type": "application/json",
  },
});
