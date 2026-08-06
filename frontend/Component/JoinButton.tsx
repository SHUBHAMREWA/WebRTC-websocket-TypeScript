"use client";

import { useContext, type FC } from "react";
import Link from "next/link";
import { RoomContext } from "@/Context/RoomContext";

const JoinButton: FC = () => {

    const  {socket}  = useContext(RoomContext);


    const createRoom = ()=>{
        if(socket)
       socket.emit("create-room" ) 
    } 

  return (
    <div className="w-full">
      <Link 
       onClick={createRoom}
        href="/meeting"
        className="m-auto block w-[10%] rounded-xl border-2 bg-blue-600 p-2 text-center cursor-pointer active:bg-gray-800 active:scale-95"
      >
        Start New Meeting
      </Link>
    </div>
  );
};

export default JoinButton;
