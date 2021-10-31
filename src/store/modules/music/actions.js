export default {
  async startSong({commit,state},rawSong,playSource){
    const song = Object.assign({},rawSong)
    // console.log(song,'song');
    commit('setCurrentSong', song)
    commit('setPlayingState', true)
    // const {playHistory} = state

  }
}