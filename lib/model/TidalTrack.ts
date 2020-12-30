export interface TidalTrack {
    id: number;
    title: string;
    /**
     * Duration in seconds
     */
    duration: number;
    popularity: number;
    url: string;
    isrc: string;
}
