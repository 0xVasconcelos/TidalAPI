#TidalAPI  [![Build Status](https://img.shields.io/travis/lucaslg26/TidalAPI.svg)](https://travis-ci.org/lucaslg26/TidalAPI) [![npm version](http://img.shields.io/npm/v/tidalapi.svg)](https://npmjs.org/package/tidalapi) [![npm downloads](https://img.shields.io/npm/dm/tidalapi.svg)](https://npmjs.org/package/tidalapi) [![NPM](https://img.shields.io/npm/l/tidalapi.svg)](https://github.com/lucaslg26/TidalAPI/blob/master/LICENSE.md) [![David](https://img.shields.io/david/lucaslg26/TidalAPI.svg)](https://david-dm.org/lucaslg26/TidalAPI)

## About

Node.js TIDAL API, use TIDAL Web API simply using this API ;)

Created by [Lucas Vasconcelos](https://github.com/lucaslg26)

**NOTE:** Currently not supporting facebook login.

## How to use
Run the following:

``` javascript
npm install tidalapi
```

Simple usage searching and querying a track list

```javascript
var TidalAPI = require('tidalapi');


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

```
