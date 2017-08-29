'use strict';


//Node.js modules

var request = require('request').defaults({
    baseUrl: 'https://api.tidalhifi.com/v1'
});

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
* @param {{username: String, password: String, token: String, quality: String}}
* @Constructor
*/

function TidalAPI(authData) {
  if(typeof authData !== 'object')
  {
    throw new Error('You must pass auth data into the TidalAPI object correctly');
  } else {
    if(typeof authData.username !== 'string') {
      throw new Error('Username invalid or missing');
    }
    if(typeof authData.password !== 'string') {
      throw new Error('Password invalid or missing');
    }
    if(typeof authData.token !== 'string') {
      throw new Error('Token invalid or missing');
    }
    if(typeof authData.quality !== 'string') {
      throw new Error('Stream quality invalid or missing');
    }
  }

  this.authData = authData;

  /* try log in */
  // tryLogin(authData);
}

/**
* Try login using credentials.
* @param {{username: String, password: String}}
*/
function tryLogin(authInfo, cb) {
  /**
    * Logging?
    * @type {boolean}
    */
  var loggingIn = true;
  request({
    method: 'POST',
    uri: '/login/username',
    headers: {
      'X-Tidal-Token': authInfo.token
    },
    form: {
      username: authInfo.username,
      password: authInfo.password
    }
  }, function(err, res, data) {
    if(!err){
      if (data && res && res.statusCode !== 200 || err) {
        throw new Error(data)
      }
      data = JSON.parse(data);
      _sessionID = data.sessionId;
      _userID = data.userId;
      _countryCode = data.countryCode;
      _streamQuality = authInfo.quality;
      loggingIn = false;
      loggedIn = true;
      if (cb) {
        cb();
      }
    }
  });
}
/**
* Return userID.
*/
TidalAPI.prototype.getMyID = function () {
  return _userID;
}
/**
* Global search.
* @param {{query: String, limit: Number, types: String, offset: Number}}
*/
TidalAPI.prototype.search = function (query, callback) {
  var self = this;
  self._baseRequest('/search', {
      query: query.query || query,
      limit: query.limit || 999,
      types: query.type || 'ARTISTS,ALBUMS,TRACKS,VIDEOS,PLAYLISTS',
      offset: query.offset || 0,
      countryCode: _countryCode
  }, 'search', callback);
}
/**
* Get artist info.
* @param {{id: Number, limit: Number, filter: String, offset: Number}}
*/
TidalAPI.prototype.getArtist = function (query, callback) {
  var self = this;
  self._baseRequest('/artists/' + (query.id || query), {
      limit: query.limit || 999,
      filter: query.filter || 'ALL',
      offset: query.offset || 0,
      countryCode: _countryCode
  }, 'artist', callback);
}
/**
* Get artist top tracks.
* @param {{id: Number, limit: Number, filter: String, offset: Number}}
*/
TidalAPI.prototype.getTopTracks = function (query, callback) {
  var self = this;
  self._baseRequest('/artists/' + (query.id || query) + '/toptracks', {
      limit: query.limit || 999,
      filter: query.filter || 'ALL',
      offset: query.offset || 0,
      countryCode: _countryCode
  }, 'toptracks', callback);
}
/**
* Get artist videos.
* @param {{id: Number, limit: Number, filter: String, offset: Number}}
*/
TidalAPI.prototype.getArtistVideos = function (query, callback) {
  var self = this;
  self._baseRequest('/artists/' + (query.id || query) + '/videos', {
      limit: query.limit || 999,
      filter: query.filter || 'ALL',
      offset: query.offset || 0,
      countryCode: _countryCode
  }, 'videos', callback);
}
/**
* Get artist bio.
* @param {{id: Number}}
*/
TidalAPI.prototype.getArtistBio = function (query, callback) {
  var self = this;
  self._baseRequest('/artists/' + (query.id || query) + '/bio', {
      countryCode: _countryCode
  }, 'bio', callback);
}
/**
* Get similar artists.
* @param {{id: Number, limit: Number, filter: String, offset: Number}}
*/
TidalAPI.prototype.getSimilarArtists = function (query, callback) {
  var self = this;
  self._baseRequest('/artists/' + (query.id || query) + '/similar', {
      limit: query.limit || 999,
      filter: query.filter || 'ALL',
      offset: query.offset || 0,
      countryCode: _countryCode
  }, 'similar', callback);
}
/**
* Get artist albums.
* @param {{id: Number, limit: Number, filter: String, offset: Number}}
*/
TidalAPI.prototype.getArtistAlbums = function (query, callback) {
  var self = this;
  self._baseRequest('/artists/' + (query.id || query) + '/albums', {
      limit: query.limit || 999,
      filter: query.filter || 'ALL',
      offset: query.offset || 0,
      countryCode: _countryCode
  }, 'albums', callback);
}
/**
* Get album info.
* @param {{id: Number, limit: Number, filter: String, offset: Number}}
*/
TidalAPI.prototype.getAlbum = function (query, callback) {
  var self = this;
  self._baseRequest('/albums/' + (query.id || query), {
      limit: query.limit || 999,
      filter: query.filter || 'ALL',
      offset: query.offset || 0,
      countryCode: _countryCode
  }, 'album', callback);
}
/**
* Get album tracks.
* @param {{id: Number, limit: Number, filter: String, offset: Number}}
*/
TidalAPI.prototype.getAlbumTracks = function (query, callback) {
  var self = this;
  self._baseRequest('/albums/' + (query.id || query) + '/tracks', {
      limit: query.limit || 999,
      filter: query.filter || 'ALL',
      offset: query.offset || 0,
      countryCode: _countryCode
  }, 'albums', callback);
}
/**
* Get playlist info.
* @param {{id: String, limit: Number, filter: String, offset: Number}}
*/
TidalAPI.prototype.getPlaylist = function (query, callback){
  var self = this;
  self._baseRequest('/playlists/' + (query.id || query), {
      limit: query.limit || 999,
      filter: query.filter || 'ALL',
      offset: query.offset || 0,
      countryCode: _countryCode
  }, 'album', callback);
}
/**
* Get tracks from a playlist.
* @param {{id: String, limit: Number, filter: String, offset: Number}}
*/
TidalAPI.prototype.getPlaylistTracks = function (query, callback){
  var self = this;
  self._baseRequest('/playlists/' + (query.id || query) + '/tracks', {
      limit: query.limit || 999,
      filter: query.filter || 'ALL',
      offset: query.offset || 0,
      countryCode: _countryCode
  }, 'albums', callback);
}
/**
* Get track info.
* @param {{id: Number, quality: String}}
*/
TidalAPI.prototype.getTrackInfo = function (track, callback){
  var self = this;
  self._baseRequest('/tracks/' + (track.id || track), {
      countryCode: _countryCode
  }, 'trackInfo', callback);
}
/**
* Get track stream URL.
* @param {{id: Number, quality: String}}
*/
TidalAPI.prototype.getStreamURL = function (track, callback) {
  var self = this;
  self._baseRequest('/tracks/' + (track.id || track) + '/streamUrl', {
      soundQuality: track.quality || _streamQuality,
      countryCode: _countryCode
  }, 'streamURL', callback);
}
/**
* Get track stream URL.
* @param {{id: Number, quality: String}}
*/
TidalAPI.prototype.getOfflineURL = function (track, callback) {
  var self = this;
  self._baseRequest('/tracks/' + (track.id || track) + '/offlineUrl', {
      soundQuality: track.quality || _streamQuality,
      countryCode: _countryCode
  }, 'streamURL', callback);
}
/**
* Get video stream URL.
* @param {{id: Number}}
*/
TidalAPI.prototype.getVideoStreamURL = function (track, callback) {
  var self = this;
  self._baseRequest('/videos/' + (track.id || track) + '/streamUrl', {
      countryCode: _countryCode
  }, 'streamURL', callback);
}
/**
* Get user info.
* @param {{id: Number}}
*/
TidalAPI.prototype.getUser = function (user, callback) {
  var self = this;
  self._baseRequest('/users/' + (user.id || user), {
      limit: user.limit || 999,
      offset: user.offset || 0
  }, 'user', callback);
}

