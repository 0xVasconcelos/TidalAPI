'use strict';


//Node.js modules
const axios = require('axios').default;
const baseURL = 'https://api.tidalhifi.com/v1';

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
    if(typeof authData.quality !== 'string') {
      throw new Error('Stream quality invalid or missing');
    }
  }

  this.authData = authData;

  /* try log in */
  // tryLogin(authData);
}
const formUrlEncoded = x =>
    Object.keys(x).reduce((p, c) => p + `&${c}=${encodeURIComponent(x[c])}`, '')
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
  axios.request({
    method: 'POST',
    url: baseURL + '/login/username',
    headers: {
     'X-Tidal-Token': "wc8j_yBJd20zOmx0",
     'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: formUrlEncoded({
      username: authInfo.username,
      password: authInfo.password,
    })
  }).then(function(res) {
      const data = res.data;
      _sessionID = data.sessionId;
      _userID = data.userId;
      _countryCode = data.countryCode;
      _streamQuality = authInfo.quality;
      loggingIn = false;
      loggedIn = true;
      if (cb) {
        cb(null, true);
      }
  }).catch(reason => cb(reason, false));
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
      offset: query.offset || 0
  }, 'videos', callback);
}
/**
* Get artist bio.
* @param {{id: Number}}
*/
TidalAPI.prototype.getArtistBio = function (query, callback) {
  var self = this;
  self._baseRequest('/artists/' + (query.id || query) + '/bio', {}, 'bio', callback);
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
      offset: query.offset || 0
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
      offset: query.offset || 0
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
  }, 'albums', callback);
}
/**
* Get track info.
* @param {{id: Number, quality: String}}
*/
TidalAPI.prototype.getTrackInfo = function (track, callback){
  var self = this;
  self._baseRequest('/tracks/' + (track.id || track), {}, 'trackInfo', callback);
}
/**
* Get track stream URL.
* @param {{id: Number, quality: String}}
*/
TidalAPI.prototype.getStreamURL = function (track, callback) {
  var self = this;
  self._baseRequest('/tracks/' + (track.id || track) + '/streamUrl', {
      soundQuality: track.quality || _streamQuality
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
  }, 'streamURL', callback);
}
/**
* Get video stream URL.
* @param {{id: Number}}
*/
TidalAPI.prototype.getVideoStreamURL = function (track, callback) {
  var self = this;
  self._baseRequest('/videos/' + (track.id || track) + '/streamUrl', {
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
 * Get user playlists.
 * @param {{id: Number}}
 */
TidalAPI.prototype.getPlaylists = function (user, callback) {
    var self = this;
    self._baseRequest('/users/' + encodeURIComponent(user.id || user) + "/playlists", {
        limit: user.limit || 999,
        offset: user.offset || 0,
    }, 'userPlaylists', callback);
}

/**
 * Get user playlists asynchronous
 * @param {{id: Number}}
 */
TidalAPI.prototype.getPlaylistsAsync = async function (user) {
   return new Promise((resolve, reject) => (this.getPlaylists(user, (err, data) => {
       if(err)
           return reject(err);
       return resolve(data.items);
   })));
}
/**
 * Gets the ETag Header from a given Playlist, required for editing
 * @param playlistId
 * @returns {Promise<string>}
 */
TidalAPI.prototype.getETagAsync = async function getETagAsync(playlistId) {
    const self = this;
    const url = "/playlists/" + encodeURIComponent(playlistId);

    const result = await new Promise((resolve, reject) => {
        this._baseRequest(url, null, null, (err, data, headers) => {
            if(err)
                return reject(err);
            return resolve(headers);
        });
    });

    return result.etag;
}

TidalAPI.prototype.addTracksToPlaylistAsync = async function addTracksToPlaylistAsync(songIds, playlistId) {
    const self = this;
    const url ="/playlists/" + encodeURIComponent(playlistId) + "/items";
    const etag = await self.getETagAsync(playlistId);
    const params = {
        "trackIds": songIds.join(","),
        "onDupes": "FAIL"
    };
    const headers = {"If-None-Match": etag};
    return new Promise((resolve, reject) =>  this._baseRequest(url, params, null, (error, success) => {
        if(error)
            return reject(error);
        return resolve(success);
    }, "POST", headers, true));
}
/**
 * Checks whether a playlist with a given title is already in the users library
 * @param title {string} Title of the playlist
 * @returns {Promise<null|string>} `null` if no playlist was found, otherwise the UUID of the matching Playlist
 */
TidalAPI.prototype.checkIfPlaylistExists = async function (title) {
    const myPlaylists = await this.getPlaylistsAsync(this.getMyID());
    for (let i = 0; i < myPlaylists.length; i++) {
        if (myPlaylists[i].title === title) {
            return myPlaylists[i].uuid;
        }
    }
    return null;
};
/**
 * Creates a new playlist in the users library
 * @param title {string} Title of the playlist
 * @param description {string} Description of the playlist
 * @returns {Promise<string>} UUID of the created playlist
 */
TidalAPI.prototype.createPlaylistAsync = async function (title, description) {
    const self = this;
    const url = "/users/" + encodeURIComponent(this.getMyID()) + "/playlists" + "?countryCode=" + encodeURIComponent(_countryCode);
    const params = {
        "title": title,
        "description": description
    };
    const result = await new Promise((resolve, reject) => this._baseRequest(url, params, null, (error, success) => {
        if (error)
            return reject(error);
        return resolve(success);
    }, "POST", null, true));
    return result.uuid;
}

/**
 * Creates a new playlist if no other with the given name was found
 * @param title {string} Title of the playlist
 * @param description {string} Description of the playlist
 * @returns {Promise<string>} UUID of the playlist
 */
TidalAPI.prototype.createPlaylistIfNotExistsAsync = async function (title, description) {
    const exists = await this.checkIfPlaylistExists(title);
    if(exists)
        return exists;
    return this.createPlaylist(title, description);
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

TidalAPI.prototype.login = function(cb){
    return tryLogin(this.authData, cb);
}

TidalAPI.prototype.loginAsync = async function () {
    return new Promise((resolve, reject) => tryLogin(this.authData, (reason, success) => {
        if (success) {
            return resolve();
        }
        return reject(reason);
    }));
}
/**
* Base request function.
* @param {{method: String, params: Object, type: String, callback: Function}}
*/
TidalAPI.prototype._baseRequest = function(url, params, type, callback, method, additionalHeaders, setParamsAsFormData) {
  var self = this;


  if (!loggedIn) {
    return tryLogin(this.authData, function() {
      self._baseRequest(url, params, type, callback);
    });
  }
  if(!method)
    method = "GET";

  if(!params)
      params = {};

  if(!additionalHeaders)
      additionalHeaders = {};

    if(setParamsAsFormData){
        params = formUrlEncoded(params);
        additionalHeaders['Content-Type'] = 'application/x-www-form-urlencoded';
    }
    else{
        params.countryCode = params.countryCode ? params.countryCode : _countryCode;
    }


    axios.request({
    method: method,
    url: baseURL + url,
    headers: {
      'Origin': 'http://listen.tidal.com',
      'X-Tidal-SessionId': _sessionID,
      ...additionalHeaders
    },
        params: params,
        data: params,
    }).then(function(res) {
      const body = res.data;
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
        callback(null, res.data, res.headers);
      } else
      callback(null, res.data, res.headers);
  }).catch(err => {
        callback(err.response.data, null, null);
    });
}

module.exports = TidalAPI;
