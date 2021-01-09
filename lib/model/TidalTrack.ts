import {TidalArtistInfo} from "./TidalArtistInfo";


export interface TidalTrack {
    id: number;
    title: string;
    artists: TidalArtistInfo[];
    /**
     * Duration in seconds
     */
    duration: number;
    popularity: number;
    url: string;
    isrc: string;
}
