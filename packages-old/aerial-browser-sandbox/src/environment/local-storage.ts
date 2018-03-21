import { weakMemo } from "aerial-common2";

export const getSEnvLocalStorageClass = weakMemo((context: any) => {
  class SEnvLocalStorage implements Storage {

    private _data: Map<string, string>;

    [key: string]: any 
    [index: number]: string;

    constructor(entries: Array<[string, string]>, private _onChange: (entries: Array<[string, string]>) => any = () => {}) {
      this._data = new Map(entries);
    }

    get length() {
      return this._data.size;
    }

    clear(): void {
      this._data.clear();
      this._didChange();
    }

    getItem(key: string): string | null {
      return this._data.get(key);
    }

    key(index: number): string | null {
      const entries = Array.from(this._data.entries());
      return entries[index] && entries[index][0];
    }
    removeItem(key: string): void {
      this._data.delete(key);
      this._didChange();
    }
    setItem(key: string, data: string): void {
      this._data.set(key, data);
      this._didChange();
    }

    private _didChange() {
      this._onChange(Array.from(this._data.entries()));
    }
  }

  return SEnvLocalStorage;
});