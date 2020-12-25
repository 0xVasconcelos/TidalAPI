import {LoginInfo} from "./model/LoginInfo";
import {SearchParams} from "./model/SearchParams";
import {RawResult} from "./model/RawResult";
import * as _ from "lodash";
import fetch from "node-fetch";
import {Headers} from "node-fetch";

const baseURL = 'https://api.tidalhifi.com/v1';

export class TidalAPI {
    /**
     * TIDAL API Session ID
     * @type {null|String}
     * @private
     */
    private _sessionId: string | null = null;

    /**
     * TIDAL API Country code
     * @type {null|String}
     * @private
     */
    private _countryCode: string | null = null;

    /**
     * TIDAL API User ID
     * @type {null|String}
     * @private
     */
    private _userId: string | null = null;

    /**
     * TIDAL API stream quality
     * @type {null|String}
     * @private
     */
    private _streamQuality: string | null = null;

    /**
     * api logged in
     * @type {null|String}
     */
    private _loggedIn = false;


    get loggedIn(): boolean {
        return this._loggedIn;
    }

    /**
     * authData
     * @type {Object}
     */
    private authData: LoginInfo;

    /**
     * Create TidalAPI instance
     * @Constructor
     * @param login Login information
     */
    constructor(login: LoginInfo) {
        if (typeof login !== 'object') {
            throw new Error('You must pass auth data into the TidalAPI object correctly');
        } else {
            if (typeof login.username !== 'string') {
                throw new Error('Username invalid or missing');
            }
            if (typeof login.password !== 'string') {
                throw new Error('Password invalid or missing');
            }
            if (typeof login.quality !== 'string') {
                throw new Error('Stream quality invalid or missing');
            }
        }

        this.authData = login;
    }

    private async _baseRequestRaw(url: string, params = null, method: string, additionalHeaders: Headers, paramsAsUrlEncoded): Promise<RawResult> {
        if (!this._loggedIn) {
            await this.login();
            return await this._baseRequestRaw(url, params, method, additionalHeaders, paramsAsUrlEncoded);
        }

        if (!params)
            params = {};
        params.countryCode = params.countryCode ? params.countryCode : this._countryCode;

        let headers = additionalHeaders;
        if (!headers) {
            headers = new Headers();


        }
        headers.append('Origin', 'http://listen.tidal.com');
        headers.append('X-Tidal-SessionId', this._sessionId);

        let body: string | URLSearchParams;

        if (paramsAsUrlEncoded) {
            body = new URLSearchParams();
            for (const key in params) {
                body.append(key, params[key]);
            }
        } else {
            if(method?.toUpperCase() === "GET"){
                const urlParams = (Object.keys(params).reduce((p, c) => p + `&${c}=${encodeURIComponent(params[c])}`, '')).replace("&", "?")

                url += urlParams;
            }
            body = null;
        }

        const result = await fetch(baseURL + url, {
            method,
            headers,
            body: body
        });
        // execute http request
        const data = await result.json() as any[] | any;

        return {
            data,
            responseHeaders: result.headers
        } as RawResult;
    }

    /**
     * Base request function.
     */
    private async _baseRequest(url: string, params, method: string = "GET", additionalHeaders: Headers = null, paramsAsUrlEncoded: boolean = false): Promise<any[] | any> {
        return (await this._baseRequestRaw(url, params, method, additionalHeaders, paramsAsUrlEncoded)).data;
    }

    /**
     * Try login using credentials.
     */
    public async login(): Promise<void> {
        const headers = new Headers();
        headers.append('X-Tidal-Token', "wc8j_yBJd20zOmx0");
        headers.append('Content-Type', "application/x-www-form-urlencoded");

        const urlencoded = new URLSearchParams();
        urlencoded.append("username", this.authData.username);
        urlencoded.append("password", this.authData.password);


        const result = await fetch(baseURL + "/login/username", {
            method: 'POST',
            headers: headers,
            body: urlencoded,
            redirect: 'follow'
        });

        const data: { sessionId: string, userId: string, countryCode: string } = await result.json();
        this._sessionId = data.sessionId;
        this._userId = data.userId;
        this._countryCode = data.countryCode;
        this._loggedIn = true;
    }

    public getMyId(): string {
        return this._userId;
    }

    /**
     * Global search.
     * @param
     */
    public async search(query: SearchParams | string) {
        return await this._baseRequest('/search', query);
    }

    /**
     * Get artist info.
     * @param artistId
     * @param query
     */
    public async getArtist(artistId: string, query: SearchParams) {
        return await this._baseRequest('/artists/' + encodeURIComponent(artistId), query, 'artist');
    }

    /**
     * Get artist top tracks.
     * @param artistId id of artist
     * @param query
     */
    public async getTopTracks(artistId: string, query: SearchParams) {
        return await this._baseRequest('/artists/' + encodeURIComponent(artistId) + '/toptracks', query);
    }

    /**
     * Get artist videos.
     * @param artistId
     * @param query
     */
    public async getArtistVideos(artistId: string, query: SearchParams) {
        return await this._baseRequest('/artists/' + encodeURIComponent(artistId) + '/videos', query);
    }

    /**
     * Get artist bio.
     * @param artistId
     */
    public async getArtistBio(artistId: string) {
        return await this._baseRequest('/artists/' + encodeURIComponent(artistId) + '/bio', {});
    }

