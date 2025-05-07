import { createContext, useEffect, useState } from "react";
import useAuth from "./useAuth.js"

const AuthContext = createContext()

const AuthProvider = ({children}) => {
    const [user, setUser] = useState()
    const [authenticated, setAuthenticated] = useState()

    const auth = useAuth()

    const validate =  async () => {
        const user = await auth.validate()
        setUser(user)
        setAuthenticated(!!user)
    }

    useEffect(() => { 
        validate()
    }, [])

    const login = async (body) => {
        const resp = await auth.login(body)
        setUser(resp)
        if(resp) setAuthenticated(true)
        return !!resp
    }

    const signup = async (body) => {
        const resp = await auth.signup(body)
        setUser(resp)
        if(resp) setAuthenticated(true)
        return !!resp
    }

    const logout = async () => {
        const resp = await auth.logout()
        if(resp) {
            setUser(null)
            setAuthenticated(false)
        }
        return resp
    }

    return (
        <AuthContext.Provider value={{user, authenticated, login, signup, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export {
    AuthContext,
    AuthProvider
}