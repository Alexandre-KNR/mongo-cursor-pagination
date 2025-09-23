"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCursorQuery = exports.generateSort = exports.prepareResponse = exports.encodePaginationTokens = void 0;
const tslib_1 = require("tslib");
const object_path_1 = tslib_1.__importDefault(require("object-path"));
const bsonUrlEncoding_1 = tslib_1.__importDefault(require("./bsonUrlEncoding"));
function isPlainObject(value) {
    if (value === null || typeof value !== 'object')
        return false;
    const proto = Object.getPrototypeOf(value);
    return proto === Object.prototype || proto === null;
}
function encodePaginationTokens(params, response) {
    var _a, _b, _c, _d;
    const shouldSecondarySortOnId = params.paginatedField !== '_id';
    if (response.previous && isPlainObject(response.previous)) {
        let previousPaginatedField = object_path_1.default.get(response.previous, params.paginatedField);
        if (params.sortCaseInsensitive) {
            previousPaginatedField = (_b = (_a = previousPaginatedField === null || previousPaginatedField === void 0 ? void 0 : previousPaginatedField.toLowerCase) === null || _a === void 0 ? void 0 : _a.call(previousPaginatedField)) !== null && _b !== void 0 ? _b : '';
        }
        response.previous = shouldSecondarySortOnId && '_id' in response.previous
            ? bsonUrlEncoding_1.default.encode([previousPaginatedField, response.previous._id])
            : bsonUrlEncoding_1.default.encode(previousPaginatedField);
    }
    if (response.next && isPlainObject(response.next)) {
        let nextPaginatedField = object_path_1.default.get(response.next, params.paginatedField);
        if (params.sortCaseInsensitive) {
            nextPaginatedField = (_d = (_c = nextPaginatedField === null || nextPaginatedField === void 0 ? void 0 : nextPaginatedField.toLowerCase) === null || _c === void 0 ? void 0 : _c.call(nextPaginatedField)) !== null && _d !== void 0 ? _d : '';
        }
        response.next = shouldSecondarySortOnId && '_id' in response.next
            ? bsonUrlEncoding_1.default.encode([nextPaginatedField, response.next._id])
            : bsonUrlEncoding_1.default.encode(nextPaginatedField);
    }
}
exports.encodePaginationTokens = encodePaginationTokens;
function prepareResponse(results, params) {
    const hasMore = results.length > params.limit;
    if (hasMore)
        results.pop();
    const hasPrevious = !!params.next || !!(params.previous && hasMore);
    const hasNext = !!params.previous || hasMore;
    if (params.previous)
        results = results.reverse();
    const response = {
        results,
        previous: results[0],
        hasPrevious,
        next: results[results.length - 1],
        hasNext,
    };
    encodePaginationTokens(params, response);
    return response;
}
exports.prepareResponse = prepareResponse;
function generateSort(params) {
    const sortAsc = (!params.sortAscending && params.previous) || (params.sortAscending && !params.previous);
    const sortDir = sortAsc ? 1 : -1;
    if (params.paginatedField == '_id') {
        return {
            _id: sortDir,
        };
    }
    else {
        const field = params.sortCaseInsensitive ? '__lc' : params.paginatedField;
        return {
            [field]: sortDir,
            _id: sortDir,
        };
    }
}
exports.generateSort = generateSort;
function generateCursorQuery(params) {
    if (!params.next && !params.previous)
        return {};
    const sortAsc = (!params.sortAscending && params.previous) || (params.sortAscending && !params.previous);
    const op = params.next || params.previous;
    if (params.paginatedField == '_id') {
        if (sortAsc) {
            return { _id: { $gt: op } };
        }
        else {
            return { _id: { $lt: op } };
        }
    }
    else {
        const field = params.sortCaseInsensitive ? '__lc' : params.paginatedField;
        const notUndefined = { [field]: { $exists: true } };
        const onlyUndefs = { [field]: { $exists: false } };
        const notNullNorUndefined = { [field]: { $ne: null } };
        const nullOrUndefined = { [field]: null };
        const onlyNulls = { $and: [{ [field]: { $exists: true } }, { [field]: null }] };
        const [paginatedFieldValue, idValue] = op;
        switch (paginatedFieldValue) {
            case null:
                if (sortAsc) {
                    return {
                        $or: [
                            notNullNorUndefined,
                            Object.assign(Object.assign({}, onlyNulls), { _id: { $gt: idValue } }),
                        ],
                    };
                }
                else {
                    return {
                        $or: [
                            onlyUndefs,
                            Object.assign(Object.assign({}, onlyNulls), { _id: { $lt: idValue } }),
                        ],
                    };
                }
            case undefined:
                if (sortAsc) {
                    return {
                        $or: [
                            notUndefined,
                            Object.assign(Object.assign({}, onlyUndefs), { _id: { $gt: idValue } }),
                        ],
                    };
                }
                else {
                    return Object.assign(Object.assign({}, onlyUndefs), { _id: { $lt: idValue } });
                }
            default:
                if (sortAsc) {
                    return {
                        $or: [
                            { [field]: { $gt: paginatedFieldValue } },
                            {
                                [field]: { $eq: paginatedFieldValue },
                                _id: { $gt: idValue },
                            },
                        ],
                    };
                }
                else {
                    return {
                        $or: [
                            { [field]: { $lt: paginatedFieldValue } },
                            nullOrUndefined,
                            {
                                [field]: { $eq: paginatedFieldValue },
                                _id: { $lt: idValue },
                            },
                        ],
                    };
                }
        }
    }
}
exports.generateCursorQuery = generateCursorQuery;
//# sourceMappingURL=query.js.map