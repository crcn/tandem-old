export class SyntheticLocalStorage {
  constructor(private _data: Map<string, string> = new Map()) {

  }

  get length() {
    return this._data.size;
  }

  getItem(key) {
    return this._data;
  }

  setItem(key: string, value: string) {
    this._data.set(key, value);
  }

  removeItem(key: string) {
    this._data.delete(key);
  }

  clear() {
    this._data.clear();
  }

  key(index: number) {
    return this._data.keys[index];
  }
}