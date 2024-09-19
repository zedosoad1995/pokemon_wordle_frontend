import api from "./api"

export const getPokemons = (): Promise<{ pokemons: string[] }> => {
  return api.get("/pokemons")
}
