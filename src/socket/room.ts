import { Socket } from "socket.io";
import { v4 as uuidV4 } from "uuid";
import {
    storeRoom,
    updateRoomById,
    RoomData,
    getRoomById
} from '../controllers/roomController'

export interface IMessage {
    content: string,
    author?: string,
    timestamp: number
}

export function roomHandler(socket: Socket) {
    const createRoom = async (userName: string) => {
        const roomId = uuidV4();
        try{
            await storeRoom({roomId,users:[]})

        }catch(error){
            console.log("error in room",error)
        }
        socket.emit("room-created", { roomId, userName });
        console.log("room is created", roomId, userName);
    }
    const joinRoom = async ({ roomId, peerId, myName }: { roomId: string, peerId: string, myName: string }) => {
        console.log("user joined the room", roomId, peerId, myName)
        try{
            const room = await getRoomById(roomId);
            const roomData:RoomData = room.data[0];
            if(roomData){
                const combineUsers = [... roomData.users,{userName:myName,peerId}]
                await updateRoomById(roomData._id,combineUsers)
            }else{
                console.log("no room found",roomId)
                return;
            }
        }catch(error){
            console.log("error in room",error)
        }
        socket.join(roomId);
        socket.to(roomId).emit("user-joined", { peerId, name: myName })
        socket.on("disconnect", () => {
            console.log("user left", peerId);
            leaveRoom(peerId, roomId)
        })
    }
    function leaveRoom(peerId: string, roomId: string) {
        socket.to(roomId).emit("user-disconnected", peerId);
    }

    const addMessage = (roomId: string, message: IMessage) => {
        socket.to(roomId).emit("add-message", message)
    }
    const onDisconnect = () => {
        socket.disconnect();
    }
    socket.on("create-room", createRoom)
    socket.on("join-room", joinRoom)
    socket.on("send-message", addMessage)
    socket.on('end', onDisconnect)
}