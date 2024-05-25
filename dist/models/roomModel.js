"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var roomSchema = new mongoose_1.default.Schema({
    roomId: {
        type: String,
        required: [true, 'RoomId is required'],
    },
    users: {
        type: (Array),
        required: [true, 'users is required'],
    }
});
var RoomModel = mongoose_1.default.model('Room', roomSchema, 'room');
exports.default = RoomModel;
