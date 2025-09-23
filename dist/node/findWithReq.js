"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const find_1 = tslib_1.__importDefault(require("./find"));
const sanitizeQuery_1 = tslib_1.__importDefault(require("./utils/sanitizeQuery"));
async function findWithReq(req, collection, params) {
    const sanitizedParams = (0, sanitizeQuery_1.default)(req.query, params);
    return (0, find_1.default)(collection, sanitizedParams);
}
exports.default = findWithReq;
//# sourceMappingURL=findWithReq.js.map