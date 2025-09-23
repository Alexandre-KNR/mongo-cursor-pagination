import { Collection, Document } from 'mongodb';
import { PaginationResponse } from './utils/query';
import { PaginationParams } from './utils/query';
export interface FindParams extends PaginationParams {
    query?: Document;
    limit?: number;
    fields?: Record<string, number>;
    collation?: Record<string, any> | null;
    overrideFields?: Record<string, number>;
}
export default function findWithPagination(collection: Collection<Document>, params: FindParams): Promise<PaginationResponse<Document>>;
