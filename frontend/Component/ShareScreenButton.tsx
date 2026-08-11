import React from 'react'
import { MdOutlineMonitor } from "react-icons/md";  

const ShareScreenButton = ({onClick }: {onClick : ()=>void}) => {
  return (
   <button  
    onClick={onClick}
    className='text-2xl p-3 bg-amber-600 rounded-2xl active:bg-amber-500 hover:cursor-pointer'>
    <MdOutlineMonitor/>
   </button>
  )
}

export default ShareScreenButton