import { request } from '@/utils'

export const getListDetail = params =>
  request.get('/playlist/detail', { params })

export const getSimiPlaylists = id => 
  request.get(`/simi/playlist?id=${id}`)

export function getUserList(uid){
  return request({
    url:'user/playlist',
    params:{
      uid
    }
  });
}