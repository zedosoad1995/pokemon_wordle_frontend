import { submitAnswers } from "@/api/boards"
import { gameStateFallback, LocalStorage, type StorageKeyMap } from "@/utils/localStorage"
import { AxiosError } from "axios"
import { ref } from "vue"

export const useGameState = () => {
  const gameState = ref<StorageKeyMap["gameState"]>(gameStateFallback)
  const imagesBoard = ref<string[][]>([
    ["", "", ""],
    ["", "", ""],
    ["", "", ""]
  ])

  const initGameState = async (userToken: string) => {
    const gameStateStorage = LocalStorage.get("gameState")
    if (gameStateStorage !== null) {
      gameState.value = gameStateStorage

      for (let i = 0; i < gameStateStorage.board.length; i++) {
        for (let j = 0; j < gameStateStorage.board[i].length; j++) {
          if (!gameStateStorage.board[i][j].pokemon) continue

          imagesBoard.value[i][j] = import.meta.env.VITE_ASSETS_URL + "/poke_imgs/" + gameStateStorage.board[i][j].pokemon + ".png"
        }
      }

      if (gameStateStorage.isGameOver && !gameStateStorage.hasSubmitted) {
        await submitGame(userToken)
      }
    } else {
      LocalStorage.set("gameState", gameStateFallback)
    }
  }

  const submitGame = async (userToken: string) => {
    const answers = gameState.value.board.map((row) => row.map(({ pokemon }) => pokemon ?? ""))
    await submitAnswers(1, userToken, answers).then(() => {
      gameState.value.hasSubmitted = true
      LocalStorage.set("gameState", gameState.value)
    }).catch((err) => {
      if(err instanceof AxiosError){
        if(err.response?.data.code === "ALREADY_SUBMITED"){
          gameState.value.hasSubmitted = true
          LocalStorage.set("gameState", gameState.value)
          return
        }
      }

      throw err
    })
  }

  return {
    gameState,
    imagesBoard,
    initGameState,
    submitGame
  }
}
