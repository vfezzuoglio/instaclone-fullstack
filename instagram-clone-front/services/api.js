import { Platform } from "react-native";
import Constants from "expo-constants";

const envBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();

function isLocalhostUrl(url) {
  if (!url) return false;
  return url.includes("localhost") || url.includes("127.0.0.1");
}

function hostFromUri(value) {
  if (!value || typeof value !== "string") return null;
  return value.split(":")?.[0] || null;
}

function resolveDefaultHost() {
  const hostCandidates = [
    Constants.expoConfig?.hostUri,
    Constants.expoGoConfig?.debuggerHost,
    Constants.manifest2?.extra?.expoGo?.debuggerHost,
    Constants.manifest?.debuggerHost,
    Constants.manifest?.hostUri,
  ];

  const hostFromExpo = hostCandidates
    .map((item) => hostFromUri(item))
    .find(Boolean);

  if (hostFromExpo) {
    return hostFromExpo;
  }

  return Platform.OS === "android" ? "10.0.2.2" : "localhost";
}

const defaultHost = resolveDefaultHost();
const shouldUseEnvBaseUrl = !(Platform.OS !== "web" && isLocalhostUrl(envBaseUrl));

export const API_BASE_URL = shouldUseEnvBaseUrl && envBaseUrl
  ? envBaseUrl
  : `http://${defaultHost}:5042`;

export function buildApiUrl(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}

function cleanErrorMessage(raw) {
  if (!raw) return "Request failed.";
  if (typeof raw === "string") return raw;
  if (typeof raw?.title === "string") return raw.title;
  if (typeof raw?.message === "string") return raw.message;
  return "Request failed.";
}

export async function apiRequest(path, { method = "GET", token, body } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(buildApiUrl(path), {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const rawText = await response.text();
  let payload = null;

  if (rawText) {
    try {
      payload = JSON.parse(rawText);
    } catch {
      payload = rawText;
    }
  }

  if (!response.ok) {
    throw new Error(cleanErrorMessage(payload));
  }

  return payload;
}
