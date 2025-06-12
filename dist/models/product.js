"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModel = void 0;
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
    companyId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Company", required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    available: { type: Boolean, required: true, default: false },
    image: { type: String, required: false, default: "" },
    category: { type: String, required: false },
    stock: { type: Number, required: false, default: 0 },
});
exports.ProductModel = (0, mongoose_1.model)("Product", productSchema);
//# sourceMappingURL=product.js.map