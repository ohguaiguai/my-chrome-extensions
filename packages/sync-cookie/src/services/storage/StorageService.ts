import { Service } from "../Service";

type Changes = {
  [key: string]: chrome.storage.StorageChange;
};

export class StorageService extends Service {
  async get<T>(key: string, defaultValue: T): Promise<T> {
    const res = await chrome.storage.local.get([key]);

    return Object.hasOwn(res, key) ? res[key] : defaultValue;
  }

  async query(keys: string[]) {
    return chrome.storage.local.get(keys);
  }

  async set<T>(key: string, value: T): Promise<void> {
    await chrome.storage.local.set({
      [key]: value,
    });
  }

  watch(fn: (changes: Changes) => void) {
    const listener = (changes: Changes, namespace: string) => {
      if (namespace !== "local") {
        return;
      }

      fn(changes);
    };

    chrome.storage.onChanged.addListener(listener);

    return () => {
      chrome.storage.onChanged.removeListener(listener);
    };
  }
}
