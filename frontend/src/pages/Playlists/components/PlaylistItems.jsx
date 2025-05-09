
export const PlaylistItems = ({items, handleVoteItem}) => {

    const handleVote = async (e, itemId, value) => {
        e.preventDefault()
        await handleVoteItem(itemId, value)
    }

    return (
        <ul>
        {
            items.map(({id, position, movie, votes}, index) => (
                <li key={index}>
                    {`id: ${id} | position: ${position} | movie: ${movie.name} | votes: [pos: ${votes.positive}, neg: ${votes.negative}]`}
                    <div><a href="#" onClick={(e) => handleVote(e, id, true)}>Up</a>
                    |
                    <a href="#" onClick={(e) => handleVote(e, id, false)}>Down</a></div>
                </li>
            ))
        }
        </ul>
    )
}