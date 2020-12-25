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
const TidalAPI_1 = require("../lib/TidalAPI");
// note if your are using it in your project, you probalby want to change it to:
// import {TidalAPI} from "TidalAPI";
const api = new TidalAPI_1.TidalAPI({
    username: '',
    password: '',
    quality: 'LOSSLESS' // also HIGH is possible
});
// async wrapper method
(() => __awaiter(void 0, void 0, void 0, function* () {
    const artists = yield api.search({ query: 'Dream Theater', limit: 1, types: "artists" });
    console.log(artists);
    const albums = yield api.search({ types: 'albums', query: 'Dream Theater', limit: 1 });
    console.log(albums);
    const tracks = yield api.search({ types: 'tracks', query: 'Dream Theater', limit: 1 });
    console.log(tracks);
    const search = yield api.search({ types: 'tracks,albums,artists', query: 'Dream Theater', limit: 1 });
    console.log(JSON.stringify(search));
    const info = yield api.getTrackInfo("22560696");
    console.log(info);
    const streamUrl = yield api.getStreamUrl("22560696");
    console.log(streamUrl);
    const videoStreamUrl = yield api.getStreamUrl("25470315");
    console.log(videoStreamUrl);
    console.log(api.getArtUrlSync('24f52ab0-e7d6-414d-a650-20a4c686aa57', 1280));
    const artistVideos = yield api.getArtistVideos("14670", { limit: 2 });
    console.log(artistVideos);
}))();
//# sourceMappingURL=search.js.map