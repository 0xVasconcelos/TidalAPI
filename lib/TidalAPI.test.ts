import TidalAPI = require("./TidalAPI")
import * as fs from "fs";
import {describe, it, before} from "mocha";
import {expect} from "chai";

const content = JSON.parse(fs.readFileSync("./lib/creds.json", {encoding: "utf8"}));

const username = content.username;
const password = content.password;


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

            describe('checkIfPlaylistExists', function () {
                it('should not find any playlist with title: `Testplaylist1`', async function () {
                    const resp = await api.checkIfPlaylistExists('Testplaylist1');
                    expect(resp).to.not.eq(null);
                });
            });
            let playlistId = null;
            describe('createPlaylist', function () {
                it('should create a playlist with title: `Testplaylist`', async function () {
                    const resp = await api.createPlaylist('Testplaylist', "this is a test!");
                    playlistId = resp;
                    expect(playlistId).to.not.eq("");
                    expect(playlistId).to.not.eq(null);
                });
            });
            describe('checkIfPlaylistExists', function () {
                it('should not find a playlist with title: `Testplaylist`', async function () {
                    const resp = await api.checkIfPlaylistExists('Testplaylist');
                    expect(resp).to.eq(playlistId);
                });
            });

            describe('addTracksToPlaylistAsync', function () {
                it('should add tracks to playlist', async function () {
                    const songs = ["136765624", "123651236"]
                    const resp = await api.addTracksToPlaylist(songs, playlistId);
                    expect(resp.addedItemIds.map(x => x.toString())).to.include(songs);
                });
            });
        })
    });

});
