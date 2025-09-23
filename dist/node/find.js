"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const underscore_1 = tslib_1.__importDefault(require("underscore"));
const aggregate_1 = tslib_1.__importDefault(require("./aggregate"));
const config_1 = tslib_1.__importDefault(require("./config"));
const query_1 = require("./utils/query");
const sanitizeParams_1 = tslib_1.__importDefault(require("./utils/sanitizeParams"));
const COLLECTION_METHODS = {
    FIND: 'find',
    FIND_AS_CURSOR: 'findAsCursor',
};
async function findWithPagination(collection, params) {
    const removePaginatedFieldInResponse = params.fields && !params.fields[params.paginatedField || '_id'];
    let response;
    if (params.sortCaseInsensitive) {
        response = await (0, aggregate_1.default)(collection, Object.assign({}, params, {
            aggregation: params.query ? [{ $match: params.query }] : [],
        }));
    }
    else {
        params = underscore_1.default.defaults(await (0, sanitizeParams_1.default)(collection, params), { query: {} });
        const cursorQuery = (0, query_1.generateCursorQuery)(params);
        const $sort = (0, query_1.generateSort)(params);
        const findMethod = hasFindAsCursor(collection)
            ? COLLECTION_METHODS.FIND_AS_CURSOR
            : COLLECTION_METHODS.FIND;
        let query;
        if (findMethod === COLLECTION_METHODS.FIND_AS_CURSOR) {
            query = collection[findMethod]({ $and: [cursorQuery, params.query] }, params.fields);
        }
        else {
            query = collection[findMethod]({ $and: [cursorQuery, params.query] }).project(params.fields);
        }
        const isCollationNull = params.collation === null;
        const collation = params.collation || config_1.default.COLLATION;
        const collatedQuery = collation && !isCollationNull ? query.collation(collation) : query;
        const cursor = collatedQuery.sort($sort).limit(params.limit + 1);
        if (params.hint)
            cursor.hint(params.hint);
        const results = await cursor.toArray();
        response = (0, query_1.prepareResponse)(results, params);
    }
    if (removePaginatedFieldInResponse && params.paginatedField) {
        response.results = underscore_1.default.map(response.results, (result) => underscore_1.default.omit(result, params.paginatedField));
    }
    return response;
}
exports.default = findWithPagination;
function hasFindAsCursor(collection) {
    return typeof collection.findAsCursor === 'function';
}
//# sourceMappingURL=find.js.map