import request from '@/utils/request'

// 图片上传
export const userUploadAvatarService = (avatar) =>
  request.post('/common/upload', avatar)
