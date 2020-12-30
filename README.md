# TidalAPI

[![Build Status](https://www.travis-ci.com/max-huster/TidalAPI.svg?branch=master)](https://www.travis-ci.com/github/max-huster/TidalAPI)
[![npm version](https://img.shields.io/npm/v/tidalapi-ts.svg)](https://npmjs.org/package/tidalapi-ts)
[![npm downloads](https://img.shields.io/npm/dm/tidalapi-ts.svg)](https://npmjs.org/package/tidalapi-ts)
[![NPM](https://img.shields.io/npm/l/tidalapi-ts.svg)](https://github.com/max-huster/TidalAPI/blob/master/LICENSE)
[![David](https://img.shields.io/david/max-huster/TidalAPI.svg)](https://david-dm.org/max-huster/TidalAPI)
[![devDependencies Status](https://status.david-dm.org/gh/max-huster/TidalAPI.svg?type=dev)](https://david-dm.org/max-huster/TidalAPI?type=dev)

## About

node.js TIDAL API built with TypeScript. This module is using the TIDAL Web API v1.


Originally created by [Lucas Vasconcelos](https://github.com/lucaslg26)

**NOTE:** Currently not supporting facebook login.

## How to use
Run the following:

```
npm install tidalapi-ts
```
or if you are using yarn instead of npm:
```
yarn add tidalapi-ts
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

## Testing

If you want to run the Unit-Tests you need to specify your Tidal Login Credentials in the ENV parameters like so:
```
TIDALUSERNAME=your-username
TIDALPASSWORD=your-password
```
