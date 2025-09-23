"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const underscore_1 = tslib_1.__importDefault(require("underscore"));
const config_1 = tslib_1.__importDefault(require("./config"));
const query_1 = require("./utils/query");
const sanitizeParams_1 = tslib_1.__importDefault(require("./utils/sanitizeParams"));
async function aggregate(collection, params) {
    params = underscore_1.default.defaults(await (0, sanitizeParams_1.default)(collection, params), {
        aggregation: [],
    });
    const $match = (0, query_1.generateCursorQuery)(params);
    const $sort = (0, query_1.generateSort)(params);
    const $limit = (params.limit || 0) + 1;
    let aggregationPipeline;
    if (params.sortCaseInsensitive) {
        aggregationPipeline = params.aggregation.concat([
            { $addFields: { __lc: { $toLower: `$${params.paginatedField}` } } },
            { $match },
            { $sort },
            { $limit },
            { $project: { __lc: 0 } },
        ]);
    }
    else {
        aggregationPipeline = params.aggregation.concat([{ $match }, { $sort }, { $limit }]);
    }
    const options = Object.assign({}, (params.options || {}));
    const isCollationNull = params.collation === null;
    const collation = params.collation || config_1.default.COLLATION;
    if (collation && !isCollationNull) {
        options.collation = collation;
    }
    const aggregateMethod = 'aggregateAsCursor' in collection ? 'aggregateAsCursor' : 'aggregate';
    const cursor = collection[aggregateMethod](aggregationPipeline, options);
    const results = await cursor.toArray();
    return (0, query_1.prepareResponse)(results, params);
}
exports.default = aggregate;
//# sourceMappingURL=aggregate.js.map