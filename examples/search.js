let credentials = require('./.config.json');
let TidalClient = require('./client.js');

let api = new TidalClient(credentials.tidal);

async function test_search(playlist_name, query_musics) {


  api.search({type: 'artists', query: 'Dream Theater', limit: 1}).then( data => {
    console.log(data.artists);
  })

  api.search({type: 'albums', query: 'Dream Theater', limit: 1}).then( data => {
    console.log(data.albums);
  })

  api.search({type: 'tracks', query: 'Dream Theater', limit: 1}).then( data => {
    console.log(data.tracks);
  })

  api.search({type: 'tracks,albums,artists', query: 'Dream Theater', limit: 1}).then( data => {
    console.log(data.tracks);
    console.log(data.albums);
    console.log(data.artists);
  })

  api.getTrackInfo({id: 22560696 }).then( data => {
    console.log(data)
  })

  api.getStreamURL({id: 22560696}).then( data => {
    console.log(data)
  })

  api.getVideoStreamURL({id: 25470315}).then( data => {
    console.log(data)
  })

  console.log(api.getArtURL('24f52ab0-e7d6-414d-a650-20a4c686aa57', 1280)) //coverid

  api.getArtistVideos({id: 14670, limit: 2}).then( data => {
    console.log(data)
  })

  api.genMetaflacTags({id: 22560696, coverPath: './albumart.jpg', songPath: './song.flac'}).then( data => {
    console.log(data)
  })



}

test_search();
