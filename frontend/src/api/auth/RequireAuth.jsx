import React, { useContext, useEffect } from "react";
import { AuthContext } from "./AuthProvider";
import { useNavigate } from "react-router-dom";

export const RequireAuth = ({children, redirect}) => {
    const {authenticated} = useContext(AuthContext)
    const navigate = useNavigate()

    useEffect(() => {
        if(redirect && authenticated===false) navigate(redirect)
    }, [authenticated])

    if(!authenticated) return null
    else return(
        <>{children}</>
    )
}