    /**
     * Get similar artists.
     * @param artistId
     * @param query
     */
    public async getSimilarArtists(artistId: string, query: SearchParams) {
        return await this._baseRequest('/artists/' + encodeURIComponent(artistId) + '/similar', query);
    }

    /**
     * Get artist albums.
     * @param artistId
     * @param query
     */

    public async getArtistAlbums(artistId: string, query: SearchParams) {
        return await this._baseRequest('/artists/' + encodeURIComponent(artistId) + '/albums', query);
    }

    /**
     * Get album info.
     * @param albumId
     * @param query
     */
    public async getAlbum(albumId: string, query: SearchParams) {
        return await this._baseRequest('/albums/' + encodeURIComponent(albumId), query);
    }

    /**
     * Get album tracks.
     * @param albumId
     * @param query
     */

    public async getAlbumTracks(albumId: string, query: SearchParams) {
        return await this._baseRequest('/albums/' + encodeURIComponent(albumId) + '/tracks', query);
    }

    /**
     * Get playlist info.
     * @param playlistId
     * @param query
     */
    public async getPlaylist(playlistId: string, query: SearchParams = null) {
        return await this._baseRequest('/playlists/' + encodeURIComponent(playlistId), query);
    }

    /**
     * Get tracks from a playlist.
     * @param playlistId
     * @param query
     */
    public async getPlaylistTracks(playlistId: string, query: SearchParams = null) {
        return await this._baseRequest('/playlists/' + encodeURIComponent(playlistId) + '/tracks', query);
    }

    /**
     * Get track info.
     * @param trackId
     * @param callback
     */
    public async getTrackInfo(trackId: string) {
        return await this._baseRequest('/tracks/' + encodeURIComponent(trackId), {});
    }

    /**
     * Get track stream URL.
     * @param trackId
     */
    public async getStreamUrl(trackId: string) {
        return await this._baseRequest('/tracks/' + encodeURIComponent(trackId) + '/streamUrl', {
            soundQuality: this._streamQuality
        });
    }

    public async getOfflineURL(trackId: string) {
        return await this._baseRequest('/tracks/' + encodeURIComponent(trackId) + '/offlineUrl', {
            soundQuality: this._streamQuality
        });
    }

    /**
     * Get video stream URL.
     * @param trackId
     */
    public async getVideoStreamUrl(trackId: string) {
        return await this._baseRequest('/videos/' + encodeURIComponent(trackId) + '/streamUrl', {});
    }

    /**
     * Get user info.
     * @param userId
     */

    public async getUser(userId: string = null) {
        return await this._baseRequest('/users/' + encodeURIComponent(userId ?? this._userId), {});
    }

    /**
     * Get user playlists.
     * @param userId
     * @param query
     */
    public async getPlaylists(userId: string = null, query: SearchParams = null) {
        return await this._baseRequest('/users/' + encodeURIComponent(userId ?? this._userId) + "/playlists", query);
    }

    public async getETag(playlistId) {
        const url = "/playlists/" + encodeURIComponent(playlistId);
        const result = await this._baseRequestRaw(url, {}, "GET", null, false);
        return result.responseHeaders.get("etag");
    }


    public async addTracksToPlaylist(songIds: string[], playlistId: string) {
        const self = this;
        const url = "/playlists/" + encodeURIComponent(playlistId) + "/items";
        const etag = await self.getETag(playlistId);
        const params = {
            "trackIds": songIds.join(","),
            "onDupes": "FAIL"
        };
        const headers = new Headers({"If-None-Match": etag});
        return await this._baseRequest(url, params, "POST", headers, true);
    }

    /**
     * Checks whether a playlist with a given title is already in the users library
     * @param title {string} Title of the playlist
     * @returns {Promise<null|string>} `null` if no playlist was found, otherwise the UUID of the matching Playlist
     */
    public async checkIfPlaylistExists(title: string): Promise<boolean> {
        return (await this.findPlaylistsByName(title)).length >= 1;
    };

    public async findPlaylistsByName(title: string): Promise<any[]> {
        const myPlaylists = await this.getPlaylists(null, {
            limit: 999
        });

        return _.filter(myPlaylists, x => x.title === title);
    }

    /**
     * Creates a new playlist in the users library
     * @param title {string} Title of the playlist
     * @param description {string} Description of the playlist
     * @returns {Promise<string>} UUID of the created playlist
     */

    public async createPlaylist(title: string, description: string): Promise<string> {
        const url = "/users/" + encodeURIComponent(this.getMyId()) + "/playlists" + "?countryCode=" + encodeURIComponent(this._countryCode);
        const params = {
            "title": title,
            "description": description
        };
        const result = await this._baseRequest(url, params, "POST", null, true)
        return result.uuid;
    }

    /**
     * Creates a new playlist if no other with the given name was found
     * @param title {string} Title of the playlist
     * @param description {string} Description of the playlist
     * @returns {Promise<string>} UUID of the playlist
     */

    public async createPlaylistIfNotExists(title, description) {
        const exists = await this.checkIfPlaylistExists(title);
        if (exists)
            return exists;
        return (await this.createPlaylist(title, description));
    }


    /**
     * Get track stream URL.
     * @param songId
     * @param width
     * @param height
     *
     */
    public getArtUrlSync(songId: string, width: number = null, height: number = null) {
        width = width ?? 1280;
        height = height ?? 1280;
        return 'https://resources.tidal.com/images/' + songId.replace(/-/g, '/') + '/' + width + 'x' + height + '.jpg';
    }
}
