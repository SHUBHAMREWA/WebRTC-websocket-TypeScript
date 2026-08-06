"use client"
import React, { useEffect, useRef } from 'react'

interface VideoPlayerProps {
      stream : MediaStream
}

const VideoPlayer = ({stream }: VideoPlayerProps) => {   

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
        transform: "scaleX(-1)",
        }}
          />
    </div>
  )
}

export default VideoPlayer