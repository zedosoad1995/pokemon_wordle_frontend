import api from "./api"

export const createUser = (token: string) => {
  return api.post("/users", { token })
}
