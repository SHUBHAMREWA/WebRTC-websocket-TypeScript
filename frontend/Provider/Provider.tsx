import RoomContextProvider from "./RoomContextProvider"

import React from 'react'

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <RoomContextProvider>{children}</RoomContextProvider>
    </>
  )
}

export default Provider
