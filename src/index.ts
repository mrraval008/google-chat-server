import express from "express";
import http from  "http";
import {Server, Socket} from "socket.io";
import cors from "cors"
import { roomHandler } from "./socket/room";
import  mongoose, { ConnectOptions } from "mongoose";
import dotenv from "dotenv";
dotenv.config({path:'./config.env'})

const port = 8080;
const app  = express();
app.use(cors())
const server  = http.createServer(app);

// WebSocket
const io = new Server(server,{
    cors:{
        origin:"*",
        methods:["GET","POST"]
    }
});
io.on("connection",(socket:Socket)=>{
    console.log("user is connected")
    roomHandler(socket)
    socket.on("disconnect",()=>{
        console.log("user is disconnected")
    })
})


// DB
const DB  = process!.env!.DB!.replace('<PASSWORD>',process.env.DBPASSWORD!)

mongoose.connect(DB,{
    useNewUrlParser:true,
} as ConnectOptions).then(()=>{
    console.log("DB connection succesful...")
})


server.listen(port,()=>{
        console.log("Listening to port",port)
})
