
import roomModel from '../models/roomModel'


export interface RoomData {
    users:{userName:string,peerId:string}[],
    _id:string,
    roomId:string,
    __v: number
}
export const storeRoom = async (roomData: {roomId:string,users:{userName:string,peerId:string}[]}) => {
    const room = await roomModel.create(roomData);
    if (!room) {
        throw new Error("Issue in creating room")
    }

    return {status:'success',data:room};

}

export const getRoomById:(id:string)=>Promise<{status:string,data:RoomData[]}>  = async (id:string)=>{
    const room:any = await roomModel.find({"roomId": id});

    if (!room) {
        throw new Error("Issue in getting Room by id")
    }
    return {status:'success',data:room};
}

export const updateRoomById = async (id:string,data:{userName:string,peerId:string}[])=>{
    const room = await roomModel.updateOne( { _id:id},{ $set: { "users" : data} })

    if (!room) {
        throw new Error("Issue in update room")
    }
    return {status:'success',data:room};
}

