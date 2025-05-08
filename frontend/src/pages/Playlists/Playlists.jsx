import React, { useEffect, useState } from "react";
import { RequireAuth } from "../../api/auth/RequireAuth";
import usePlaylists from "../../api/services/usePlaylists";
import { PlaylistForm } from "./components/PlaylistForm";
import { PlaylistsList } from "./components/PlaylistsList";
import { useSearchParams } from "react-router-dom";
import { PlaylistPage } from "./PlaylistPage";

export const PlaylistsPage = () => {
    const [searchParams] = useSearchParams()
    const id = searchParams.get('id')

    const [playlists, setPlaylists] = useState([])
    const {createNew, list} = usePlaylists()

    const handleListPlaylists = async () => {
        const data = await list()
        setPlaylists(data)
    }

    useEffect(() => {
        handleListPlaylists()
    }, [])

    const handleCreate = async (body) => {
        const resp = await createNew(body)
        if(resp) {
            await handleListPlaylists()
        }
    }

    return (
        <RequireAuth redirect="/">
        {
            id ? (
                <>
                <h1>Playlist</h1>
                <PlaylistPage playlistId={id}/>
                </>
            ) : (
                <>
                <h1>Playlists</h1>
                <PlaylistForm handleSubmit={handleCreate}/>
                <PlaylistsList playlists={playlists}/>
                </>
            )
        }
        </RequireAuth>
    )
}