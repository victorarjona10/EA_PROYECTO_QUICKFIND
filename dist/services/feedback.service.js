"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackService = void 0;
const feedback_1 = require("../models/feedback");
const mongoose_1 = __importDefault(require("mongoose"));
class FeedbackService {
    createFeedback(feedback) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newFeedback = new feedback_1.FeedbackModel(feedback);
                return yield newFeedback.save();
            }
            catch (error) {
                console.error("Error creating feedback:", error);
                throw error;
            }
        });
    }
    getAllFeedback() {
        return __awaiter(this, arguments, void 0, function* (page = 1, limit = 20) {
            const skip = (page - 1) * limit;
            return yield feedback_1.FeedbackModel.find()
                .sort({ created_at: -1 })
                .skip(skip)
                .limit(limit)
                .populate("user_id", "name email")
                .exec();
        });
    }
    getFeedbackById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield feedback_1.FeedbackModel.findById(id)
                .populate("user_id", "name email")
                .exec();
        });
    }
    getFeedbackByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield feedback_1.FeedbackModel.find({
                user_id: new mongoose_1.default.Types.ObjectId(userId),
            })
                .sort({ created_at: -1 })
                .exec();
        });
    }
    updateFeedbackStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield feedback_1.FeedbackModel.findByIdAndUpdate(id, { status }, { new: true }).exec();
        });
    }
    deleteFeedback(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield feedback_1.FeedbackModel.findByIdAndDelete(id).exec();
        });
    }
}
exports.FeedbackService = FeedbackService;
//# sourceMappingURL=feedback.service.js.map