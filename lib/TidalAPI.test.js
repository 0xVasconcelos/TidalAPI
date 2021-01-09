"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const TidalAPI = require("./TidalAPI");
const mocha_1 = require("mocha");
const chai_1 = require("chai");
const username = process.env.TIDALUSERNAME;
const password = process.env.TIDALPASSWORD;
function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
mocha_1.describe('TidalAPI', function () {
    mocha_1.describe('Constructor testing', function () {
        mocha_1.it('should fail', function () {
            chai_1.expect(() => {
                // @ts-ignore
                const x = new TidalAPI.TidalAPI("null");
            }).to.throw;
            chai_1.expect(() => {
                // @ts-ignore
                const x = new TidalAPI.TidalAPI({
                    username: null,
                    quality: "HIGH",
                    password: "password"
                });
            }).to.throw;
            chai_1.expect(() => {
                // @ts-ignore
                const x = new TidalAPI.TidalAPI({
                    username: "username",
                    quality: "HIGH",
                    password: null
                });
            }).to.throw;
        });
    });
    mocha_1.describe("Pre-Test (Login)", function () {
        mocha_1.it('Username should be filled', function () {
            chai_1.expect(username).to.not.eq('');
            chai_1.expect(username).to.not.eq(null);
        });
        mocha_1.it('Password should be filled', function () {
            chai_1.expect(password).to.not.eq('');
            chai_1.expect(password).to.not.eq(null);
        });
    });
    mocha_1.describe("API", function () {
        let api = null;
        mocha_1.before(function () {
            api = new TidalAPI.TidalAPI({
                username: username,
                password: password,
                quality: 'LOW'
            });
        });
        mocha_1.describe('Login', function () {
            this.timeout(5000);
            mocha_1.it('should login and throw no error', function () {
                return __awaiter(this, void 0, void 0, function* () {
                    yield api.login();
                    chai_1.expect(api.getMyId()).to.not.eq(null);
                });
            });
        });
        mocha_1.describe('Search', function () {
            mocha_1.it('should find one or more tracks', function () {
                return __awaiter(this, void 0, void 0, function* () {
                    let result = yield api.search({
                        query: "Linkin Park Numb",
                        limit: 1
                    });
                    chai_1.expect(result.tracks.items.length).to.eq(1);
                    result = yield api.search("Linkin Park Numb");
                    chai_1.expect(result.tracks.items.length).to.gte(1);
                    // console.log(JSON.stringify(result, null, 2));
                });
            });
        });
        const trackId = "162638200";
        mocha_1.describe('getTrackInfo', function () {
            mocha_1.it('should return Track info', function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const info = yield api.getTrackInfo(trackId);
                    console.log(info);
                    chai_1.expect(info.title).to.eq("What I've Done");
                });
            });
        });
        mocha_1.describe("getStreamUrl", function () {
            mocha_1.it('should return a valid url', function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const urlInfo = yield api.getStreamUrl(trackId);
                    // console.log(urlInfo);
                    chai_1.expect(urlInfo.url).to.not.empty;
                });
            });
        });
        mocha_1.describe("getOfflineURL", function () {
            mocha_1.it.skip('should return a valid url', function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const url = yield api.getOfflineURL(trackId);
                    console.log(url);
                    chai_1.expect(url).to.not.empty;
                    chai_1.expect(url).to.not.null;
                });
            });
        });
        mocha_1.describe('Artist', function () {
            mocha_1.it('should get Artist Linkin Park', function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const artist = yield api.getArtist("14123");
                    // console.log(artist);
                    chai_1.expect(artist.name).to.eq("Linkin Park");
                });
            });
            mocha_1.it('should get more than 0 Top Tracks', function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const topTracks = yield api.getTopTracks("14123");
                    chai_1.expect(topTracks.items.length).gt(0);
                });
            });
            mocha_1.it('should getArtistVideos', function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const videos = yield api.getArtistVideos("14123", null);
                    // console.log(JSON.stringify(videos));
                    chai_1.expect(videos.items.length).gt(0);
                });
            });
            mocha_1.it('should getArtistBio', function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const bio = yield api.getArtistBio("14123");
                    chai_1.expect(bio.text).to.not.be.empty;
                });
            });
            mocha_1.it('should getSimilarArtists', function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const similar = yield api.getSimilarArtists("14123");
                    // console.log(JSON.stringify(similar, null, 2));
                    chai_1.expect(similar.items.length).to.be.greaterThan(0);
                });
            });
        });
        mocha_1.describe('Albums', function () {
            mocha_1.it('should getArtistAlbums', function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const albums = yield api.getArtistAlbums("14123");
                    //console.log(JSON.stringify(albums, null, 2));
                    chai_1.expect(albums.items.length).to.be.greaterThan(0);
                });
            });
            mocha_1.it('should getAlbum', function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const album = yield api.getAlbum("82262123");
                    console.log(JSON.stringify(album, null, 2));
                    chai_1.expect(album.title).to.be.equal("One More Light Live");
                });
            });
            mocha_1.it('should getAlbumTracks', function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const tracks = yield api.getAlbumTracks("82262123");
                    // console.log(JSON.stringify(tracks, null, 2));
                    chai_1.expect(tracks.items.length).to.be.greaterThan(0);
                });
            });
        });
        mocha_1.describe("Playlist", function () {
            this.timeout(5000);
            mocha_1.describe('getPlaylist', function () {
                mocha_1.it("Title matches 'Rinsed'", function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        const playlist = yield api.getPlaylist('7ab5d2b6-93fb-4181-a008-a1d18e2cebfa');
                        chai_1.expect(playlist.title).to.eq("Study Station");
                    });
                });
            });
            mocha_1.describe('getPlaylistTracks', function () {
                mocha_1.it("more than one item in playlist", function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        const resp = yield api.getPlaylistTracks('55b2c563-a238-4ebf-9a45-284fd5fbfa53');
                        chai_1.expect(resp.items.length).to.gt(1);
                    });
                });
            });
            mocha_1.describe('getETag', function () {
                mocha_1.it("ETag is not empty", function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        const resp = yield api.getETag('55b2c563-a238-4ebf-9a45-284fd5fbfa53');
                        chai_1.expect(resp).to.not.eq('');
                        chai_1.expect(resp).to.not.eq(null);
                    });
                });
            });
            mocha_1.describe('Create playlist, add tracks and delete playlist', function () {
                const suffix = randomNumber(100000, 999999);
                const playlistTitle = "Testplaylist #" + suffix;
                mocha_1.it(`should not find any playlist with title: "${playlistTitle}"`, function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        const resp = yield api.findPlaylistsByName(playlistTitle);
                        chai_1.expect(resp.length).to.eq(0);
                    });
                });
                let playlistId = "";
                mocha_1.it(`should create a playlist with title: "${playlistTitle}"`, function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        const resp = yield api.createPlaylist(playlistTitle, "This is a Test!");
                        playlistId = resp;
                        chai_1.expect(playlistId).to.not.eq("");
                        chai_1.expect(playlistId).to.not.eq(null);
                    });
                });
                mocha_1.it(`should find a playlist with title: "${playlistTitle}"`, function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        const resp = yield api.findPlaylistsByName(playlistTitle);
                        chai_1.expect(resp.map(x => x.uuid)).to.deep.contain(playlistId);
                    });
                });
                mocha_1.it('should add tracks to playlist', function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        const songs = ["136765624", "123651236"];
                        const resp = yield api.addTracksToPlaylist(songs, playlistId);
                        chai_1.expect(resp.addedItemIds.map(x => x.toString())).to.deep.include(songs[0]);
                        chai_1.expect(resp.addedItemIds.map(x => x.toString())).to.deep.include(songs[1]);
                    });
                });
                mocha_1.it(`should delete playlist with title: "${playlistTitle}"`, function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        const delResp = yield api.deletePlaylist(playlistId);
                        const resp = yield api.findPlaylistsByName(playlistTitle);
                        chai_1.expect(resp.map(x => x.uuid)).to.not.deep.contain(playlistId);
                    });
                });
            });
        });
    });
});
//# sourceMappingURL=TidalAPI.test.js.map