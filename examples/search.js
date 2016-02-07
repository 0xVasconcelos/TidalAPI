var TidalAPI = require('../');


var api = new TidalAPI({
    username: '',
    password: '',
    token: '_KM2HixcUBZtmktH',
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

api.getVideoStreamURL({id: 25470315}, function(data){
  console.log(data)
})


