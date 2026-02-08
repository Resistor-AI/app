import * as SecureStore from "expo-secure-store";
import { SupportedStorage } from "@supabase/supabase-js";

const CHUNK_SIZE = 2000;

function chunkKey(key: string, index: number): string {
  return `${key}__chunk_${index}`;
}

async function getItem(key: string): Promise<string | null> {
  const first = await SecureStore.getItemAsync(key);
  if (first === null) return null;

  const countRaw = await SecureStore.getItemAsync(`${key}__chunks`);
  if (!countRaw) return first;

  const count = parseInt(countRaw, 10);
  const parts = [first];
  for (let i = 1; i < count; i++) {
    parts.push((await SecureStore.getItemAsync(chunkKey(key, i))) ?? "");
  }
  return parts.join("");
}

async function setItem(key: string, value: string): Promise<void> {
  if (value.length <= CHUNK_SIZE) {
    await SecureStore.setItemAsync(key, value);
    await SecureStore.deleteItemAsync(`${key}__chunks`).catch(() => {});
    return;
  }

  const count = Math.ceil(value.length / CHUNK_SIZE);
  await SecureStore.setItemAsync(key, value.slice(0, CHUNK_SIZE));
  for (let i = 1; i < count; i++) {
    const chunk = value.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
    await SecureStore.setItemAsync(chunkKey(key, i), chunk);
  }
  await SecureStore.setItemAsync(`${key}__chunks`, String(count));
}

async function removeItem(key: string): Promise<void> {
  const countRaw = await SecureStore.getItemAsync(`${key}__chunks`);
  if (countRaw) {
    const count = parseInt(countRaw, 10);
    for (let i = 1; i < count; i++) {
      await SecureStore.deleteItemAsync(chunkKey(key, i));
    }
    await SecureStore.deleteItemAsync(`${key}__chunks`);
  }
  await SecureStore.deleteItemAsync(key);
}

export const secureStorageAdapter: SupportedStorage = {
  getItem,
  setItem,
  removeItem,
};
