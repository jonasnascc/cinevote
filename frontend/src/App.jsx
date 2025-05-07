import './App.css'
import { Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/Home/Home'
import { PlaylistsPage } from './pages/Playlists/Playlists'
import { LoginForm } from './pages/Home/components/LoginForm'
import { SignupForm } from './pages/Home/components/SignupForm'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage/>}>
        <Route index element={<LoginForm/>}/>
        <Route path='signup' element={<SignupForm/>}/>
      </Route>
      <Route path="/playlists" element={<PlaylistsPage/>} />
    </Routes>
  )
}

export default App
