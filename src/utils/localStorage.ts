export interface ICell {
  pokemon?: string
  rarityPerc?: number
}

export interface StorageKeyMap {
  userToken: string
  gameState: {
    board: ICell[][]
    numTries: number
    hasSubmitted: boolean
    isGameOver: boolean
    score: number
  }
}

export const gameStateFallback: StorageKeyMap["gameState"] = {
  board: [
    [{}, {}, {}],
    [{}, {}, {}],
    [{}, {}, {}]
  ],
  numTries: 10,
  hasSubmitted: false,
  isGameOver: false,
  score: 900
}

export const fallbacks: Partial<{
  [K in keyof StorageKeyMap]: StorageKeyMap[K]
}> = {
  gameState: gameStateFallback
}

export class LocalStorage {
  private constructor() {}

  static get<K extends keyof StorageKeyMap>(key: K): StorageKeyMap[K] | null {
    const value = localStorage.getItem(key)

    if (value === null) {
      return null
    }

    if (["gameState"].includes(key)) {
      return JSON.parse(value) as StorageKeyMap[K]
    }

    return value as StorageKeyMap[K]
  }

  static set<K extends keyof StorageKeyMap>(key: K, value: StorageKeyMap[K]): void {
    localStorage.setItem(key, typeof value === "string" ? value : JSON.stringify(value))
  }

  static remove<K extends keyof StorageKeyMap>(key: K): void {
    localStorage.removeItem(key)
  }
}
