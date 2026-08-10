'use client'
import React, { useEffect, useReducer, useRef, useState } from 'react'
import { socket } from '../Context/RoomContext'
import { RoomContext } from '../Context/RoomContext'
import { useRouter } from 'next/navigation'
import Peer from 'peerjs' ; 
import {v4 as uuid4 } from "uuid"
import { peerReducer } from '@/Context/Reducers/peerReducer'

const RoomContextProvider = ({ children }: { children: React.ReactNode }) => { 
   
      const myPeer  = useRef<Peer | null>(null) ;
      const [peerId , setPeerId] = useState<string | null>(null) ;
      const [stream , setStream]  = useState<MediaStream | null>(null) ;
      const [allPeers , Peerdipatch] =  useReducer(peerReducer , {})
  const router = useRouter()


  useEffect(() => {  

      const peer = new Peer(uuid4())  ;
      const handleOpen = (id: string) => {
        setPeerId(id)
      }
      const roomCreatedHandler = (newRoomId: string) => {
        console.log('new room created with ID : ', newRoomId)
        if (newRoomId) {
          router.push(`/meeting/room/${newRoomId}`)
        }
      }

      console.log("this is my Peer and this is created " , peer)

      peer.on('open', handleOpen)
      
    socket.on('room-created', roomCreatedHandler)    

        
    myPeer.current = peer
   
        try { 
            navigator.mediaDevices.getUserMedia({video : true , audio : true})
            .then((stream)=>{  
                  setStream(stream)

            })
            .catch((e)=>{
                console.error(e)
            })
          
        } catch (error) {

          console.error(error)
          
        }

       return ()=>{ 
             socket.off('room-created' ,  roomCreatedHandler) ;
             peer.off('open', handleOpen)
         peer.destroy() ;
       }
  }, [router])

  return <RoomContext.Provider value={{socket  , myPeer , peerId , stream , allPeers , Peerdipatch }}> 
      {children} 
  </RoomContext.Provider>
}

export default RoomContextProvider
