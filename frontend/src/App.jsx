import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'

function App() {
  return (
    <Routes>
      <Route path="/" element={<h1>Hello world!</h1>} />
    </Routes>
  )
}

export default App
