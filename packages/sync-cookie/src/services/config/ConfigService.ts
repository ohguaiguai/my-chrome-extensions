import { Service } from "../Service";
import { StorageService } from "../storage/StorageService";

export class ConfigService extends Service {
  get<T>(key: string, defaultValue: T): Promise<T> {
    return this.getInstance(StorageService).get(key, defaultValue);
  }

  set<T>(key: string, value: T): Promise<void> {
    return this.getInstance(StorageService).set(key, value);
  }

  query(keys: string[]) {
    return this.getInstance(StorageService).query(keys);
  }

  useConfig<T>(key: string, defaultValue: T, fn: (arg: T) => void) {
    this.get(key, defaultValue).then((v) => {
      fn(v);
    });

    return this.getInstance(StorageService).watch((changes) => {
      for (const [k, { newValue }] of Object.entries(changes)) {
        if (k === key) {
          fn(newValue);
        }
      }
    });
  }
}
