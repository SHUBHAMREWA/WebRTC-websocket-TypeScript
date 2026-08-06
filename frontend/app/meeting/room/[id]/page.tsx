"use client"
import React, { useContext, useEffect } from 'react'
import {useParams} from "next/navigation" ; 
import {RoomContext} from "../../../../Context/RoomContext"
import VideoPlayer from '@/Component/VideoPlayer';

const Room = () => {  
        const params  = useParams() ; 
        const {socket , myPeer , stream} =  useContext(RoomContext);  
        
        
     const getRoomUser = (
  {
    roomId,
    participants,
  }: {
    roomId: string;
    participants: string[];
  }
) => {
    console.log("roomId" , roomId);
    console.log("participants"  ,participants);
};
     
          
     useEffect(()=>{  
          if (!myPeer || !params.id) return;

          socket.emit("join-room" ,  { roomId  :  params.id , peerId : myPeer.id} )    ;
          socket.on('room-user' , getRoomUser ) ; 
          socket.on("disconnect-user" , (user : string)=>{
               console.log("this is user is disconnected " , user)
          })
          
          return () => {
               socket.off('room-user', getRoomUser);
               socket.off("diconnect-user");
          }
     }, [params.id, myPeer])

  return (
    <div> 
        <h1>this is YOur param Id </h1> 
        <p>{params.id}</p>
        <VideoPlayer stream={stream} />
    </div>
  )
}

export default Room

