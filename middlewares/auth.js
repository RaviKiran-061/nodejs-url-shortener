const { getUserBySession } = require('../service/auth');

async function restrictToUnAuthenticated(req, res, next) {
    const userUid = req.cookies?.uid;

    if (!userUid) return res.redirect('/login');

    const user = getUserBySession(userUid);

    if (!user) return res.redirect('/login');

    req.user = user;
    next();
}


async function checkIfAuthenticated(req, res, next) {
    const userUid = req.cookies?.uid;

    const user = getUserBySession(userUid);

    req.user = user;
    next();
}

module.exports = { 
    restrictToUnAuthenticated,
    checkIfAuthenticated,
};