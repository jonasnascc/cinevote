import api from "../axios"

const useAuth = () => ({
    validate: async () => {
        let response = null;
        await api.get("users/checkuser")
            .then((resp) => response = resp)
            .catch((err) => console.log(err))

        return response!==null ? response.data : null
    },

    signup: async (signupBody) => {
        let response = null;
        await api.post("users/register", signupBody)
            .then((resp) => response = resp)
            .catch((err) => console.log(err))

        return response!==null ? response.data.user : null
    },

    login: async (loginBody) => {
        let response = null;
        await api.post("users/login", loginBody)
            .then((resp) => response = resp)
            .catch((err) => console.log(err))

        return response!==null ? response.data.user : null
    },

    logout: async () => {
        let response = null;
        await api.post("users/logout")
            .then((resp) => response = resp)
            .catch((err) => console.log(err))
            
        return response.status === 200
    }
})

export default useAuth