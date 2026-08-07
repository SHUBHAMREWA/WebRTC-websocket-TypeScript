import express from 'express' ;
import http from 'http' ;
import {Server} from "socket.io" ;
import cors from "cors" ; 
import { roomHandler } from './socket/joinRoom.js';




const PORT = 8080

const app = express()
  
app.use(cors({
     origin : [  
         "http://localhost:3000" , 
         "*"
     ]
})) ; 

const server = http.createServer(app)  ; 


const io = new Server(server, {
      cors  : {
         origin : [
             "http://localhost:3000" , 
             "*"
         ]    ,
         methods : ['GET' , 'POST']
      }
}) 



io.on("connection" , (socket)=>{
      console.log("user is conneted ")  
      roomHandler(socket, io) ;     

      socket.on("disconnect" , ()=>{
          console.log("user is disconnected") 
      })
     
})

server.listen(PORT, () => {
  console.log(`server is runnign on PORT ${PORT}`)
})
