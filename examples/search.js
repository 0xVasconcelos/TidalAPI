var TidalAPI = require('../');


var api = new TidalAPI({
    username: '',
    password: '',
    token: 'wdgaB1CilGA-S_s2',
    quality: 'LOSSLESS'
});

api.search({type: 'artists', query: 'Dream Theater', limit: 1}, function(data){
  console.log(data.artists);
})

api.search({type: 'albums', query: 'Dream Theater', limit: 1}, function(data){
  console.log(data.albums);
})

api.search({type: 'tracks', query: 'Dream Theater', limit: 1}, function(data){
  console.log(data.tracks);
})

api.search({type: 'tracks,albums,artists', query: 'Dream Theater', limit: 1}, function(data){
  console.log(data.tracks);
  console.log(data.albums);
  console.log(data.artists);
})

api.getStreamURL({id: 22560696}, function(data){
  console.log(data)
})


