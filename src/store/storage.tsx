import { createMMKV } from "react-native-mmkv";
import { StateStorage } from "zustand/middleware";

export const storage = createMMKV({
  id: "resistor-user-storage",
  encryptionKey: "resistor-ai-secure-key", // In production, this should be fetched from SecureStore
});

export const zustandStorage: StateStorage = {
  setItem: (name, value) => {
    return storage.set(name, value);
  },
  getItem: (name) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: (name) => {
    return storage.remove(name);
  },
};
