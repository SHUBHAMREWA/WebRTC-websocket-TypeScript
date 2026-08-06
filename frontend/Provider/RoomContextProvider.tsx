'use client' // <--- Ye line add karni hai sabse top par!
import React, { useEffect, useState } from 'react'
import { socket } from '../Context/RoomContext'
import { RoomContext } from '../Context/RoomContext'
import { useRouter } from 'next/navigation'
import Peer from 'peerjs' ; 
import {v4 as uuid4 } from "uuid"

const RoomContextProvider = ({ children }: { children: React.ReactNode }) => { 
   
      const [myPeer , setMyPeer] = useState<Peer | null>(null) ;
      const [stream , setStream]  = useState<MediaStream | null>(null)
  const router = useRouter()

  const roomCreatedHandler = (newRoomId: string) => {
    console.log('new room created with ID : ', newRoomId)
    if (newRoomId) {
      router.push(`/meeting/room/${newRoomId}`)
    }
  }


  useEffect(() => {    
      const peer = new Peer(uuid4())  ;
       
    if(peer)   setMyPeer(peer)   
   
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

    
    socket.on('room-created', roomCreatedHandler)  

       return ()=>{ 
             socket.off('room-created' ,  roomCreatedHandler) ;
         peer.destroy() ;
       }
  }, [])

  return <RoomContext.Provider value={{socket  , myPeer , stream }}> 
      {children} 
  </RoomContext.Provider>
}

export default RoomContextProvider
