import './App.css'
import { Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/Home/Home'
import { PlaylistsPage } from './pages/Playlists/Playlists'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage/>} />
      <Route path="/playlists" element={<PlaylistsPage/>} />
    </Routes>
  )
}

export default App
