import React, { useState } from "react";
import usePlaylists from "../../api/services/usePlaylists";
import { convertTimeString } from "../../helpers";
import { MovieForm } from "./components/MovieForm";
import { PlaylistItems } from "./components/PlaylistItems";

export const PlaylistPage = ({playlistId}) => {
    const [playlist, setPlaylist] = useState()
    const [items, setItems] = useState([])
    const [openMovieForm, setOpenMovieForm] = useState(false)
    const {findById, addItem, listItems, voteItem} = usePlaylists()

    const handleListItems = async () => {
        const items = await listItems(playlistId)
        const orderedByPos = items.sort((a,b) => a.position-b.position)
        if(items) setItems(orderedByPos)
    }

    useState(() => {
        const fetchItems = async () => {
            const pl = await findById(playlistId)
            if(pl) setPlaylist(pl)

            await handleListItems()
        }

        fetchItems()
    }, [])

    const handleAddMovieBtn = () => {
        setOpenMovieForm(!openMovieForm)
    }

    const handleCreateMovie = async (movie) => {
        setOpenMovieForm(false)
        const resp = await addItem(playlistId, movie.id)
        if(resp) {
            await handleListItems()
        }
    }

    const handleVoteItem = async (itemId, value) => {
        if(await voteItem(playlist.inviteCode, itemId, value)) {
            await handleListItems()
        }
    }

    if(playlist) return (
        <>
        <div>
            <h1>Playlist: {`${playlist.name}`}</h1>
            <h3>{`id: ${playlist.id} (${playlist.isPublic ? "Public":"Private"})`}</h3>
            <p>{`created at: ${convertTimeString(playlist.createdAt)}`}</p>
            <p>{`Owner: ${playlist.OwnerId}`}</p>
            <p>{`Invite code: ${playlist.inviteCode}`}</p>
        </div>

        <button onClick={handleAddMovieBtn}>{openMovieForm ? "Close movie form" : "Add movie"}</button>
        {openMovieForm&&<MovieForm handleSubmit={handleCreateMovie}/>}
        <PlaylistItems items={items} handleVoteItem={handleVoteItem}/>
        </>
    )
    else return null
}