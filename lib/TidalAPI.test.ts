import TidalAPI = require("./TidalAPI")
import * as fs from "fs";
import {describe, it, before} from "mocha";
import {expect} from "chai";
import {randomInt} from "crypto";
import exp = require("constants");

const username = process.env.TIDALUSERNAME;
const password = process.env.TIDALPASSWORD;

function randomNumber(min, max) {
    return Math.floor(
        Math.random() * (max - min + 1) + min
    )
}

describe('TidalAPI', function () {
    describe('Constructor testing', function () {
        it('should fail', function () {
            expect(() => {
                // @ts-ignore
                const x = new TidalAPI.TidalAPI("null");
            }).to.throw;
            expect(() => {
                // @ts-ignore
                const x = new TidalAPI.TidalAPI({
                    username: null,
                    quality: "HIGH",
                    password: "password"
                });
            }).to.throw;
            expect(() => {
                // @ts-ignore
                const x = new TidalAPI.TidalAPI({
                    username: "username",
                    quality: "HIGH",
                    password: null
                });
            }).to.throw;
        });
    });
    describe("Pre-Test (Login)", function () {
        it('Username should be filled', function () {
            expect(username).to.not.eq('');
            expect(username).to.not.eq(null);
        });

        it('Password should be filled', function () {
            expect(password).to.not.eq('');
            expect(password).to.not.eq(null);
        });
    });
    describe("API", function () {

        let api: TidalAPI.TidalAPI = null;
        before(function () {
            api = new TidalAPI.TidalAPI({
                username: username,
                password: password,
                quality: 'LOW'
            });
        });
        describe('Login', function () {
            this.timeout(5000);
            it('should login and throw no error', async function () {
                await api.login();
                expect(api.getMyId()).to.not.eq(null);
            });
        });

        describe('Search', function () {
            it('should find one or more tracks', async function () {
                let result = await api.search({
                    query: "Linkin Park Numb",
                    limit: 1
                });
                expect(result.tracks.items.length).to.eq(1);
                result = await api.search("Linkin Park Numb");
                expect(result.tracks.items.length).to.gte(1);
                // console.log(JSON.stringify(result, null, 2));
            });
        });

        const trackId = "162638200";

        describe('getTrackInfo', function () {
            it('should return Track info', async function () {
                const info = await api.getTrackInfo(trackId);
                console.log(info);
                expect(info.title).to.eq("What I've Done");
            });
        });

        describe("getStreamUrl", function () {
            it('should return a valid url', async function () {
                const urlInfo = await api.getStreamUrl(trackId);
                // console.log(urlInfo);
                expect(urlInfo.url).to.not.empty;
            });
        });
        describe("getOfflineURL", function () {
            it.skip('should return a valid url', async function () {
                const url = await api.getOfflineURL(trackId);
                console.log(url);
                expect(url).to.not.empty;
                expect(url).to.not.null;
            });
        });
        describe('Artist', function () {

            it('should get Artist Linkin Park', async function () {
                const artist = await api.getArtist("14123");
                // console.log(artist);
                expect(artist.name).to.eq("Linkin Park");
            });

            it('should get more than 0 Top Tracks', async function () {
                const topTracks = await api.getTopTracks("14123");
                expect(topTracks.items.length).gt(0);
            });

            it('should getArtistVideos', async function () {
                const videos = await api.getArtistVideos("14123", null);
                // console.log(JSON.stringify(videos));
                expect(videos.items.length).gt(0);
            });

            it('should getArtistBio', async function () {
                const bio = await api.getArtistBio("14123");
                expect(bio.text).to.not.be.empty;
            });
            it('should getSimilarArtists', async function () {
                const similar = await api.getSimilarArtists("14123");
                // console.log(JSON.stringify(similar, null, 2));
                expect(similar.items.length).to.be.greaterThan(0);
            });

        });

        describe('Albums', function () {
            it('should getArtistAlbums', async function () {
                const albums = await api.getArtistAlbums("14123")
                //console.log(JSON.stringify(albums, null, 2));
                expect(albums.items.length).to.be.greaterThan(0);
            });
            it('should getAlbum', async function () {
                const album = await api.getAlbum("82262123");
                console.log(JSON.stringify(album, null, 2));
                expect(album.title).to.be.equal("One More Light Live");
            });
            it('should getAlbumTracks', async function () {
                const tracks = await api.getAlbumTracks("82262123");
                // console.log(JSON.stringify(tracks, null, 2));
                expect(tracks.items.length).to.be.greaterThan(0);
            });
        });

        describe("Playlist", function () {
            this.timeout(5000);
            describe('getPlaylist', function () {
                it("Title matches 'Rinsed'", async function () {
                    const playlist = await api.getPlaylist('7ab5d2b6-93fb-4181-a008-a1d18e2cebfa');
                    expect(playlist.title).to.eq("Study Station");
                });
            });
            describe('getPlaylistTracks', function () {
                it("more than one item in playlist", async function () {
                    const resp = await api.getPlaylistTracks('55b2c563-a238-4ebf-9a45-284fd5fbfa53');
                    expect(resp.items.length).to.gt(1);
                });
            });
            describe('getETag', function () {
                it("ETag is not empty", async function () {
                    const resp = await api.getETag('55b2c563-a238-4ebf-9a45-284fd5fbfa53');
                    expect(resp).to.not.eq('');
                    expect(resp).to.not.eq(null);
                });
            });

            describe('Create playlist, add tracks and delete playlist', function () {
                const suffix = randomNumber(100000, 999999);
                const playlistTitle = "Testplaylist #" + suffix;
                it(`should not find any playlist with title: "${playlistTitle}"`, async function () {
                    const resp = await api.findPlaylistsByName(playlistTitle);
                    expect(resp.length).to.eq(0);
                });
                let playlistId: string = "";
                it(`should create a playlist with title: "${playlistTitle}"`, async function () {
                    const resp = await api.createPlaylist(playlistTitle, "This is a Test!");
                    playlistId = resp;
                    expect(playlistId).to.not.eq("");
                    expect(playlistId).to.not.eq(null);
                });
                it(`should find a playlist with title: "${playlistTitle}"`, async function () {
                    const resp = await api.findPlaylistsByName(playlistTitle);
                    expect(resp.map(x => x.uuid)).to.deep.contain(playlistId);
                });
                it('should add tracks to playlist', async function () {
                    const songs = ["136765624", "123651236"]
                    const resp = await api.addTracksToPlaylist(songs, playlistId);
                    expect(resp.addedItemIds.map(x => x.toString())).to.deep.include(songs[0]);
                    expect(resp.addedItemIds.map(x => x.toString())).to.deep.include(songs[1]);
                });
                it(`should delete playlist with title: "${playlistTitle}"`, async function () {
                    const delResp = await api.deletePlaylist(playlistId);
                    const resp = await api.findPlaylistsByName(playlistTitle);
                    expect(resp.map(x => x.uuid)).to.not.deep.contain(playlistId);
                });
            });
        })
    });

});
