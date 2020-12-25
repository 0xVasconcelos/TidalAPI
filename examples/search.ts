import {TidalAPI} from "../lib/TidalAPI";
// note if your are using it in your project, you probalby want to change it to:
// import {TidalAPI} from "TidalAPI";
const api = new TidalAPI({
    username: '',
    password: '',
    quality: 'LOSSLESS' // also HIGH is possible
});

// async wrapper method
(async () => {
    const artists = await api.search({query: 'Dream Theater', limit: 1, types: "artists"});
    console.log(artists);

    const albums = await api.search({types: 'albums', query: 'Dream Theater', limit: 1});
    console.log(albums);

    const tracks = await api.search({types: 'tracks', query: 'Dream Theater', limit: 1});
    console.log(tracks);


    const search = await api.search({types: 'tracks,albums,artists', query: 'Dream Theater', limit: 1});
    console.log(JSON.stringify(search));


    const info = await api.getTrackInfo("22560696");
    console.log(info);

    const streamUrl = await api.getStreamUrl("22560696");
    console.log(streamUrl);

    const videoStreamUrl = await api.getStreamUrl("25470315");
    console.log(videoStreamUrl);

    console.log(api.getArtUrlSync('24f52ab0-e7d6-414d-a650-20a4c686aa57', 1280));

    const artistVideos = await api.getArtistVideos("14670", {limit: 2});
    console.log(artistVideos);
})();
