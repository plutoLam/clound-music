import { isDef, playModeMap } from '@/utils'

export default {
  currentIndex(state){
    const {currentSong, playlist} = state
    return playlist.findIndex(({id}) => id === currentSong.id)
  },

  nextSong(state,getters){
    const {playlist,playMode} = state
    if(playMode == playModeMap.sequence.code){
      return playlist[getSequenceNextIndex()]
    }else if(playMode == playModeMap.loop.code){
      return playlist[getLoopNextIndex()]
    }else if(playMode == playModeMap.random.code){
      return playlist[getRandomNextIndex()]
    }
    
    // 顺序
    function getSequenceNextIndex() {
      let nextIndex = getters.currentIndex + 1
      if (nextIndex > playlist.length - 1) {
        nextIndex = 0
      }
      return nextIndex
    }

    // 随机
    function getRandomNextIndex() {
      return getRandomIndex(playlist, getters.currentIndex)
    }

    // 单曲
    function getLoopNextIndex() {
      return getters.currentIndex
    }

  },


// 上一首歌
  prevSong(state, getters) {
    const { playlist, playMode } = state
    const prevStratMap = {
      [playModeMap.sequence.code]: genSequencePrevIndex,
      [playModeMap.loop.code]: getLoopPrevIndex,
      [playModeMap.random.code]: getRandomPrevIndex
    }
    const getPrevStrat = prevStratMap[playMode]
    const index = getPrevStrat()

    return playlist[index]

    function genSequencePrevIndex() {
      let prevIndex = getters.currentIndex - 1
      if (prevIndex < 0) {
        prevIndex = playlist.length - 1
      }
      return prevIndex
    }

    function getLoopPrevIndex() {
      return getters.currentIndex
    }

    function getRandomPrevIndex() {
      return getRandomIndex(playlist, getters.currentIndex)
    }
  }
}
function getRandomIndex(playlist, currentIndex) {
  // 防止无限循环
  if (playlist.length === 1) {
    return currentIndex
  }
  let index = Math.round(Math.random() * (playlist.length - 1))
  if (index === currentIndex) {       //如果下一首和currentSong相同，则再执行这个函数
    index = getRandomIndex(playlist, currentIndex)
  }
  return index
}