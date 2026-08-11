'use client'
import React, { useEffect, useReducer, useRef, useState } from 'react'
import { socket } from '../Context/RoomContext'
import { RoomContext } from '../Context/RoomContext'
import { useRouter } from 'next/navigation'
import Peer from 'peerjs';
import { v4 as uuid4 } from "uuid"
import { peerReducer } from '@/Context/Reducers/peerReducer'

const RoomContextProvider = ({ children }: { children: React.ReactNode }) => {

  const myPeer = useRef<Peer | null>(null);
  const [peerId, setPeerId] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [allPeers, Peerdipatch] = useReducer(peerReducer, {});
  const [screenSharingId, setScreenSharingId] = useState<string>("")
  const screenStream    =  useRef<MediaStream | null>(null)

  const router = useRouter()





  const OnScreenShare = async () => {


    try {
      if (!screenSharingId) {

        screenStream.current = await navigator.mediaDevices.getDisplayMedia({});

        setStream(screenStream.current);
     setScreenSharingId(myPeer.current?.id || "")
        // Video track nikalo
        const videoTrack = screenStream.current.getVideoTracks()[0];

        videoTrack.onended = () => {
          navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((stream: MediaStream) => {
              setStream(stream)
              setScreenSharingId("")
            })
            .catch((e) => {
              console.error(e)
            })
        }
      }
      else { 
        
            screenStream.current?.getTracks().forEach(track => {
                 track.stop();
            });
        screenStream.current = null;
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
          .then((stream: MediaStream) => {
            setStream(stream)
            setScreenSharingId("")
          })
          .catch((e) => {
            console.error(e)
          })

      }


    } catch (error) {

      console.log("screen Sharing faild : ", error)
    }
  }


  useEffect(() => {

    const peer = new Peer(uuid4());
    const handleOpen = (id: string) => {
      setPeerId(id)
    }
    const roomCreatedHandler = (newRoomId: string) => {
      console.log('new room created with ID : ', newRoomId)
      if (newRoomId) {
        router.push(`/meeting/room/${newRoomId}`)
      }
    }

    console.log("this is my Peer and this is created ", peer)

    peer.on('open', handleOpen)

    socket.on('room-created', roomCreatedHandler)


    myPeer.current = peer

    try {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((stream) => {
          setStream(stream)

        })
        .catch((e) => {
          console.error(e)
        })

    } catch (error) {

      console.error(error)

    }

    return () => {
      socket.off('room-created', roomCreatedHandler);
      peer.off('open', handleOpen)
      peer.destroy();
    }
  }, [router])

  return <RoomContext.Provider value={{ socket, myPeer, peerId, stream, allPeers, Peerdipatch, OnScreenShare }}>
    {children}
  </RoomContext.Provider>
}

export default RoomContextProvider
