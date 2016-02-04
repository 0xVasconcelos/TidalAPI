var TidalAPI = require('../');


var api = new TidalAPI({
    username: 'email',
    password: 'pass',
    token: 'wdgaB1CilGA-S_s2',
    quality: 'LOSSLESS'
});

api.searchArtists({query: 'Dream Theater', limit: 1}, function(data){
  console.log(data);
})

api.searchAlbums({query: 'Dream Theater', limit: 1}, function(data){
  console.log(data);
})

api.searchTracks({query: 'Dream Theater', limit: 1}, function(data){
  console.log(data);
})

api.searchVideos({query: 'Dream Theater', limit: 1}, function(data){
  console.log(data);
})

api.getStreamURL({id: 22560696}, function(data){
  console.log(data)
})
