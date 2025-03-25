const getToken = (req) => {
    try{
        const authHeader = req.headers["authorization"]
        const token = authHeader && authHeader.replace("Bearer ", "")
        return token;
    }
    catch(error) {
        console.log(error)
    }
}

module.exports = getToken