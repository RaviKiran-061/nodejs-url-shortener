const jwt = require('jsonwebtoken');
const SECRET = 'url-shortner-secret@$123';

function setUserSession(user) {
    return jwt.sign(
        {
            _id: user._id,
            email: user.email,
        }, 
        SECRET
    );
}

function getUserBySession(token) {
    if (!token) return null;
    return jwt.verify(token, SECRET);
}

module.exports = {
    setUserSession,
    getUserBySession,
};