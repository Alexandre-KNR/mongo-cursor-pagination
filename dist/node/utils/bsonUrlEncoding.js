"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const base64_url_1 = tslib_1.__importDefault(require("base64-url"));
const bson_1 = require("bson");
const BSON_UNDEFINED = '__mixmax__undefined__';
const encoderDecoder = {
    encode(obj) {
        if (Array.isArray(obj) && obj[0] === undefined) {
            obj[0] = BSON_UNDEFINED;
        }
        return base64_url_1.default.encode(bson_1.EJSON.stringify(obj));
    },
    decode(str) {
        const obj = bson_1.EJSON.parse(base64_url_1.default.decode(str));
        if (Array.isArray(obj) && obj[0] === BSON_UNDEFINED) {
            obj[0] = undefined;
        }
        return obj;
    },
};
exports.default = encoderDecoder;
//# sourceMappingURL=bsonUrlEncoding.js.map