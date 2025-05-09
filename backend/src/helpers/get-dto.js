function getPlaylistItemDTO(playlistItem, movieInst) {
    const movie = playlistItem?.Movie ?? movieInst 
    const {
        id, position, PlaylistId, createdAt
    } = playlistItem

    const dto = {
        id,
        position, 
        PlaylistId, 
        createdAt,
        movie : {
            id: movie.id,
            name: movie.name,
            tmdbId: movie.tmdbId
        },
        votes : {positive: 0, negative: 0}
    }

    
    const votes = playlistItem.Votes
    if(votes) {
        const resumeVotes = votes.reduce((acum, current) => {
                if(current.isPositive) acum.positive += 1
                else acum.negative += 1
                return acum
        }, {positive: 0, negative: 0})

        dto.votes = resumeVotes
    }

    return dto
}

module.exports = {
    getPlaylistItemDTO
}