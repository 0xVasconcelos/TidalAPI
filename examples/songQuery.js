var TidalAPI = require('../');


var api = new TidalAPI({
    username: 'email',
    password: 'pass',
    token: 'wdgaB1CilGA-S_s2'
});

api.searchSong({query: 'Dream Theater', limit: 1}, function(data){
  console.log(data);
})

