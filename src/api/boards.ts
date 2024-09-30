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

interface getAnswerFreqAndScoreRes {
  freqs: Record<string, number>[][]
  isGameOver: boolean
  userPosition?: number
  totalPlays: number
}

export const getAnswerFreqAndScore = (
  boardNum: number,
  userToken: string
): Promise<getAnswerFreqAndScoreRes> => {
  return api.get(`/boards/${boardNum}/answers/freq-and-score`, {
    params: {
      userToken
    }
  })
}

export const updateAnswer = (
  boardNum: number,
  userToken: string,
  row: number,
  col: number,
  answer: string
) => {
  return api.put(`/boards/${boardNum}/answers/one`, {
    userToken,
    row,
    col,
    answer
  })
}

export const submitAnswers = (boardNum: number, userToken: string, answers: string[][]) => {
  return api.put(`/boards/${boardNum}/answers/submit`, {
    userToken,
    answers
  })
}
