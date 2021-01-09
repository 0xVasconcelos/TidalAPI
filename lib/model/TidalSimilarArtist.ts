import {TidalArtistInfoFull} from "./TidalArtistInfoFull";
import {TidalArtistInfo} from "./TidalArtistInfo";

export interface TidalSimilarArtist extends TidalArtistInfo {
    artistTypes: string[],
    url: string,
    picture: string,
    popularity: number,
    banner: unknown,
    artistRoles: unknown,
    mixes: unknown,
    relationType: string | 'SIMILAR_ARTIST'
}
