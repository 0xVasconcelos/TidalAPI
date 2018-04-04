'use strict';

//Node.js modules

var request = require('request-promise-native').defaults({
  baseUrl: 'https://api.tidalhifi.com/v1'
});

var Semaphore = require('semaphore');

/**
 * Package.json of TidalAPI
 * @type {exports}
 * @private
 */
var TidalAPIInfo = require('../package.json');


/**
 * Authentication information (username and password)
 * @type {Object}
 * @private
 */
var authInfo;

/**
 * TIDAL API Session ID
 * @type {null|String}
 * @private
 */
var _sessionID = null;

/**
 * TIDAL API Country code
 * @type {null|String}
 * @private
 */
var _countryCode = null;

/**
 * TIDAL API User ID
 * @type {null|String}
 * @private
 */
var _userID = null;

/**
 * TIDAL API stream quality
 * @type {null|String}
 * @private
 */
var _streamQuality = null;

/**
 * api logged in
 * @type {null|String}
 */
var loggedIn = false;

/**
 * authData
 * @type {Object}
 */
var authData = {};

/**
 * Create TidalAPI instance
 * @param {{username: String, password: String, token: String, quality: String, requests_per_secound: Number}}
 * @Constructor
 */

function TidalAPI(authData) {
  if (typeof authData !== 'object') {
    throw new Error('You must pass auth data into the TidalAPI object correctly');
  } else {
    if (typeof authData.username !== 'string') {
      throw new Error('Username invalid or missing');
    }
    if (typeof authData.password !== 'string') {
      throw new Error('Password invalid or missing');
    }
    if (typeof authData.token !== 'string') {
      throw new Error('Token invalid or missing');
    }
    if (typeof authData.quality !== 'string') {
      throw new Error('Stream quality invalid or missing');
    }

  }

  this.authData = authData;
  this.sem1 = Semaphore(authData.requests_per_secound || 10);

  /* try log in */
  // tryLogin(authData);
}

/**
 * Try login using credentials.
 * @param {{username: String, password: String}}
 */
function tryLogin(authInfo) {
  /**
   * Logging?
   * @type {boolean}
   */
  var loggingIn = true;
  return request({
    method: 'POST',
    uri: '/login/username',
    headers: {
      'X-Tidal-Token': authInfo.token
    },
    form: {
      username: authInfo.username,
      password: authInfo.password,
      clientUniqueKey: "vjknfvjbnjhbgjhbbg"
    }
  }).then( (data) => {
      data = JSON.parse(data);
      _sessionID = data.sessionId;
      _userID = data.userId;
      _countryCode = data.countryCode;
      _streamQuality = authInfo.quality;
      loggingIn = false;
      loggedIn = true;
      return data;
  });
}
/**
 * Return userID.
 */
TidalAPI.prototype.getMyID = function() {
  var self = this;

  if (!loggedIn) {
    return tryLogin(this.authData).then( () => {

      return self.getMyID();
    });
  }

  return _userID;
}
/**
 * Global search.
 * @param {{query: String, limit: Number, types: String, offset: Number}}
 */
TidalAPI.prototype.search = function(query) {
  var self = this;
  return self._baseRequest('/search', {
    query: query.query || query,
    limit: query.limit || 999,
    types: query.type || 'ARTISTS,ALBUMS,TRACKS,VIDEOS,PLAYLISTS',
    offset: query.offset || 0,
    countryCode: _countryCode
  }, 'search');
}
/**
 * Get artist info.
 * @param {{id: Number, limit: Number, filter: String, offset: Number}}
 */
TidalAPI.prototype.getArtist = function(query) {
  var self = this;
  return self._baseRequest('/artists/' + (query.id || query), {
    limit: query.limit || 999,
    filter: query.filter || 'ALL',
    offset: query.offset || 0,
    countryCode: _countryCode
  }, 'artist');
}
/**
 * Get artist top tracks.
 * @param {{id: Number, limit: Number, filter: String, offset: Number}}
 */
