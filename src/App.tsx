import React from "react"
import { HashRouter, Routes, Route, Navigate } from "react-router-dom"

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<h1>Lobby</h1>} />
        <Route path="/:roomId" element={<h1>Chat room</h1>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </HashRouter>
  )
}

export default App
