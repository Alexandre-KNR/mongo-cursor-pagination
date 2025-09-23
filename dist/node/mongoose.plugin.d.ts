import { Schema } from 'mongoose';
interface PaginatePluginOptions {
    name?: string;
    searchFnName?: string;
}
export default function paginatePlugin(schema: Schema, options?: PaginatePluginOptions): void;
export {};
