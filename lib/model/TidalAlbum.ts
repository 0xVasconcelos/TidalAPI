import {TidalArtistInfo} from "./TidalArtistInfo";

export interface TidalAlbum {
    id: number,
    title: string,
    /**
     * in Seconds
     */
    duration: number,
    streamReady: boolean,
    streamStartDate: string,
    allowStreaming: boolean,
    premiumStreamingOnly: boolean,
    numberOfTracks: number,
    numberOfVideos: number,
    numberOfVolumes: number,
    /**
     * YYYY-MM-DD
     */
    releaseDate: string,
    copyright: string,
    type: string | 'ALBUM',
    version: unknown,
    url: string,
    cover: string,
    videoCover: unknown,
    explicit: boolean,
    upc: string,
    popularity: number,
    audioQuality: string | 'HI_RES',
    audioModes: string | "STEREO",
    artist: TidalArtistInfo,
    artists: TidalArtistInfo[]
}
