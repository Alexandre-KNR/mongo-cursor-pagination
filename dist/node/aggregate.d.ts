import { Collection, Document } from 'mongodb';
import { PaginationParams } from './utils/query';
import { PaginationResponse } from './utils/query';
interface AggregateParams extends PaginationParams {
    aggregation?: Document[];
    options?: Record<string, any>;
    before?: string;
    collation?: Record<string, any> | null;
}
export default function aggregate(collection: Collection<Document>, params: AggregateParams): Promise<PaginationResponse<Document>>;
export {};
