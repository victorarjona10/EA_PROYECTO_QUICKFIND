"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyModel = void 0;
const mongoose_1 = require("mongoose");
const mongoose_2 = __importDefault(require("mongoose"));
const companySchema = new mongoose_1.Schema({
    ownerId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    userRatingsTotal: { type: Number, required: false },
    description: { type: String, required: true },
    location: { type: String, required: true },
    email: { type: String, required: true, unique: true, validate: {
            validator: function (value) {
                return value.includes('@');
            },
            message: 'Email must contain @'
        } },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    wallet: { type: Number, required: false, default: 0 },
    products: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Product", required: false }],
    coordenates_lat: { type: Number, required: true },
    coordenates_lng: { type: Number, required: true },
    icon: { type: String, required: true },
    photos: [{ type: String, required: false }],
    reviews: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Review", required: false }],
    pendingOrders: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Order", required: false }],
    followers: { type: Number, required: false, default: 0 },
    user_Followers: [
        {
            user_id: {
                type: mongoose_2.default.Types.ObjectId,
                ref: 'User',
                required: false
            },
        },
    ],
});
exports.CompanyModel = (0, mongoose_1.model)("Company", companySchema);
//# sourceMappingURL=company.js.map