"use client"
import React, { useEffect, useRef } from 'react'

interface VideoPlayerProps {
      stream : MediaStream
}

const VideoPlayer = ({stream }: VideoPlayerProps , index : string) => {   

       const videoRef = useRef<HTMLVideoElement>(null) ;   

        
      useEffect(()=>{  

         if(videoRef.current){
                 videoRef.current.srcObject = stream
         }

      })
       
  return (
    <div>
        <video 
        ref={videoRef} 
        muted
        width={500}
         autoPlay
            style={{
        transform: `scaleX(${index})`,
        }}
          />
    </div>
  )
}

export default VideoPlayer