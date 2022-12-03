import React from "react"
import { HashRouter, Routes, Route, Navigate } from "react-router-dom"
import { Lobby } from "./pages/lobby"
import { Room } from "./pages/room"

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Lobby />} />
        <Route path="/:roomId" element={<Room />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </HashRouter>
  )
}

export default App
