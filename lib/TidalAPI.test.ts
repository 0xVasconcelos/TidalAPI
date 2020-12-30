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
                quality: 'HIGH'
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
