import api from "../axios"

const usePlaylists = () => ({
    createNew: async (body) => {
        let response = null;
        await api.post("playlists", body)
            .then((resp) => response = resp)
            .catch((err) => console.error(err))

        return response!==null ? response.data.playlist : null
    },

    list: async (body) => {
        let response = null;
        await api.get("playlists")
            .then((resp) => response = resp)
            .catch((err) => console.error(err))

        return response!==null ? response.data.playlists : null
    },

    findById: async (id) => {
        let response = null;
        await api.get("playlists/"+id)
            .then((resp) => response = resp)
            .catch((err) => console.error(err))

        return response!==null ? response.data.playlist : null
    },

    addItem: async (playlistId, movieId, position) => {
        let response = null;
        await api.post(`playlists/${playlistId}/items`, {movieId, position})
            .then((resp) => response = resp)
            .catch((err) => console.error(err))

        return response!==null ? response.data.playlistItem : null
    },

    listItems: async (playlistId) => {
        let response = null;
        await api.get(`playlists/${playlistId}/items`)
            .then((resp) => response = resp)
            .catch((err) => console.error(err))

        return response!==null ? response.data.playlistItems : null
    },

    voteItem: async (inviteCode, itemId, value) => {
        let response = null;
        await api.post(`playlists/inviteCode/${inviteCode}/items/${itemId}/vote/${value ? 1: 0}`)
            .then((resp) => response = resp)
            .catch((err) => console.error(err))

        return response!==null
    }
})

export default usePlaylists