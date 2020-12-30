import {TidalArrayResult} from "./TidalArrayResult";
import {TidalTrack} from "./TidalTrack";

export interface TidalSearchResult{
    artists?: TidalArrayResult<any>;
    albums?: TidalArrayResult<any>;
    playlists?: TidalArrayResult<any>;
    tracks?: TidalArrayResult<TidalTrack>;
    videos?: TidalArrayResult<any>;
    topHit: any;
}
