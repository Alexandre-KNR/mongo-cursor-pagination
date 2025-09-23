export type PaginationToken = {
    _id: string;
    [key: string]: any;
} | string | [any, unknown];
export type PaginationParams = {
    paginatedField?: string;
    sortCaseInsensitive?: boolean;
    sortAscending?: boolean;
    previous?: PaginationToken;
    next?: PaginationToken;
    limit?: number;
    after?: PaginationToken;
    hint?: string;
    before?: string;
};
export type PaginationResponse<T> = {
    results: T[];
    previous: PaginationToken;
    hasPrevious: boolean;
    next: PaginationToken;
    hasNext: boolean;
};
declare function encodePaginationTokens(params: PaginationParams, response: PaginationResponse<any>): void;
declare function prepareResponse(results: any[], params: any): any;
declare function generateSort(params: any): any;
declare function generateCursorQuery(params: any): any;
export { encodePaginationTokens, prepareResponse, generateSort, generateCursorQuery };
