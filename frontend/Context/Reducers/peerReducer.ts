
import { ADD_PEER , REMOVE_PEER } from "../peerActions"
import type { PeerAction } from "../peerActions"


type peerState = Record<string , {stream : MediaStream}>

export const peerReducer  = (state : peerState , actions : PeerAction )=>{ 
       
      switch(actions.type){
          case ADD_PEER : 
           return {
                  ...state , 
                  [actions.payload.peerId] : {
                      stream : actions.payload.stream
                  }
           } 
            case REMOVE_PEER : 
                 const nextState = { ...state }
                 delete nextState[actions.payload.peerId]
                   return  nextState ;

            default : 
            return   state   
     
}}
