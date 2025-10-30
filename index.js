const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const {connectToMongoDB} = require('./connect');
const {restrictToUnAuthenticated, checkIfAuthenticated} = require('./middlewares/auth');
 
const URL = require('./models/url');

const urlRoutes = require('./routes/url');
const staticRoutes = require('./routes/staticRouter');
const userRoutes = require('./routes/user');

const app = express();
const port = 3000;

connectToMongoDB('mongodb://127.0.0.1:27017/url-shortner')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Failed to connect to MongoDB', err));

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/url', restrictToUnAuthenticated, urlRoutes);
app.use('/user', userRoutes);
app.use('/', checkIfAuthenticated, staticRoutes);

app.get('/url/:shortId', async (req, res) => {
    const { shortId } = req.params;
    const entry = await URL.findOneAndUpdate({
        shortId,
    }, {
        $push: {
            visitHistory: {
                timestamp: Date.now(),
            },
        },
    });

    res.redirect(entry.redirectUrl);
});

app.listen(port, () => console.log(`Server running on port ${port}`));