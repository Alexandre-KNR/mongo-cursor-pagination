import { Request } from 'express';
import { Collection, Document } from 'mongodb';
import { FindParams } from './find';
import { PaginationResponse } from './utils/query';
export default function findWithReq(req: Request, collection: Collection<Document>, params: FindParams): Promise<PaginationResponse<Document>>;
