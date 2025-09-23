"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const underscore_1 = tslib_1.__importDefault(require("underscore"));
const bsonUrlEncoding_1 = tslib_1.__importDefault(require("./bsonUrlEncoding"));
const getPropertyViaDotNotation_1 = tslib_1.__importDefault(require("./getPropertyViaDotNotation"));
const config_1 = tslib_1.__importDefault(require("../config"));
async function sanitizeParams(collection, params) {
    if (params.previous)
        params.previous = bsonUrlEncoding_1.default.decode(params.previous);
    if (params.next)
        params.next = bsonUrlEncoding_1.default.decode(params.next);
    params = underscore_1.default.defaults(params, {
        limit: config_1.default.DEFAULT_LIMIT,
        paginatedField: '_id',
    });
    if (params.limit < 1)
        params.limit = 1;
    if (params.limit > config_1.default.MAX_LIMIT)
        params.limit = config_1.default.MAX_LIMIT;
    const shouldSecondarySortOnId = params.paginatedField !== '_id';
    if (params.after) {
        if (shouldSecondarySortOnId) {
            const doc = await collection.findOne({ _id: params.after }, { [params.paginatedField]: true, _id: false });
            if (doc) {
                let prop = (0, getPropertyViaDotNotation_1.default)(params.paginatedField, doc);
                if (params.sortCaseInsensitive && typeof prop === 'string') {
                    prop = prop.toLowerCase();
                }
                params.next = [prop, params.after];
            }
        }
        else {
            params.next = params.after;
        }
    }
    if (params.before) {
        if (shouldSecondarySortOnId) {
            const doc = await collection.findOne({ _id: params.before }, { [params.paginatedField]: true, _id: false });
            if (doc) {
                let prop = (0, getPropertyViaDotNotation_1.default)(params.paginatedField, doc);
                if (params.sortCaseInsensitive && typeof prop === 'string') {
                    prop = prop.toLowerCase();
                }
                params.previous = [prop, params.before];
            }
        }
        else {
            params.previous = params.before;
        }
    }
    if (params.fields) {
        params.fields = underscore_1.default.extend({
            _id: 0,
        }, params.fields);
        if (!params.fields[params.paginatedField]) {
            params.fields[params.paginatedField] = 1;
        }
    }
    return params;
}
exports.default = sanitizeParams;
//# sourceMappingURL=sanitizeParams.js.map