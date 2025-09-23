"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getPropertyViaDotNotation(propertyName, object) {
    const parts = propertyName.split('.');
    let prop = object;
    for (let i = 0; i < parts.length; i++) {
        prop = prop[parts[i]];
    }
    return prop;
}
exports.default = getPropertyViaDotNotation;
//# sourceMappingURL=getPropertyViaDotNotation.js.map