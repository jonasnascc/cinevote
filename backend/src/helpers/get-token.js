const getToken = (req) => {
    try{
        const token = req.cookies.token
        return token;
    }
    catch(error) {
        console.log(error)
    }
    return null;
}

module.exports = getToken