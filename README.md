# TidalAPI

[![Build Status](https://img.shields.io/travis/lucaslg26/TidalAPI.svg)](https://travis-ci.org/lucaslg26/TidalAPI) [![npm version](http://img.shields.io/npm/v/tidalapi.svg)](https://npmjs.org/package/tidalapi) [![npm downloads](https://img.shields.io/npm/dm/tidalapi.svg)](https://npmjs.org/package/tidalapi) [![NPM](https://img.shields.io/npm/l/tidalapi.svg)](https://github.com/lucaslg26/TidalAPI/blob/master/LICENSE.md) [![David](https://img.shields.io/david/lucaslg26/TidalAPI.svg)](https://david-dm.org/lucaslg26/TidalAPI)

## About

node.js TIDAL API built with TypeScript. This module is using the TIDAL Web API v1.


Originally created by [Lucas Vasconcelos](https://github.com/lucaslg26)

**NOTE:** Currently not supporting facebook login.

## How to use
Run the following:

```
npm install tidalapi
```
or if you are using yarn instead of npm:
```
yarn add tidalapi
```
## Usage

Simple usage searching and querying a track list

```javascript
import {TidalAPI} from "TidalAPI";

var api = new TidalAPI({
  username: 'your-username-here',
  password: 'your-password-here',
  // Could also be 'LOSSLESS' but this only supported on premium subscriptions
  quality: 'HIGH'
});
```

### Search

```javascript
const artists = await api.search({query: 'Dream Theater', limit: 1, types: "artists"});
console.log(artists);

const albums = await api.search({types: 'albums', query: 'Dream Theater', limit: 1});
console.log(albums);

const tracks = await api.search({types: 'tracks', query: 'Dream Theater', limit: 1});
console.log(tracks);

const search = await api.search({types: 'tracks,albums,artists', query: 'Dream Theater', limit: 1});
console.log(JSON.stringify(search));
```

### Track info

```javascript

const info = await api.getTrackInfo("22560696");
console.log(info);

```

### Streams

```javascript

const streamUrl = await api.getStreamUrl("22560696");
console.log(streamUrl);

const videoStreamUrl = await api.getStreamUrl("25470315");
console.log(videoStreamUrl);
```

### Album Art

```javascript

const url = api.getArtUrlSync('24f52ab0-e7d6-414d-a650-20a4c686aa57', 1280);

```

### Videos

```javascript
const artistVideos = await api.getArtistVideos("14670", {limit: 2});
console.log(artistVideos);
```

### Playlist
```javascript
// get general information about the playlist
const playlistInfo = await getPlaylist("7ab5d2b6-93fb-4181-a008-a1d18e2cebfa");
// get tracks of the playlist
const playlistInfo = await getPlaylistTracks("7ab5d2b6-93fb-4181-a008-a1d18e2cebfa");
```

#### Manipulation
```javascript
const gguid = await createPlaylist("My Playlist", "Description");
const gguid = await createPlaylistIfNotExists("MyPlaylist");
```


## Troubleshooting

### 500 error with 'Ooops, an unexpected error occurred'

Your TIDAL token is likely incorrect.
