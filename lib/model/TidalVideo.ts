import {TidalArtistInfo} from "./TidalArtistInfo";

export interface TidalVideo {
    id: number,
    title: string,
    volumeNumber: number,
    trackNumber: number,
    releaseDate: string,
    imagePath: unknown,
    imageId: string,
    duration: number,
    quality: string,
    streamReady: boolean,
    streamStartDate: string,
    allowStreaming: boolean,
    explicit: boolean,
    popularity: number,
    type: string | 'Music Video',
    adsUrl: unknown,
    adsPrePaywallOnly: boolean,
    artist: TidalArtistInfo,
    artists: TidalArtistInfo[],
    album: unknown
}
