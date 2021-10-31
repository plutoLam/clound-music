export default {
  setCurrentSong(state, song) {
    state.currentSong = song
  },
  setCurrentTime(state, time) {
    state.currentTime = time
  },
  setPlayingState(state, playing) {
    state.playing = playing
  },
  setPlayMode(state, mode) {
    state.playMode = mode
  },
  setPlaylistShow(state, show) {
    state.isPlaylistShow = show
  },
  setPlayerShow(state, show) {
    state.isPlayerShow = show
  },
  setPlaylistPromptShow(state, show) {
    state.isPlaylistPromptShow = show
  },
  setPlayHistory(state, history) {
    state.playHistory = history
  },
  setMenuShow(state, show) {
    state.isMenuShow = show
  },
  setPlaylist(state,playlist){
    state.playlist = playlist
  },
  setMiniPlayerRef(state,ref){
    state.miniPlayerRef = ref
  }
}