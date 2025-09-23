import { FindParams } from '../find';
export interface QueryObject {
    limit?: string;
    next?: string;
    previous?: string;
    fields?: string | string[];
    [key: string]: any;
}
export default function sanitizeQuery(query: QueryObject, params?: FindParams): FindParams;
