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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomHandler = void 0;
var uuid_1 = require("uuid");
var roomController_1 = require("../controllers/roomController");
function roomHandler(socket) {
    var _this = this;
    var createRoom = function (userName) { return __awaiter(_this, void 0, void 0, function () {
        var roomId, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    roomId = (0, uuid_1.v4)();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, roomController_1.storeRoom)({ roomId: roomId, users: [] })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.log("error in room", error_1);
                    return [3 /*break*/, 4];
                case 4:
                    socket.emit("room-created", { roomId: roomId, userName: userName });
                    console.log("room is created", roomId, userName);
                    return [2 /*return*/];
            }
        });
    }); };
    var joinRoom = function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
        var room, roomData, combineUsers, error_2;
        var roomId = _b.roomId, peerId = _b.peerId, myName = _b.myName;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    console.log("user joined the room", roomId, peerId, myName);
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, (0, roomController_1.getRoomById)(roomId)];
                case 2:
                    room = _c.sent();
                    roomData = room.data[0];
                    if (!roomData) return [3 /*break*/, 4];
                    combineUsers = __spreadArray(__spreadArray([], roomData.users, true), [{ userName: myName, peerId: peerId }], false);
                    return [4 /*yield*/, (0, roomController_1.updateRoomById)(roomData._id, combineUsers)];
                case 3:
                    _c.sent();
                    return [3 /*break*/, 5];
                case 4:
                    console.log("no room found", roomId);
                    return [2 /*return*/];
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_2 = _c.sent();
                    console.log("error in room", error_2);
                    return [3 /*break*/, 7];
                case 7:
                    socket.join(roomId);
                    socket.to(roomId).emit("user-joined", { peerId: peerId, name: myName });
                    socket.on("disconnect", function () {
                        console.log("user left", peerId);
                        leaveRoom(peerId, roomId);
                    });
                    return [2 /*return*/];
            }
        });
    }); };
    function leaveRoom(peerId, roomId) {
        socket.to(roomId).emit("user-disconnected", peerId);
    }
    var addMessage = function (roomId, message) {
        socket.to(roomId).emit("add-message", message);
    };
    var onDisconnect = function () {
        socket.disconnect();
    };
    socket.on("create-room", createRoom);
    socket.on("join-room", joinRoom);
    socket.on("send-message", addMessage);
    socket.on('end', onDisconnect);
}
exports.roomHandler = roomHandler;
