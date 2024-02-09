import { loadString, saveString } from "../utils";

const KEY = "cost-count-2024-01-09";

export async function setItem<T>(key: string, value: T) {
  try {
    const data = await all();
    await saveString(KEY, JSON.stringify({ ...data, [key]: value }));
    return true;
  } catch (error) {
    console.error("Error saving data", error);
    return false;
  }
}

export async function getItem<T>(key: string): Promise<T | null> {
  try {
    const data = await all();
    return data[key];
  } catch (error) {
    console.error("Error getting data", error);
    return null;
  }
}

export async function all() {
  try {
    const data = await loadString(KEY) ?? "{}";
    return JSON.parse(data);
  } catch (error) {
    console.error("Error getting data", error);
    return null;
  }
}