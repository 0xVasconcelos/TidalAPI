import {Headers} from "node-fetch";

export interface RawResult {
    data: any | any[];
    responseHeaders: Headers;
}
