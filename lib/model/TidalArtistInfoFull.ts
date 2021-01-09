import {TidalArtistRole} from "./TidalArtistRole";

export interface TidalArtistInfoFull {
    id: number,
    name: string,
    artistTypes: string[];
    url: string;
    picture: string;
    popularity: number;
    artistRoles: TidalArtistRole[];
    mixes: {
        [mixType: string]: string;
    }
}
