import { Encodable } from './bsonUrlEncoding';
export interface SanitizeParams {
    previous?: string | [unknown, unknown] | Encodable;
    next?: string | [unknown, unknown] | Encodable;
    after?: string;
    before?: string;
    limit?: number;
    paginatedField?: string;
    sortCaseInsensitive?: boolean;
    fields?: Record<string, number>;
}
export default function sanitizeParams(collection: any, params: SanitizeParams): Promise<SanitizeParams>;
