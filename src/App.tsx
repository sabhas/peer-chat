import React from "react"
import { HashRouter, Routes, Route, Navigate } from "react-router-dom"
import { Lobby } from "./pages/lobby"

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Lobby />} />
        <Route path="/:roomId" element={<h1>Chat room</h1>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </HashRouter>
  )
}

export default App
