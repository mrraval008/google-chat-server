"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomHandler = void 0;
var uuid_1 = require("uuid");
var rooms = {};
function roomHandler(socket) {
    var createRoom = function (userName) {
        var roomId = (0, uuid_1.v4)();
        socket.emit("room-created", { roomId: roomId, userName: userName });
        console.log("room is created", roomId, userName);
    };
    var joinRoom = function (_a) {
        var roomId = _a.roomId, peerId = _a.peerId, myName = _a.myName;
        console.log("user joined the room", roomId, peerId, myName);
        rooms[roomId] = rooms[roomId] ? rooms[roomId] : [];
        rooms[roomId].push({ peerId: peerId, name: myName });
        socket.join(roomId);
        console.log("myname", myName);
        socket.to(roomId).emit("user-joined", { peerId: peerId, name: myName });
        socket.emit("get-users", {
            roomId: roomId,
            participants: rooms[roomId]
        });
        socket.on("disconnect", function () {
            console.log("user left", peerId);
            leaveRoom(peerId, roomId);
        });
    };
    function leaveRoom(peerId, roomId) {
        rooms[roomId] = rooms[roomId].filter(function (elem) { return peerId !== elem.peerId; });
        socket.to(roomId).emit("user-disconnected", peerId);
    }
    var addMessage = function (roomId, message) {
        console.log(message, roomId);
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
