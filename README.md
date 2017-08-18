# TidalAPI

[![Build Status](https://img.shields.io/travis/lucaslg26/TidalAPI.svg)](https://travis-ci.org/lucaslg26/TidalAPI) [![npm version](http://img.shields.io/npm/v/tidalapi.svg)](https://npmjs.org/package/tidalapi) [![npm downloads](https://img.shields.io/npm/dm/tidalapi.svg)](https://npmjs.org/package/tidalapi) [![NPM](https://img.shields.io/npm/l/tidalapi.svg)](https://github.com/lucaslg26/TidalAPI/blob/master/LICENSE.md) [![David](https://img.shields.io/david/lucaslg26/TidalAPI.svg)](https://david-dm.org/lucaslg26/TidalAPI)

## About

node.js TIDAL API. Use the TIDAL Web API simply using this module ;)

Created by [Lucas Vasconcelos](https://github.com/lucaslg26)

**NOTE:** Currently not supporting facebook login.

## How to use
Run the following:

``` javascript
npm install tidalapi
```

## Obtain the Tidal token needed to use this API

As well as a TIDAL username and password, the Tidal API needs an API `token` which is unique to your apps. You can get this token by network-sniffing some application that uses TIDAL Playback feature, like Tidal for Windows, Tidal for Android, or CapTune from Sennheiser.

### Obtaining a token from TIDAL for Windows

 - Install [Fiddler](https://www.telerik.com/download/fiddler) and start it.
 - In Fiddler, click **Tools** > **Options** > **Decrypt HTTPS Traffic**
 - Install TIDAL for Windows and start it
 - In Fiddler, look for requests to `api.tidal.com`. Click a request, then on the right, click **Inspectors** > **Headers**. Underneath **Miscellaneous** you'll see `X-Tidal-Token`. This is a TIDAL Token you can use.

<img src="https://i.imgur.com/SvBgcIV.png">

## Usage

Simple usage searching and querying a track list

```javascript
var TidalAPI = require('tidalapi');

var api = new TidalAPI({
  username: 'your-username-here',
  password: 'your-password-here',
  token: 'your-token-here',
  // Could also be 'LOSSLESS' but this only supported on premium subscriptions
  quality: 'HIGH'
});
```

### Search

```javascript
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
```

### Track info

```javascript
api.getTrackInfo({id: 22560696 }, function(data){
  console.log(data)
})
```

### Streams

```javascript
api.getStreamURL({id: 22560696}, function(data){
  console.log(data)
})

api.getVideoStreamURL({id: 25470315}, function(data){
  console.log(data)
})
```

### Album Art

```javascript
console.log(api.getArtURL('24f52ab0-e7d6-414d-a650-20a4c686aa57', 1280)) //coverid
```

### Videos

```javascript
api.getArtistVideos({id: 14670, limit: 2}, function(data){
  console.log(data)
})
```

### FLAC tags

```javascript
api.genMetaflacTags({id: 22560696, coverPath: './albumart.jpg', songPath: './song.flac'}, function(data){
  console.log(data)
  /* --remove-all-tags --set-tag="ARTIST=Dream Theater" --set-tag="TITLE=Along For The Ride" --set-tag="ALBUM=Dream Theater" --set-tag="TRACKNUMBER=8" --set-tag="COPYRIGHT=2013 Roadrunner Records, Inc." -set-tag="DATE=2013" --import-picture-from="./albumart.jpg" "./song.flac" --add-replay-gain */
})
```

## Troubleshooting

### 500 error with 'Ooops, an unexpected error occurred'

Your TIDAL token is likely incorrect.
