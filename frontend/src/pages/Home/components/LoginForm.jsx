import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const LoginForm = () => {
    const navigate = useNavigate()

    const [loginData, setLoginData] = useState({login: "", password: ""})

    const handleFormChange = (e, key) => {
        if(!Object.keys(loginData).includes(key)) return;

        setLoginData({
            ...loginData,
            [key] : e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(loginData)
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