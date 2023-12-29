import request from '@/utils/request'

// 获取员工数量数据
export const getEmployeeListService = (begin, end) => {
  return request.get('/admin/report/employeeStatistics', {
    params: {
      begin,
      end
    }
  })
}

// 获取商品数量数据
export const getShoppingListService = (begin, end) => {
  return request.get('/admin/report/shoppingStatistics', {
    params: {
      begin,
      end
    }
  })
}
