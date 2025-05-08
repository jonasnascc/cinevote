import React, { useState } from "react";
import useMovies from "../../../api/services/useMovies";

export const MovieForm = ({handleSubmit}) => {
    const [movie, setMovie] = useState({
        name: "",
    })

    const {create} = useMovies()

    const handleFormSubmit = async (e) => {
        e.preventDefault()

        const resp = await create(movie)
        if(resp) {
            handleSubmit(resp)
        }
    }

    const handleChange = (e, key) => {
        setMovie({
            ...movie,
            [key]: e.target.value
        })
    }

    return (
        <form>
            <hr/>
            <h4>Add Movie</h4>
            <div>
                <label htmlFor="name">Movie name: </label>
                <input
                    type="text"
                    name="name"
                    required
                    onChange={(e) => handleChange(e, "name")}
                />
            </div>
             <div>
                <label htmlFor="tmdbId">TMDB ID: </label>
                <input
                    type="number"
                    name="tmdbId"
                    required
                    onChange={(e) => handleChange(e, "tmdbId")}
                />
            </div>
            <button type="submit" onClick={handleFormSubmit}>Add</button>
            <hr/>
        </form>
    )
}