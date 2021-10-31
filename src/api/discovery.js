import { request } from '@/utils'

export const getBanner = () => request.get('/banner?type=0')

export const getNewSongs = () => request.get('/personalized/newsong')

export const getPersonalized = params =>
  request.get(`/personalized`, { params })
  // 可选参数 : limit: 取出数量 , 默认为 30 (不支持 offset)
  // 接口地址 : /personalized
  // 调用例子 : /personalized?limit=1
export const getPersonalizedMv = () => request.get(`/personalized/mv`)

export const getHighqualityTags = () => request.get(`/playlist/highquality/tags`)

export const getHotCategory  = () => request.get(`/playlist/hot`)

export const getHqualityPlaylist  = (cat,before) => request.get(`/top/playlist/highquality?cat=${cat}&before=${before}`)