TidalAPI.prototype.getTopTracks = function(query) {
  var self = this;
  return self._baseRequest('/artists/' + (query.id || query) + '/toptracks', {
    limit: query.limit || 999,
    filter: query.filter || 'ALL',
    offset: query.offset || 0,
    countryCode: _countryCode
  }, 'toptracks');
}
/**
 * Get artist videos.
 * @param {{id: Number, limit: Number, filter: String, offset: Number}}
 */
TidalAPI.prototype.getArtistVideos = function(query) {
  var self = this;
  return self._baseRequest('/artists/' + (query.id || query) + '/videos', {
    limit: query.limit || 999,
    filter: query.filter || 'ALL',
    offset: query.offset || 0,
    countryCode: _countryCode
  }, 'videos');
}
/**
 * Get artist bio.
 * @param {{id: Number}}
 */
TidalAPI.prototype.getArtistBio = function(query) {
  var self = this;
  return self._baseRequest('/artists/' + (query.id || query) + '/bio', {
    countryCode: _countryCode
  }, 'bio');
}
/**
 * Get similar artists.
 * @param {{id: Number, limit: Number, filter: String, offset: Number}}
 */
TidalAPI.prototype.getSimilarArtists = function(query) {
  var self = this;
  return self._baseRequest('/artists/' + (query.id || query) + '/similar', {
    limit: query.limit || 999,
    filter: query.filter || 'ALL',
    offset: query.offset || 0,
    countryCode: _countryCode
  }, 'similar');
}
/**
 * Get artist albums.
 * @param {{id: Number, limit: Number, filter: String, offset: Number}}
 */
TidalAPI.prototype.getArtistAlbums = function(query) {
  var self = this;
  return self._baseRequest('/artists/' + (query.id || query) + '/albums', {
    limit: query.limit || 999,
    filter: query.filter || 'ALL',
    offset: query.offset || 0,
    countryCode: _countryCode
  }, 'albums');
}
/**
 * Get album info.
 * @param {{id: Number, limit: Number, filter: String, offset: Number}}
 */
TidalAPI.prototype.getAlbum = function(query) {
  var self = this;
  return self._baseRequest('/albums/' + (query.id || query), {
    limit: query.limit || 999,
    filter: query.filter || 'ALL',
    offset: query.offset || 0,
    countryCode: _countryCode
  }, 'album');
}
/**
 * Get album tracks.
 * @param {{id: Number, limit: Number, filter: String, offset: Number}}
 */
TidalAPI.prototype.getAlbumTracks = function(query) {
  var self = this;
  return self._baseRequest('/albums/' + (query.id || query) + '/tracks', {
    limit: query.limit || 999,
    filter: query.filter || 'ALL',
    offset: query.offset || 0,
    countryCode: _countryCode
  }, 'albums');
}
/**
 * Get playlist info.
 * @param {{uuid: String, limit: Number, filter: String, offset: Number}}
 */
TidalAPI.prototype.getPlaylist = function(query) {
  var self = this;
  return self._baseRequest('/playlists/' + query.uuid, {
    countryCode: _countryCode
  });
}
/**
 * Get tracks from a playlist.
 * @param {{playlist: { uuid : String }, limit: Number, filter: String, offset: Number}}
 */
TidalAPI.prototype.getPlaylistTracks = function(query) {
  var self = this;
  return self._baseRequest('/playlists/' + (query.playlist.uuid || query) + '/tracks', {
    limit: query.limit || 999,
    filter: query.filter || 'ALL',
    offset: query.offset || 0,
    countryCode: _countryCode
  }, 'albums');
}

/**
 * Create playlist.
 * @param {{title: String, description: String}}
 */
TidalAPI.prototype.createPlaylist = function(data) {
  var self = this;
  return self._basePost('/users/'+ this.getMyID() +'/playlists', {
    countryCode: _countryCode
  }, {
    title: data.title,
    description: data.description
  }).then(JSON.parse);
}

