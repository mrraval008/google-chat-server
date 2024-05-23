import {Socket} from "socket.io";
import {v4 as uuidV4} from "uuid";


const rooms:Record<string,{peerId:string,name:string}[]> = {};
export interface IMessage {
    content:string,
    author?:string,
    timestamp:number
}

export function roomHandler(socket:Socket){
    const createRoom = (userName:string)=>{
        const roomId = uuidV4();
        socket.emit("room-created", {roomId,userName});
        console.log("room is created",roomId,userName);
    }
    const joinRoom  = ({roomId,peerId,myName}:{roomId:string,peerId:string,myName:string})=>{
        console.log("user joined the room",roomId,peerId,myName)
        rooms[roomId] = rooms[roomId] ? rooms[roomId] : [];
        rooms[roomId].push({peerId,name:myName});
        socket.join(roomId);
        console.log("myname",myName)
        socket.to(roomId).emit("user-joined",{peerId,name:myName})
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
        rooms[roomId] =  rooms[roomId].filter(elem=>peerId !== elem.peerId);
        socket.to(roomId).emit("user-disconnected",peerId);
    }

    const addMessage = (roomId:string,message:IMessage)=>{
        console.log(message,roomId)
        socket.to(roomId).emit("add-message",message)
    }
    const onDisconnect = ()=>{
        socket.disconnect();
    }
    socket.on("create-room",createRoom)
    socket.on("join-room",joinRoom)
    socket.on("send-message",addMessage)
    socket.on('end',onDisconnect)


}