import axios from 'axios'
import { message } from 'antd'
import { useAuthStore } from '../store/useAuthStore'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 10000,
})

request.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

request.interceptors.response.use(
  (response) => {
    const res = response.data
    if (res.code !== 200) {
      message.error(res.message || 'Request Error')
      return Promise.reject(new Error(res.message || 'Request Error'))
    }
    return response
  },
  (error) => {
    const msg = error.response?.data?.message || error.message || 'Request Error'
    message.error(msg)

    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
    }

    return Promise.reject(error)
  },
)

export default request
