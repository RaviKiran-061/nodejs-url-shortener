
const User = require('../models/user');
const {v4: uuidv4} = require('uuid');
const { setUserSession } = require('../service/auth');

async function handleUserSignup(req, res) {
    const { name, email, password } = req.body;

    await User.create({ 
        name, 
        email, 
        password 
    });

    return res.redirect('/');
};


async function handleUserlogin(req, res) {
    const { email, password } = req.body;

   const user = await User.findOne({ email, password });

   if (!user) {
        return res.render('login', { 
            error: 'Invalid credentials' 
        });
   }

    const token = setUserSession(user);
    res.cookie('uid', token);

    return res.redirect('/');
};

module.exports = { 
    handleUserSignup,
    handleUserlogin,
};