import './App.css'
import { Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/Home/Home'
import { PlaylistsPage } from './pages/Playlists/Playlists'
import { LoginForm } from './pages/Home/components/LoginForm'
import { SignupForm } from './pages/Home/components/SignupForm'
import { Layout } from './pages/Layout'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout/>}>
        <Route index element={<HomePage><LoginForm/></HomePage>}/>
        <Route path='signup' element={<HomePage><SignupForm/></HomePage>}/>
        <Route path="playlists" element={<PlaylistsPage/>} />
      </Route>
    </Routes>
  )
}

export default App
