import {TidalArtist} from "./TidalArtist";

export interface TidalTrack {
    id: number;
    title: string;
    artists: TidalArtist[];
    /**
     * Duration in seconds
     */
    duration: number;
    popularity: number;
    url: string;
    isrc: string;
}
