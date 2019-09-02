# TidalPromise

[![Build Status](https://img.shields.io/travis/deters/TidalPromise.svg)](https://travis-ci.org/deters/TidalPromise) [![npm version](http://img.shields.io/npm/v/deters.svg)](https://npmjs.org/package/tidalpromise) [![npm downloads](https://img.shields.io/npm/dm/deters.svg)](https://npmjs.org/package/tidalpromise) [![NPM](https://img.shields.io/npm/l/deters.svg)](https://github.com/deters/TidalPromise/blob/master/LICENSE.md) [![David](https://img.shields.io/david/lucaslg26/TidalAPI.svg)](https://david-dm.org/lucaslg26/TidalAPI)

## About

node.js TIDAL API, with Promises and playlist manipulation support.

Mantainer [Lucas Deters](https://github.com/deters)

This is a fork of node.js Tidal API by [Lucas Vasconcelos](https://github.com/lucaslg26)

**NOTE:** Currently not supporting facebook login.

## How to use
Run the following:

``` javascript
npm install tidalpromise
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
var TidalAPI = require('tidalpromise');

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
api.search({type: 'artists', query: 'Dream Theater', limit: 1}).then( function(data){
  console.log(data.artists);
}).catch(console.log)

api.search({type: 'albums', query: 'Dream Theater', limit: 1}).then( function(data){
  console.log(data.albums);
}).catch(console.log)

api.search({type: 'tracks', query: 'Dream Theater', limit: 1}).then( function(data){
  console.log(data.tracks);
}).catch(console.log)

api.search({type: 'tracks,albums,artists', query: 'Dream Theater', limit: 1}).then( function(data){
  console.log(data.tracks);
  console.log(data.albums);
  console.log(data.artists);
}).catch(console.log)
```

### Track info

```javascript
api.getTrackInfo({id: 22560696 }).then( function(data){
  console.log(data)
}).catch(console.log)
```

### Streams

```javascript
api.getStreamURL({id: 22560696}).then( function(data){
  console.log(data)
}).catch(console.log)

api.getVideoStreamURL({id: 25470315}).then( function(data){
  console.log(data)
}).catch(console.log)
```

### Album Art

```javascript
console.log(api.getArtURL('24f52ab0-e7d6-414d-a650-20a4c686aa57', 1280)) //coverid
```

### Videos

```javascript
api.getArtistVideos({id: 14670, limit: 2}).then( function(data){
  console.log(data)
}).catch(console.log)
```

### FLAC tags

```javascript
api.genMetaflacTags({id: 22560696, coverPath: './albumart.jpg', songPath: './song.flac'}).then( function(data){
  console.log(data)
  /* --remove-all-tags --set-tag="ARTIST=Dream Theater" --set-tag="TITLE=Along For The Ride" --set-tag="ALBUM=Dream Theater" --set-tag="TRACKNUMBER=8" --set-tag="COPYRIGHT=2013 Roadrunner Records, Inc." -set-tag="DATE=2013" --import-picture-from="./albumart.jpg" "./song.flac" --add-replay-gain */
}).catch(console.log)
```

### Playlist manipulation (example using async/await for clarity)

```javascript
// get the id of the current user
let user_id = await api.getMyID();
console.log(user_id);

// query more information about current user
let user = await api.getUser({id: user_id});
console.log(user);

// get all playlists of current user
let result = await api.getPlaylists({id: user_id});
let current_playlists = result.items;
let playlists_resume = current_playlists.map(playlist => playlist.title).filter((value, index) => index < 5);
console.log('listing first 5 playlists of current user: \n',playlists_resume)

// search some musics
let track_results = await api.search({type: 'tracks', query: 'The Beatles', limit: 10});
let beatles_tracks = track_results.tracks.items;
let beatles_tracks_resume = beatles_tracks.map(playlist => playlist.title);
console.log('list of beatles tracks:',beatles_tracks_resume);

// lookup for a specific playlist
let TEST_PLAYLIST = 'Test playlist'
let filtered_playlists = current_playlists.filter( playlist => playlist.title == TEST_PLAYLIST );
let test_playlist = filtered_playlists[0]

// create a new playlist if necessary
if (test_playlist == undefined){
  test_playlist = await api.createPlaylist({title: TEST_PLAYLIST, description: 'Automatically created playlist.'});
  console.log('created a new playlist.')
}
console.log('test playlist uuid is:' + test_playlist.uuid)

// add musics to the beginning of the playlist
result = await api.addPlaylistTracks({playlist: test_playlist, tracks: beatles_tracks, toIndex: 0});
console.log(beatles_tracks.length + ' tracks added to playlist ', result);

// get tracks in the playlist
result = await api.getPlaylistTracks({playlist: test_playlist})
let musics_on_test_playlist = result.items;
let number_of_musics_on_test_playlist = result.totalNumberOfItems;
console.log('Musics on the playlist now : \n',number_of_musics_on_test_playlist);

// we added new music to the beginning. so we can delete old musics from the end.
let number_of_musics_to_keep = beatles_tracks.length;
let number_of_musics_to_delete = number_of_musics_on_test_playlist - number_of_musics_to_keep;
let positions_to_delete = [...Array(number_of_musics_to_delete).keys()].map(v => v+number_of_musics_to_keep);
result = await api.deletePlaylistTracks({playlist: test_playlist, trackPositions: positions_to_delete});
console.log(number_of_musics_to_delete + ' tracks deleted from the playlist');

// get tracks in the playlist again
result = await api.getPlaylistTracks({playlist: test_playlist})
musics_on_test_playlist = result.items;
number_of_musics_on_test_playlist = result.totalNumberOfItems;
console.log('Musics on the playlist now : \n',number_of_musics_on_test_playlist);

result = await api.deletePlaylist(test_playlist);
console.log('Playlist deleted. \n')
```

## Troubleshooting

### 500 error with 'Ooops, an unexpected error occurred'

Your TIDAL token is likely incorrect.
