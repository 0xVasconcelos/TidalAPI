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
* Create TidalAPI instance
* @param {{username: String, password: String, token: String, quality: String}}
* @Constructor
*/

function TidalAPI(authData){
  if(typeof authData !== 'object'){
    throw new Error('You must pass auth data into the TidalAPI object correctly');
  } else {
    if(typeof authData.username !== 'string'){
      throw new Error('Username invalid or missing');
    }
    if(typeof authData.password !== 'string'){
      throw new Error('Password invalid or missing');
    }
    if(typeof authData.token !== 'string'){
      throw new Error('Token invalid or missing');
    }
    if(typeof authData.quality !== 'string'){
      throw new Error('Stream quality invalid or missing');
    }
  }

  /* try log in */
  tryLogin(authData);

}

/**
* Try login using credentials.
* @param {{username: String, password: String}}
*/

function tryLogin(authInfo){
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
      _userID = data.userid;
      _countryCode = data.countryCode;
      loggingIn = false;
    }
  });
  var deasync = require('deasync');
  // Wait until the session is set
    while (loggingIn) {
        deasync.sleep(100);
    }
}

TidalAPI.prototype.searchTracks = function (query, callback){
  request.get({
    uri: '/search',
    headers:{
      'Origin': 'http://listen.tidal.com',
      'Referer' : 'http://listen.tidal.com/search/' + query,
      'X-Tidal-SessionId': _sessionID
    },
    qs: {
      query: query.query || query,
      limit: query.limit || 10,
      offset: query.offset || 0,
      types: 'TRACKS',
      countryCode: _countryCode
    }
    }, function(err, res, body) {
      body = JSON.parse(body);
      callback(body.tracks);
  });
}

TidalAPI.prototype.searchArtists = function (query, callback){
  request.get({
    uri: '/search',
    headers:{
      'Origin': 'http://listen.tidal.com',
      'Referer' : 'http://listen.tidal.com/search/' + query,
      'X-Tidal-SessionId': _sessionID
    },
    qs: {
      query: query.query || query,
      limit: query.limit || 10,
      offset: query.offset || 0,
      types: 'ARTISTS',
      countryCode: _countryCode
    }
    }, function(err, res, body) {
      body = JSON.parse(body);
      callback(body.artists);
  });
}

TidalAPI.prototype.searchAlbums = function (query, callback){
  request.get({
    uri: '/search',
    headers:{
      'Origin': 'http://listen.tidal.com',
      'Referer' : 'http://listen.tidal.com/search/' + query,
      'X-Tidal-SessionId': _sessionID
    },
    qs: {
      query: query.query || query,
      limit: query.limit || 10,
      offset: query.offset || 0,
      types: 'ALBUMS',
      countryCode: _countryCode
    }
    }, function(err, res, body) {
      body = JSON.parse(body);
      callback(body.albums);
  });
}

TidalAPI.prototype.searchVideos = function (query, callback){
  request.get({
    uri: '/search',
    headers:{
      'Origin': 'http://listen.tidal.com',
      'Referer' : 'http://listen.tidal.com/search/' + query,
      'X-Tidal-SessionId': _sessionID
    },
    qs: {
      query: query.query || query,
      limit: query.limit || 10,
      offset: query.offset || 0,
      types: 'VIDEOS',
      countryCode: _countryCode
    }
    }, function(err, res, body) {
      body = JSON.parse(body);
      callback(body.videos);
  });
}

TidalAPI.prototype.searchPlaylists = function (query, callback){
  request.get({
    uri: '/search',
    headers:{
      'Origin': 'http://listen.tidal.com',
      'Referer' : 'http://listen.tidal.com/search/' + query,
      'X-Tidal-SessionId': _sessionID
    },
    qs: {
      query: query.query || query,
      limit: query.limit || 10,
      offset: query.offset || 0,
      types: 'PLAYLISTS',
      countryCode: _countryCode
    }
    }, function(err, res, body) {
      body = JSON.parse(body);
      callback(body.playlists);
  });
}

module.exports = TidalAPI;
