"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TidalError = void 0;
class TidalError extends Error {
    constructor(err) {
        super("TIDAL's API threw an error: " + err.userMessage + " | Details: " + JSON.stringify(err));
        this.userMessage = err.userMessage;
        this.subStatus = err.subStatus;
        this.status = err.status;
    }
}
exports.TidalError = TidalError;
//# sourceMappingURL=TidalError.js.map