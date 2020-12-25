export interface SearchParams {
    query?: string;
    filter?: string;
    limit?: number;
    /**
     * Allowed Values: ARTISTS,ALBUMS,TRACKS,VIDEOS,PLAYLISTS
     * Join multiple Values like shown above to search in multiple types
     */
    types?: string;
    offset?: number;
}

export const DefaultSearchParam = {
    limit: 100,
    offset: 0,
    filter: "ALL",
    types: `ARTISTS,ALBUMS,TRACKS,VIDEOS,PLAYLISTS`
} as SearchParams;
