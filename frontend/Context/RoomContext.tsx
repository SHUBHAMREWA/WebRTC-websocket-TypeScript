"use client"

import React, { createContext } from 'react';

import socketIO from "socket.io-client" ; 
const ws = "http://localhost:8080"  ;


export  const socket  = socketIO(ws) ;

export const RoomContext = createContext<null | any>(null) ;

