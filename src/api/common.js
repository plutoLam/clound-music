import { request } from '@/utils'

export const Like = (id,cid,t,type) => request.get(`/comment/like?id=${id}&cid=${cid}&t=${t}&type=${type}`)

export const commitComment = (id,content,type) => request.get(`/comment?id=${id}&t=${content}&type=${type}`)

