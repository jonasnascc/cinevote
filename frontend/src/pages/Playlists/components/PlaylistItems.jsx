import { useState } from "react";

export const PlaylistItems = ({items}) => {
    return (
        <ul>
        {
            items.map(({id, position, movie}, index) => (
                <li key={index}>{`id: ${id} | position: ${position} | movie: ${movie.name}`}</li>
            ))
        }
        </ul>
    )
}