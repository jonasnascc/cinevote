import React from "react";
import { useNavigate } from "react-router-dom";

export const PlaylistsList = ({playlists}) => {
    const navigate = useNavigate()
    
    const handleSelectPlaylist = (id) => {
        navigate("?id=" + id)
    }

    return  playlists.length < 0 ? (null) : (
        <ul>
        {
            playlists.map(({id, inviteCode, name, isPublic, OwnerId, createdAt}, index) => (
                <li style={{cursor:"pointer"}} onClick={() => handleSelectPlaylist(id)} key={index}>{`id: ${id} - inviteCode: ${inviteCode} - name: ${name} - public: ${isPublic} - owner: ${OwnerId} - createdAt: ${
                    new Date(createdAt).toLocaleString("pt-BR", {
                        dateStyle: "short",
                        timeStyle: "short",
                        timeZone: "America/Sao_Paulo"
                    })
                }`}</li>
            ))
        }
        </ul>
    )
}