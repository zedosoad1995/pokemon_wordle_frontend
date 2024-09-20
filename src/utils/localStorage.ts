interface StorageKeyMap {
  userToken: string
}

export class LocalStorage {
  private constructor() {}

  static get<K extends keyof StorageKeyMap>(key: K): StorageKeyMap[K] | null {
    const value = localStorage.getItem(key)
    if (value === null) {
      return null
    }

    return value as StorageKeyMap[K]
  }

  static set<K extends keyof StorageKeyMap>(key: K, value: StorageKeyMap[K]): void {
    localStorage.setItem(key, JSON.stringify(value))
  }

  static remove<K extends keyof StorageKeyMap>(key: K): void {
    localStorage.removeItem(key)
  }
}
