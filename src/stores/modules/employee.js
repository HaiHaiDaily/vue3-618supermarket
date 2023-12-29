import { defineStore } from 'pinia'
import { ref } from 'vue'
import { employeeGetInfoService } from '@/api/employee'

// 员工模块 token setToken removeToken
export const useEmployeeStore = defineStore(
  'employee-Store',
  () => {
    const token = ref('')

    const setToken = (newToken) => {
      token.value = newToken
    }

    const removeToken = () => {
      token.value = ''
    }

    // 封装员工信息
    const employee = ref({})

    // 获取员工信息
    const getEmployee = async () => {
      //调用user API
      const res = await employeeGetInfoService()
      employee.value = res.data.data
    }

    //设置员工信息
    const setEmployee = async (obj) => {
      employee.value = obj
    }
    return {
      token,
      setToken,
      removeToken,
      employee,
      getEmployee,
      setEmployee
    }
  },
  {
    persist: true
  }
)
