import {Socket} from "socket.io";
import {v4 as uuidV4} from "uuid";


const rooms:Record<string,string[]> = {};

export function roomHandler(socket:Socket){
    const createRoom = ()=>{
        const roomId = uuidV4();
        socket.emit("room-created", roomId);
        console.log("room is created");
    }
    const joinRoom  = ({roomId,peerId}:{roomId:string,peerId:string})=>{
        console.log("user joined the room",roomId,peerId)
        rooms[roomId] = rooms[roomId] ? rooms[roomId] : [];
        rooms[roomId].push(peerId);
        socket.join(roomId);
        socket.to(roomId).emit("user-joined",{peerId})
        socket.emit("get-users",{
            roomId,
            participants:rooms[roomId]
        });
        socket.on("disconnect",()=>{
            console.log("user left",peerId);
           leaveRoom(peerId,roomId)
        })
    }
    function leaveRoom(peerId:string,roomId:string){
        rooms[roomId] =  rooms[roomId].filter(id=>peerId !== id);
        socket.to(roomId).emit("user-disconnected",peerId);
    }
    socket.on("create-room",createRoom)
    socket.on("join-room",joinRoom)
}