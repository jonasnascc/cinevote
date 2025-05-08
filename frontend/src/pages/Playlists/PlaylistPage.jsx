import React, { useState } from "react";
import usePlaylists from "../../api/services/usePlaylists";

export const PlaylistPage = ({playlistId}) => {
    const [playlist, setPlaylist] = useState({})
    const {findById} = usePlaylists()

    useState(async () => {
        const resp = await findById(playlistId)
        if(resp) {
            setPlaylist(resp)
        }
    }, [])
    return (
        <>
        {JSON.stringify(playlist)}
        </>
    )
}