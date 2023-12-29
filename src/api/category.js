import request from '@/utils/request'

// 分类分页，模糊匹配查询
export const categoryGetListService = (data) => {
  return request.post('/admin/category/page', data)
}

//根据id获取分类信息
export const categoryGetByIdService = (id) => {
  return request.get(`/admin/category/info/${id}`)
}

//新增分类
export const categoryInsertService = (data) => {
  return request.post('/admin/category/insert', data)
}

//根据id删除分类
export const categoryDelByIdService = (id) => {
  return request.delete(`/admin/category/delete/${id}`)
}

//修改分类
export const categoryUpdateService = (data) => {
  return request.post('/admin/category/update', data)
}

//获取所有分类信息
export const categoryGetAllService = () => {
  return request.get('/admin/category')
}
