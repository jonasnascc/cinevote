import React, { useContext, useState } from "react";
import { AuthContext } from "../../../api/auth/AuthProvider";
import { useNavigate } from "react-router-dom";

export const LoginForm = () => {
    const {login} = useContext(AuthContext)
    const [loginData, setLoginData] = useState({login: "", password: ""})

    const navigate = useNavigate()

    const handleFormChange = (e, key) => {
        if(!Object.keys(loginData).includes(key)) return;

        setLoginData({
            ...loginData,
            [key] : e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if(await login(loginData))
            navigate("/playlists")
        else console.error("Could not authenticate")
    }

    const handleSignupLink = (e) => {
        e.preventDefault()
        navigate("/signup")
    }

    return(
        <form method="POST">
            <div>
                <label htmlFor="login">Username: </label>
                <input 
                    type="text"
                    name="login"
                    required
                    onChange={(e) => handleFormChange(e, "login")}
                />
            </div>
            <div>
                <label htmlFor="password">Password: </label>
                <input 
                    type="password"
                    name="password"
                    required
                    onChange={(e) => handleFormChange(e, "password")}
                />
            </div>
            <button type="submit" onClick={handleSubmit}>Login</button>
            <div>You don’t have an account? <a href="#" onClick={handleSignupLink}>Sign up here</a></div>
        </form>
    )
}