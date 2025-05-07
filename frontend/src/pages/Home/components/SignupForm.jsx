import { useContext, useState } from "react";
import { AuthContext } from "../../../api/auth/AuthProvider";
import { useNavigate } from "react-router-dom";

export const SignupForm = () => {
    const {signup} = useContext(AuthContext)

    const [signupData, setSignupData] = useState({
        username: "",
        email: "",
        password: "",
        passwordConfirm: ""
    })
    
    const navigate = useNavigate()

    const handleFormChange = (e, key) => {
        if(!Object.keys(signupData).includes(key)) return;

        setSignupData({
            ...signupData,
            [key] : e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if(await signup(signupData))
            navigate("/playlists")
        else console.error("Could not sign up")
    }

    return(
        <form method="POST">
            <div>
                <label htmlFor="username">Username: </label>
                <input 
                    type="text"
                    name="username"
                    required
                    onChange={(e) => handleFormChange(e, "username")}
                />
            </div>
            <div>
                <label htmlFor="email">Email: </label>
                <input 
                    type="email"
                    name="email"
                    required
                    onChange={(e) => handleFormChange(e, "email")}
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
            <div>
                <label htmlFor="passwordConfirm">Confirm password: </label>
                <input 
                    type="password"
                    name="passwordConfirm"
                    required
                    onChange={(e) => handleFormChange(e, "passwordConfirm")}
                />
            </div>
            <button type="submit" onClick={handleSubmit}>Submit</button>
        </form>
    )
}