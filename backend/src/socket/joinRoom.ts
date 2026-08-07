import { Server, Socket } from 'socket.io'
import { v4 as uuidv4 } from 'uuid'

const rooms: Record<string, string[]> = {}

type RoomParams = {
  roomId: string
  peerId: string
}

export const roomHandler = (socket: Socket, io: Server) => {


  const createRoom = () => {
    const newRoomId = uuidv4()
    rooms[newRoomId] = []
    socket.emit('room-created', newRoomId)
  }

  const joinRoom = ({ roomId, peerId }: RoomParams): void => {
    console.log('user joined room with roomID : ', roomId)
    console.log('userS PEER id', peerId)

    if (peerId && !rooms[roomId]?.includes(peerId)) rooms[roomId]?.push(peerId)

    socket.join(roomId)
    console.log('joined Confirm')
    io.to(roomId).emit('room-user', { roomId, participants: rooms[roomId] })

    socket.on('disconnect', () => {
      leaveRoom({ roomId, peerId })
    })
  }

  const leaveRoom = ({ roomId, peerId }: RoomParams) => {
    console.log('user has left the room PEER id', peerId, ' -- userId :  ', socket.id)

      rooms[roomId] = rooms[roomId]?.filter((e) => e !== peerId) || [] 
      
      socket.to(roomId).emit("disconnect-user" , peerId)
      io.to(roomId).emit('room-user', { roomId, participants: rooms[roomId] })
  }


  // Main Two events ----here 
  socket.on('create-room', createRoom)
  socket.on('join-room', joinRoom)
}
