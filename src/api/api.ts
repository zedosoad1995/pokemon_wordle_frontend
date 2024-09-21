import axios from "axios"
import type { AxiosInstance, AxiosResponse } from "axios"

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

api.interceptors.response.use((response: AxiosResponse) => response.data)

export default api
