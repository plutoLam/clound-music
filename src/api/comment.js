import { request } from '@/utils'

export const getComment = (id,offset) => request.get(`/comment/playlist?id=${id}&offset=${offset}`)

export const getSongComment = (id,offset) => request.get(`/comment/music?id=${id}&offset=${offset}`)

