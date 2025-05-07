import React from "react";
import { RequireAuth } from "../../api/auth/RequireAuth";

export const PlaylistsPage = () => {
    return (
        <RequireAuth redirect="/">
            <h1>Playlists</h1>
        </RequireAuth>
    )
}