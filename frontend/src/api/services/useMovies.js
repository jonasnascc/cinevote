import api from "../axios"

const useMovies = () => ({
    create: async (body) => {
        let response = null;
        await api.post("movies", body)
            .then((resp) => response = resp)
            .catch((err) => console.error(err))

        return response!==null ? response.data.movie : null
    }
})

export default useMovies;