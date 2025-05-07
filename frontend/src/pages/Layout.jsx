import { useContext } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { AuthContext } from "../api/auth/AuthProvider"
import { RequireAuth } from "../api/auth/RequireAuth"

export const Layout = () => {
    const {logout} = useContext(AuthContext)
    const navigate = useNavigate()

    const handleLogout = async (e) => {
        e.preventDefault()
        const success = await logout()
        if(success) navigate("/")
    }

    return(
        <>
            <nav>
                <RequireAuth><a href="#" onClick={handleLogout}>Logout</a></RequireAuth>
            </nav>
            <Outlet/>
        </>
    )
}