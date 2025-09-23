"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const underscore_1 = tslib_1.__importDefault(require("underscore"));
const config_1 = tslib_1.__importDefault(require("./config"));
const bsonUrlEncoding_1 = tslib_1.__importDefault(require("./utils/bsonUrlEncoding"));
async function search(collection, searchString, params) {
    if (underscore_1.default.isString(params.limit))
        params.limit = parseInt(params.limit, 10);
    if (params.next) {
        params.next = bsonUrlEncoding_1.default.decode(params.next);
    }
    params = underscore_1.default.defaults(params, {
        query: {},
        limit: config_1.default.MAX_LIMIT,
    });
    if (params.limit < 1)
        params.limit = 1;
    if (params.limit > config_1.default.MAX_LIMIT)
        params.limit = config_1.default.MAX_LIMIT;
    const aggregatePipeline = [
        {
            $match: Object.assign(Object.assign({}, params.query), { $text: { $search: searchString } }),
        },
        {
            $project: Object.assign(Object.assign({}, params.fields), { _id: 1, score: { $meta: 'textScore' } }),
        },
        {
            $sort: {
                score: { $meta: 'textScore' },
                _id: -1,
            },
        },
    ];
    if (params.next) {
        aggregatePipeline.push({
            $match: {
                $or: [
                    { score: { $lt: params.next[0] } },
                    { score: { $eq: params.next[0] }, _id: { $lt: params.next[1] } },
                ],
            },
        });
    }
    aggregatePipeline.push({
        $limit: params.limit,
    });
    const aggregateMethod = 'aggregateAsCursor' in collection ? 'aggregateAsCursor' : 'aggregate';
    const results = await collection[aggregateMethod](aggregatePipeline).toArray();
    const fullPageOfResults = results.length === params.limit;
    const response = {
        results,
    };
    if (fullPageOfResults) {
        const lastResult = underscore_1.default.last(results);
        if (lastResult) {
            response.next = bsonUrlEncoding_1.default.encode([lastResult.score, lastResult._id]);
        }
    }
    return response;
}
exports.default = search;
//# sourceMappingURL=search.js.map