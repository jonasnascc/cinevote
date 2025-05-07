import React from "react";
import { Outlet } from "react-router-dom";
import { AuthSection } from "./components/AuthSection";

export const HomePage = () => {
    return (
        <>
            <div>
                <h1>Welcome to CineVote!</h1>
                <h2>Create video or music playlists together with your friends!</h2>
            </div>
            <AuthSection>
                <Outlet/>
            </AuthSection>
        </>
    )
}