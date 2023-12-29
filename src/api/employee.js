import request from '@/utils/request'

// 员工登录接口
export const employeeLoginService = (userData) => {
  return request.post('/admin/employee/login', userData)
}

//获取当前员工数据
export const employeeGetInfoService = () => {
  return request.get('/admin/employee/info')
}

//根据id修改员工数据
export const employeeUpdateInfoService = (data) =>
  request.post('/admin/employee/update', data)

//员工分页查询
export const employeeGetListService = (params) => {
  return request.post('/admin/employee/page', params)
}

//当前员工修改密码
export const employeeUpdatePasswordService = (passwordDate) => {
  return request.post('/admin/employee/password', passwordDate)
}

//新增员工
export const employeeInsertService = (formData) => {
  return request.post('/admin/employee/insert', formData)
}

//根据id获取员工数据
export const employeeGetByIdService = (id) => {
  return request.get(`/admin/employee/info/${id}`)
}

//根据id删除员工数据
export const employeeDelService = (id) => {
  return request.delete(`/admin/employee/delete/${id}`)
}
