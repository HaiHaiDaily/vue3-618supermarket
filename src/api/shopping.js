import request from '@/utils/request'

// 新增商品
export const shoppingInsertService = (data) => {
  return request.post('/admin/shopping/insert', data)
}

// 分页，模糊匹配查询商品
export const shoppingGetListService = (data) => {
  return request.post('/admin/shopping/page', data)
}

// 根据id获取商品信息
export const shoppingGetByIdService = (id) => {
  return request.get(`/admin/shopping/info/${id}`)
}

//根据id修改商品
export const shoppingUpdateService = (data) => {
  return request.post('/admin/shopping/update', data)
}

//根据id删除商品
export const shoppingDleByIdService = (id) => {
  return request.delete(`/admin/shopping/delete/${id}`)
}
