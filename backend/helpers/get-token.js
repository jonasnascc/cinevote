const getToken = (req) => {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.replace("Bearer ", "")
    return token;
}

module.exports = getToken