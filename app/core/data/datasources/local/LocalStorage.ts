// src/core/data/datasources/local/LocalStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export class LocalStorage {
  private static instance: LocalStorage;

  private constructor() {}

  public static getInstance(): LocalStorage {
    if (!LocalStorage.instance) {
      LocalStorage.instance = new LocalStorage();
    }
    return LocalStorage.instance;
  }

  public async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
      console.error('Error saving data to storage:', e);
      throw e;
    }
  }

  public async getItem<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.error('Error reading data from storage:', e);
      throw e;
    }
  }

  public async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.error('Error removing data from storage:', e);
      throw e;
    }
  }

  public async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      console.error('Error clearing storage:', e);
      throw e;
    }
  }

  public async getAllKeys(): Promise<readonly string[]> {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (e) {
      console.error('Error getting all keys from storage:', e);
      throw e;
    }
  }

  public async multiGet<T>(keys: string[]): Promise<Map<string, T | null>> {
    try {
      const result = await AsyncStorage.multiGet(keys);
      const dataMap = new Map<string, T | null>();

      result.forEach(([key, value]) => {
        dataMap.set(key, value ? JSON.parse(value) : null);
      });

      return dataMap;
    } catch (e) {
      console.error('Error multi-getting data from storage:', e);
      throw e;
    }
  }

  public async multiSet<T>(keyValuePairs: [string, T][]): Promise<void> {
    try {
      const pairs = keyValuePairs.map(([key, value]) => [
        key,
        JSON.stringify(value),
      ]);
      await AsyncStorage.multiSet(pairs as [string, string][]);
    } catch (e) {
      console.error('Error multi-setting data to storage:', e);
      throw e;
    }
  }

  public async multiRemove(keys: string[]): Promise<void> {
    try {
      await AsyncStorage.multiRemove(keys);
    } catch (e) {
      console.error('Error multi-removing data from storage:', e);
      throw e;
    }
  }
}

export default LocalStorage.getInstance();