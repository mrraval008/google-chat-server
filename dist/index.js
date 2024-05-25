"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var http_1 = __importDefault(require("http"));
var socket_io_1 = require("socket.io");
var cors_1 = __importDefault(require("cors"));
var room_1 = require("./socket/room");
var mongoose_1 = __importDefault(require("mongoose"));
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: './config.env' });
var port = 8080;
var app = (0, express_1.default)();
app.use((0, cors_1.default)());
var server = http_1.default.createServer(app);
// WebSocket
var io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
io.on("connection", function (socket) {
    console.log("user is connected");
    (0, room_1.roomHandler)(socket);
    socket.on("disconnect", function () {
        console.log("user is disconnected");
    });
});
// DB
var DB = process.env.DB.replace('<PASSWORD>', process.env.DBPASSWORD);
mongoose_1.default.connect(DB, {
    useNewUrlParser: true,
}).then(function () {
    console.log("DB connection succesful...");
});
server.listen(port, function () {
    console.log("Listening to port", port);
});
