"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const underscore_1 = tslib_1.__importDefault(require("underscore"));
const find_1 = tslib_1.__importDefault(require("./find"));
const search_1 = tslib_1.__importDefault(require("./search"));
function paginatePlugin(schema, options) {
    const findFn = function (params) {
        if (!this.collection) {
            throw new Error('collection property not found');
        }
        params = underscore_1.default.extend({}, params);
        return (0, find_1.default)(this.collection, params);
    };
    const searchFn = function (searchString, params) {
        if (!this.collection) {
            throw new Error('collection property not found');
        }
        params = underscore_1.default.extend({}, params);
        return (0, search_1.default)(this.collection, searchString, params);
    };
    if (options === null || options === void 0 ? void 0 : options.name) {
        schema.statics[options.name] = findFn;
    }
    else {
        schema.statics.paginate = findFn;
    }
    if (options === null || options === void 0 ? void 0 : options.searchFnName) {
        schema.statics[options.searchFnName] = searchFn;
    }
    else {
        schema.statics.search = searchFn;
    }
}
exports.default = paginatePlugin;
//# sourceMappingURL=mongoose.plugin.js.map