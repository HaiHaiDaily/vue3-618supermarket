import axios from 'axios'
import router from '@/router'
import { ElMessage } from 'element-plus'
import { useEmployeeStore } from '@/stores'

const baseURL = '/api'

const instance = axios.create({
  baseURL,
  timeout: 1000000
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    const employeeStore = useEmployeeStore()
    if (employeeStore.token) {
      // 让请求头携带token
      config.headers.token = employeeStore.token
    }
    return config
  },
  (err) => Promise.reject(err)
)

// 响应拦截器
instance.interceptors.response.use(
  (res) => {
    if (res.data.code === 1) {
      return res
    }
    // 处理业务失败，给出错误提示，抛出错误
    ElMessage.error(res.data.msg || '业务异常')
    return Promise.reject(res.data)
  },
  (err) => {
    // 错误的特殊情况 401 权限不足|token过期==> 拦截到login
    if (err.response?.status === 401) {
      router.push('/login')
    }
    // 一般错误 ==>  提示
    ElMessage.error(err.response.data.smg || '服务异常')
    return Promise.reject(err)
  }
)

export default instance
export { baseURL }