/**
* Get track stream URL.
* @param {id: String, res: Number}
*/

TidalAPI.prototype.getArtURL = function(id, res) {
  res = res || 1280;
  return 'https://resources.tidal.com/images/' + id.replace(/-/g, '/') + '/' + res + 'x' + res + '.jpg';
}
/**
* Generate Metaflac tags.
* @param {{id: Number}}
*/
TidalAPI.prototype.genMetaflacTags = function(track, callback) {
  var self = this;
  self.getTrackInfo({id: track.id || track}, function(data) {
    self.getAlbum({id: data.album.id }, function(albumData) {
      var metaflacTag;
      metaflacTag  = '--remove-all-tags ';
      metaflacTag += '--set-tag=\"ARTIST=' + data.artist.name + '\" ';
      metaflacTag += '--set-tag=\"TITLE=' + data.title + '\" ';
      metaflacTag += '--set-tag=\"ALBUM=' + data.album.title + '\" ';
      metaflacTag += '--set-tag=\"TRACKNUMBER=' + data.trackNumber + '\" ';
      metaflacTag += '--set-tag=\"COPYRIGHT=' + data.copyright + '\" ';
      metaflacTag += '-set-tag="DATE=' + albumData.releaseDate.split("-")[0] + '" ';
      if(track.coverPath){
       metaflacTag += '--import-picture-from=' + '\"' + track.coverPath + '\" ';
      }
      if(track.songPath){
        metaflacTag += '\"' + track.songPath + '\" ';
      }
      metaflacTag += '--add-replay-gain';
      callback(metaflacTag);
    })
  });
}
/**
* Base request function.
* @param {{method: String, params: Object, type: String, callback: Function}}
*/
TidalAPI.prototype._baseRequest = function(method, params, type, callback) {
  var self = this;

  if (!loggedIn) {
    return tryLogin(this.authData, function() {
      self._baseRequest(method, params, type, callback);
    });
  }

  params.countryCode = params.countryCode ? params.countryCode : _countryCode;

  request.get({
    uri: method,
    headers: {
      'Origin': 'http://listen.tidal.com',
      'X-Tidal-SessionId': _sessionID
    },
    qs: params
    }, function(err, res, body) {
      body = JSON.parse(body);
      if(params.types) {
        var newBody = {};
        if(params.types.indexOf('tracks') > -1) {
          newBody['tracks'] = body.tracks;
        }
        if(params.types.indexOf('artists') > -1) {
          newBody['artists'] = body.artists;
        }
        if(params.types.indexOf('albums') > -1) {
          newBody['albums'] = body.albums;
        }
        if(params.types.indexOf('videos') > -1) {
          newBody['videos'] = body.videos;
        }
        if(params.types.indexOf('playlists') > -1) {
          newBody['playlists'] = body.playlists;
        }
        callback(newBody);
      } else
      callback(body);
  });
}

module.exports = TidalAPI;
