import api from "./api"

interface getBoardRes {
  board: {
    cols: string[]
    rows: string[]
  }
  answers: string[][][]
}

export const getBoard = (boardNum: number): Promise<getBoardRes> => {
  return api.get(`/boards/${boardNum}`)
}
