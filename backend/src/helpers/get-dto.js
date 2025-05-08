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
        }
    }
    return dto
}

module.exports = {
    getPlaylistItemDTO
}