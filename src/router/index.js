import Vue from 'vue'
import VueRouter from 'vue-router'

const Discovery = () => import('@/pages/discovery')
const PlaylistDetail = () => import('@/pages/playlist-detail')


const PersonalRecommendation = () => import('@/pages/discovery/personalRecommendation')
const SongList = () => import('@/pages/discovery/song-list')
// 内容需要居中的页面
export const layoutCenterNames = ['discovery', 'playlists', 'songs', 'mvs']

Vue.use(VueRouter)

export const menuRoutes = [
  {
    path: '/discovery',
    name: 'discovery',
    component: Discovery,
    children:[
      {
        path:'/',
        redirect:'personalRecommendation'
      },
      {
        path:'personalRecommendation',
        component:PersonalRecommendation,
        name:'personalRecommendation'
      },
      {
        path:'exclusive',
        name:'exclusive'
      },
      {
        path:'songlist',
        name:'songlist',
        component:SongList
      },
      {
        path:'leaderboard',
        name:'leaderboard'
      },
      {
        path:'singer',
        name:'singer'
      },
      {
        path:'new',
        name:'new'
      },
    ],
    meta: {
      title: '发现音乐',
      icon: '',
    },
  },
  {
    // 歌单详情页面
    path: '/playlists',
    name: 'playlists',
    // component: Playlists,
    meta: {
      title: '推荐歌单',
      icon: '',
    },
  },
  {
    path: '/songs',
    name: 'songs',
    // component: Songs,
    meta: {
      title: '最新音乐',
      icon: '',
    },
  },
  {
    path: '/mvs',
    name: 'mvs',
    // component: Mvs,
    meta: {
      title: '最新MV',
      icon: '',
    },
  },
]

const routes = [
  {
    path: '/',
    redirect: '/discovery',
  },
  {
    // 歌单详情
    path: '/playlist/:id',
    name: 'playlist',
    component: PlaylistDetail,
  },
  ...menuRoutes,
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
