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
    }
})

export default usePlaylists