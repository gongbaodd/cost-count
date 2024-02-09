import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "cost-count-2024-01-09";

export async function setItem<T>(key: string, value: T) {
  try {
    const data = (await AsyncStorage.getItem(KEY)) ?? {};
    await AsyncStorage.setItem(KEY, JSON.stringify({ ...data, [key]: value }));
    return true;
  } catch (error) {
    console.error("Error saving data", error);
    return false;
  }
}

export async function getItem<T>(key: string): Promise<T | null> {
  try {
    const data = (await AsyncStorage.getItem(KEY)) ?? "{}";
    return JSON.parse(data)[key];
  } catch (error) {
    console.error("Error getting data", error);
    return null;
  }
}
