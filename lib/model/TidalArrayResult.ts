export interface TidalArrayResult<T> {
    limit:number;
    offset:number;
    totalNumberOfItems:number;
    items: T[]
}
