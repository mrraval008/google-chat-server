import  mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: [true, 'RoomId is required'],
    },
    users: {
        type: Array<{userName:string,peerId:string} | undefined>,
        required: [true, 'users is required'],
    }
})
const RoomModel = mongoose.model('Room', roomSchema, 'room')

export default RoomModel