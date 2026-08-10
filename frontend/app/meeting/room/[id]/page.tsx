'use client'
import React, { useContext, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { RoomContext } from '../../../../Context/RoomContext'
import VideoPlayer from '@/Component/VideoPlayer'
import { peerAddAction, removePeerAction } from '@/Context/peerActions'
import type { MediaConnection } from 'peerjs'

const Room = () => {
  const params = useParams()
  const { socket, myPeer, peerId, stream, allPeers, Peerdipatch } = useContext(RoomContext)!

  useEffect(() => {
    const roomId = params.id as string | undefined
    const peer = myPeer.current

    if (!socket || !peer || !peerId || !stream || !roomId) return

    const handleRoomUser = ({ roomId, participants }: { roomId: string; participants: string[] }) => {
      console.log('room Id : ', roomId)
      console.log('room Participants : ', participants)
    }

    const handleDisconnectUser = (leftPeerId: string) => {
      Peerdipatch(removePeerAction(leftPeerId))
    }

    const handleJoinedUser = ({ peerId: remotePeerId }: { peerId: string }) => {
      if (!peer || !stream) return

      console.log('Calling peer:', remotePeerId)
      console.log('My peer:', peer)
      console.log('My peer ID:', peer.id)
      console.log('My stream:', stream)

      const call = peer.call(remotePeerId, stream)

      if (!call) {
        console.log('Call was not created')
        return
      }

      call.on('stream', (peerStream: MediaStream) => {
        Peerdipatch(peerAddAction(remotePeerId, peerStream))
      })

      call.on('error', (error) => {
        console.error('Call error:', error)
      })
    }

    const handleIncomingCall = (call: MediaConnection) => {
      if (!stream) return

      call.answer(stream)
      call.on('stream', (peerStream: MediaStream) => {
        Peerdipatch(peerAddAction(call.peer, peerStream))
      })
    }

    socket.emit('join-room', { roomId, peerId })
    socket.on('room-user', handleRoomUser)
    socket.on('disconnect-user', handleDisconnectUser)
    socket.on('joined-user', handleJoinedUser)
    peer.on('call', handleIncomingCall)

    return () => {
      socket.off('room-user', handleRoomUser)
      socket.off('disconnect-user', handleDisconnectUser)
      socket.off('joined-user', handleJoinedUser)
      peer.off('call', handleIncomingCall)
    }
  }, [params.id, peerId, stream, socket, myPeer, Peerdipatch])

  console.log('other peersID and Streams :', allPeers)

  return (
    <div className='flex gap-4 flex-wrap'>
      <VideoPlayer stream={stream} index={"1"} />

      {Object.values(allPeers)?.map((peer, index) => {
        return <VideoPlayer key={index} index={index.toString()} stream={peer.stream} />
      })}
    </div>
  )
}

export default Room
