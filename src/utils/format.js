// 封装格式化日期函数
export const formatTime = (time) => {
  return `${time[0]}年${time[1]}月${time[2]}日`
}

//把日期转换成 yyyy-MM-dd
export const formattedDate = (date) => {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const formattedDate = `${year}-${month}-${day}`
  return formattedDate
}
