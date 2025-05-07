import { useState } from "react";

export const SignupForm = () => {
    const [signupData, setSignupData] = useState({
        username: "",
        email: "",
        password: "",
        passwordConfirm: ""
    })
    
    const handleFormChange = (e, key) => {
        if(!Object.keys(signupData).includes(key)) return;

        setSignupData({
            ...signupData,
            [key] : e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(signupData)
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