"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const projection_utils_1 = require("projection-utils");
const underscore_1 = tslib_1.__importDefault(require("underscore"));
function fieldsFromMongo(projection = {}, includeIdDefault = false) {
    const fields = underscore_1.default.reduce(projection, (memo, value, key) => {
        if (key !== '_id' && value !== undefined && !value) {
            throw new TypeError('projection includes exclusion, but we do not support that');
        }
        if (value || (key === '_id' && value === undefined && includeIdDefault)) {
            memo.push(key);
        }
        return memo;
    }, []);
    return projection_utils_1.ProjectionFieldSet.fromDotted(fields);
}
function resolveFields(desiredFields, allowedFields, overrideFields) {
    if (desiredFields != null && !Array.isArray(desiredFields)) {
        throw new TypeError('expected nullable array for desiredFields');
    }
    if (allowedFields != null && !underscore_1.default.isObject(allowedFields)) {
        throw new TypeError('expected nullable plain object for allowedFields');
    }
    if (overrideFields !== undefined && !underscore_1.default.isObject(overrideFields)) {
        throw new TypeError('expected optional plain object for overrideFields');
    }
    const desiredFieldset = underscore_1.default.isEmpty(desiredFields)
        ? new projection_utils_1.ProjectionFieldSet([[]])
        : projection_utils_1.ProjectionFieldSet.fromDotted(desiredFields);
    const allowedFieldset = allowedFields
        ? fieldsFromMongo(allowedFields)
        : new projection_utils_1.ProjectionFieldSet([[]]);
    const fields = desiredFieldset.intersect(allowedFieldset).union(fieldsFromMongo(overrideFields));
    if (fields.isEmpty()) {
        return null;
    }
    const projection = fields.toMongo();
    const disableIdOverride = overrideFields && overrideFields._id !== undefined && !overrideFields._id;
    if (!fields.contains(['_id']) || disableIdOverride) {
        projection._id = 0;
    }
    return projection;
}
exports.default = resolveFields;
//# sourceMappingURL=resolveFields.js.map