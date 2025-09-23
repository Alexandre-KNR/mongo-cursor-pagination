"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const underscore_1 = tslib_1.__importDefault(require("underscore"));
const resolveFields_1 = tslib_1.__importDefault(require("./resolveFields"));
function normalizeQueryArray(query, param) {
    const value = query[param];
    if (Array.isArray(value)) {
        for (let i = 0; i < value.length; ++i) {
            if (!underscore_1.default.isString(value[i])) {
                throw new TypeError('expected string array or comma-separated string for ' + param);
            }
        }
        return value;
    }
    if (underscore_1.default.isEmpty(value)) {
        return [];
    }
    if (underscore_1.default.isString(value)) {
        return value.split(',');
    }
    throw new TypeError('expected string array or comma-separated string for ' + param);
}
function sanitizeQuery(query, params = {}) {
    params = params || {};
    if (!underscore_1.default.isEmpty(query.limit)) {
        const limit = parseInt(query.limit, 10);
        if (!isNaN(limit) && (!params.limit || params.limit > limit)) {
            params.limit = limit;
        }
    }
    if (!underscore_1.default.isEmpty(query.next)) {
        params.next = query.next;
    }
    if (!underscore_1.default.isEmpty(query.previous)) {
        params.previous = query.previous;
    }
    const fields = (0, resolveFields_1.default)(normalizeQueryArray(query, 'fields'), params.fields, params.overrideFields);
    if (fields === null) {
        throw new TypeError('no valid fields provided');
    }
    params.fields = underscore_1.default.isEmpty(fields) ? undefined : fields;
    return params;
}
exports.default = sanitizeQuery;
//# sourceMappingURL=sanitizeQuery.js.map