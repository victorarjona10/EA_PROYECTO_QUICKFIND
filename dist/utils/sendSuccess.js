"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSuccess = void 0;
const sendSuccess = (res, data, message = "Operación exitosa", status = 200) => {
    return res.status(status).json({
        success: true,
        message,
        data,
    });
};
exports.sendSuccess = sendSuccess;
//# sourceMappingURL=sendSuccess.js.map