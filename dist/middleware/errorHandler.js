"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const apperror_1 = require("../utils/apperror");
const errorHandler = (err, req, res, _next) => {
    const statusCode = err instanceof apperror_1.AppError ? err.statusCode : 500;
    return res.status(statusCode).json({
        message: err.message || "Internal Server Error"
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map