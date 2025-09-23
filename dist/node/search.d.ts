import { Collection, Document } from 'mongodb';
import { Encodable } from './utils/bsonUrlEncoding';
export interface SearchParams {
    query?: Record<string, any>;
    limit?: number;
    fields?: Record<string, number>;
    next?: Encodable;
}
export interface SearchResponse<T = Document> {
    results: T[];
    next?: string;
    previous?: string;
}
export default function search<T extends Document = Document>(collection: Collection<T>, searchString: string, params: SearchParams): Promise<SearchResponse<T>>;
