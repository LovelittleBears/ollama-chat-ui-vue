import axios from 'axios'

const instance = axios.create({
  baseURL: import.meta.env.VITE_APP_URL,
  timeout: 5000
})

instance.interceptors.request.use(
  config => {

    return config
  }, e => {
    return Promise.reject(e)
  }
)


instance.interceptors.response.use(
  res => {
    
    if (res.data.code == 200) {
      return res.data
    }

    if (res.data.code == 401) {

      return res.data
    }
    
    return Promise.reject(new Error(res.data.msg))
  },
  e => {
    return Promise.reject(e)
  }
)

export default instance