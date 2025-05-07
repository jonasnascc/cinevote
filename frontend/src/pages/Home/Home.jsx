import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthSection } from "./components/AuthSection";
import { AuthContext } from "../../api/auth/AuthProvider";

export const HomePage = ({children}) => {
    const {authenticated} = useContext(AuthContext)
    const navigate = useNavigate()

    useEffect(() => {
        if(authenticated) navigate("/playlists")
    }, [authenticated])

    if(authenticated || authenticated == undefined) return null;
    return (
        <>
            <div>
                <h1>Welcome to CineVote!</h1>
                <h2>Create video or music playlists together with your friends!</h2>
            </div>
            <AuthSection>
                {children}
            </AuthSection>
        </>
    )
}