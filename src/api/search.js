import { request,requestWithoutInterceptors } from '@/utils'

export const getHotDetail = () => requestWithoutInterceptors.get('/search/hot/detail')

export const getSearchSuggest = (keywords) => requestWithoutInterceptors.get(`/search/suggest?keywords=${keywords}`)