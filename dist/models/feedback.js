"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackModel = void 0;
const mongoose_1 = require("mongoose");
const feedbackSchema = new mongoose_1.Schema({
    user_id: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
        type: String,
        required: true,
        enum: ["error", "suggestion", "rating"],
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: function () {
            return this.type === "rating";
        },
    },
    created_at: { type: Date, default: Date.now },
    status: {
        type: String,
        default: "pending",
        enum: ["pending", "reviewed", "resolved"],
    },
});
exports.FeedbackModel = (0, mongoose_1.model)("Feedback", feedbackSchema);
//# sourceMappingURL=feedback.js.map