/**
 * Delete a playlist
 * @param {{uuid : String}}
 */
TidalAPI.prototype.deletePlaylist = function(data) {
  var self = this;
  return self._baseDelete('/playlists/' + data.uuid, {
    countryCode: _countryCode
  }, {});
}

/**
 * Add tracks to a playlist
 * @param {{playlist: {uuid: String}, tracks: {id : Number}, toIndex: Number}}
 */
TidalAPI.prototype.addPlaylistTracks = function(data) {
  var self = this;

  if (data.tracks.length == 0) {
    return;
  }

  return self._basePost('/playlists/' + data.playlist.uuid + '/items', {
    countryCode: _countryCode
  }, {
    trackIds: data.tracks.map(v => v.id ).join(','),
    toIndex: data.toIndex || 0
  });
}

/**
 * Delete tracks from a playlist, based on their positions
 * @param {{playlist: {uuid : String}, trackPositions: List<Number>, orderDirection: String, order: String}}
 */
TidalAPI.prototype.deletePlaylistTracks = function(data) {
  var self = this;

  if (data.trackPositions == undefined || data.trackPositions.length == 0) {
    return;
  }


  return self._baseDelete('/playlists/' + data.playlist.uuid + '/items/' + (data.trackPositions.join(',')), {
    countryCode: _countryCode,
    orderDirection: data.orderDirection || 'ASC',
    order: data.order || 'INDEX'
  }, {});
}

/**
 * Get track info.
 * @param {{id: Number, quality: String}}
 */
TidalAPI.prototype.getTrackInfo = function(track) {
  var self = this;
  return self._baseRequest('/tracks/' + (track.id || track), {
    countryCode: _countryCode
  }, 'trackInfo');
}
/**
 * Get track stream URL.
 * @param {{id: Number, quality: String}}
 */
TidalAPI.prototype.getStreamURL = function(track) {
  var self = this;
  return self._baseRequest('/tracks/' + (track.id || track) + '/streamUrl', {
    soundQuality: track.quality || _streamQuality,
    countryCode: _countryCode
  }, 'streamURL');
}
/**
 * Get track stream URL.
 * @param {{id: Number, quality: String}}
 */
TidalAPI.prototype.getOfflineURL = function(track) {
  var self = this;
  return self._baseRequest('/tracks/' + (track.id || track) + '/offlineUrl', {
    soundQuality: track.quality || _streamQuality,
    countryCode: _countryCode
  }, 'streamURL');
}
/**
 * Get video stream URL.
 * @param {{id: Number}}
 */
TidalAPI.prototype.getVideoStreamURL = function(track) {
  var self = this;
  return self._baseRequest('/videos/' + (track.id || track) + '/streamUrl', {
    countryCode: _countryCode
  }, 'streamURL');
}
/**
 * Get user info.
 * @param {{id: Number}}
 */
TidalAPI.prototype.getUser = function(user) {
  var self = this;
  return self._baseRequest('/users/' + (user.id || user), {
    limit: user.limit || 999,
    offset: user.offset || 0
  }, 'user');
}
/**
 * Get user playlists.
 * @param {{id: Number}}
 */
TidalAPI.prototype.getPlaylists = function(user) {
  var self = this;
  return self._baseRequest('/users/' + (user.id || user) + "/playlists", {
    limit: user.limit || 999,
    offset: user.offset || 0,
    countryCode: _countryCode
  });
}

/**
 * Get track stream URL.
 * @param {id: String, res: Number}
 */

TidalAPI.prototype.getArtURL = function(id, width, height) {
  width = width || 1280;
  height = height || 1280;
  return 'https://resources.tidal.com/images/' + id.replace(/-/g, '/') + '/' + width + 'x' + height + '.jpg';
}
/**
 * Generate Metaflac tags.
 * @param {{id: Number}}
 */
