"use client"

import { createContext, type Dispatch, type RefObject } from 'react'
import socketIO, { type Socket } from 'socket.io-client'
import type Peer from 'peerjs'
import type { PeerAction } from './peerActions'

const ws = 'http://localhost:8080'

export type RoomContextType = {
  socket: Socket
  myPeer: RefObject<Peer | null>
  peerId: string | null
  stream: MediaStream | null
  allPeers: Record<string, { stream: MediaStream }>
  Peerdipatch: Dispatch<PeerAction> 
  OnScreenShare : () => void
}

export const socket = socketIO(ws)

export const RoomContext = createContext<RoomContextType | null>(null)
