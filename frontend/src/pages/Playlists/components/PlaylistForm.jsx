import React, { useState } from "react"

export const PlaylistForm = ({handleSubmit}) => {
    const [playlist, setPlaylist] = useState({
        name: "",
        isPublic: false
    })

    const handleFormSubmit = (e) => {
        e.preventDefault()
        handleSubmit(playlist)
    }

    const handleChange = (e, key) => {
        setPlaylist({
            ...playlist,
            [key] : e.target.value
        })
    }

    const handlePublic = (e, value) => {
        if(e.target.checked) {
            setPlaylist({
                ...playlist,
                isPublic: value
            })
        }
    }

    return(
        <form method="POST">
            <hr/>
            <h3>Create a new Playlist</h3>
            <div>
                <label htmlFor="name">Name: </label>
                <input
                    name="name"
                    type="text"
                    required
                    onChange={(e) => handleChange(e, "name")}
                    value={playlist.name}
                />
            </div>
            <div>
                <label>
                    <input 
                        type="radio" 
                        name="isPublic" 
                        value={true}
                        required
                        onChange={(e) => handlePublic(e, true)}
                    />
                    Public
                </label>
                <label>
                    <input 
                        type="radio" 
                        name="isPublic" 
                        value={false}
                        required
                        onChange={(e) => handlePublic(e, false)}
                    />
                    Private
                </label>
            </div>
            <button type="submit" onClick={handleFormSubmit}>Create</button>
            <hr/>
        </form>
    )
}