TidalAPI.prototype.genMetaflacTags = function(track) {
  var self = this;
  return self.getTrackInfo({
    id: track.id || track
  }).then ( (data) => {
    self.getAlbum({
      id: data.album.id
    }).then( (albumData) => {
      var metaflacTag;
      metaflacTag = '--remove-all-tags ';
      metaflacTag += '--set-tag=\"ARTIST=' + data.artist.name + '\" ';
      metaflacTag += '--set-tag=\"TITLE=' + data.title + '\" ';
      metaflacTag += '--set-tag=\"ALBUM=' + data.album.title + '\" ';
      metaflacTag += '--set-tag=\"TRACKNUMBER=' + data.trackNumber + '\" ';
      metaflacTag += '--set-tag=\"COPYRIGHT=' + data.copyright + '\" ';
      metaflacTag += '-set-tag="DATE=' + albumData.releaseDate.split("-")[0] + '" ';
      if (track.coverPath) {
        metaflacTag += '--import-picture-from=' + '\"' + track.coverPath + '\" ';
      }
      if (track.songPath) {
        metaflacTag += '\"' + track.songPath + '\" ';
      }
      metaflacTag += '--add-replay-gain';
      return metaflacTag;
    })
  });
}
/**
 * Base request function.
 * @param {{method: String, params: Object, type: String}}
 */
TidalAPI.prototype._baseRequest = function(method, params, type) {
  var self = this;

  if (!loggedIn) {
    return tryLogin(this.authData).then( () => {

      return self._baseRequest(method, params, type);
    });
  }

  this.sem1.take( () => {
    setTimeout(this.sem1.leave, 1000);
  });

  params.countryCode = params.countryCode ? params.countryCode : _countryCode;

  return request.get({
    uri: method,
    headers: {
      'Origin': 'http://listen.tidal.com',
      'X-Tidal-SessionId': _sessionID,
      'Pragma': 'no-cache'
    },
    qs: params
  }).then( (data) => {
    let body = JSON.parse(data);
    if (params.types) {
      var newBody = {};
      if (params.types.indexOf('tracks') > -1) {
        newBody['tracks'] = body.tracks;
      }
      if (params.types.indexOf('artists') > -1) {
        newBody['artists'] = body.artists;
      }
      if (params.types.indexOf('albums') > -1) {
        newBody['albums'] = body.albums;
      }
      if (params.types.indexOf('videos') > -1) {
        newBody['videos'] = body.videos;
      }
      if (params.types.indexOf('playlists') > -1) {
        newBody['playlists'] = body.playlists;
      }
      return newBody;
    } else {
      return body;
    }
  })

}

/**
 * Base delete function.
 * @param {{method: String, params: Object, type: String}}
 */
TidalAPI.prototype._baseDelete = function(method, params, formdata) {
  var self = this;

  if (!loggedIn) {

    return tryLogin(this.authData)
      .then(() => {
        return self._baseDelete(method, params, formdata, type);
      })

  }

  params.countryCode = params.countryCode ? params.countryCode : _countryCode;

  this.sem1.take( () => {
    setTimeout(this.sem1.leave, 1000);
  });

  return request({
    method: 'DELETE',
    uri: method,
    headers: {
      'Origin': 'https://listen.tidal.com',
      'If-None-Match': '"*"',
      'X-Tidal-SessionId': _sessionID
    },
    form: formdata
  })
}

/**
 * Base post function.
 * @param {{method: String, params: Object}}
 */
TidalAPI.prototype._basePost = function(method, params, formdata) {

  var self = this;

  if (!loggedIn) {

    return tryLogin(this.authData)
      .then(() => {
        return self._basePost(method, params, formdata);
      })

  }

  params.countryCode = params.countryCode ? params.countryCode : _countryCode;

  this.sem1.take( () => {
    setTimeout(this.sem1.leave, 1000);
  });

  return request({
    method: 'POST',
    uri: method,
    headers: {
      'Origin': 'https://listen.tidal.com',
      'If-None-Match': '"*"',
      'X-Tidal-SessionId': _sessionID
    },
    form: formdata
  })

}

module.exports = TidalAPI;
