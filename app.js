const express = require('express');
const cors = require('cors');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const middlewares = require('./middlewares');

require('dotenv').config();


const app = express();
const port = process.env.PORT || 4000;

// plugins
app.use(cors());
app.use(express.json());
app.set('trust proxy', 1);

// rate limit
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500 // limit each IP to 100 requests per windowMs
});

// speed limit
const speedLimitter = slowDown({
    windowMs: 30 * 1000, // 30 seconds
    delayAfter: 10,
    delayMs: 500
});

// controller
const proxy = async (req, res, next) => {
    try {
        const config = req.body;
        config.timeout = 30000;
        console.log(config)
        const { data } = await axios(config);

        res.json(data);
    } catch (err) {
        next(err);
    }
};

// router
app.post('/proxy', limiter, speedLimitter, proxy);

// middlewares
app.use(middlewares.errorHandler);

// launch server
app.listen(port, err => {
    if(err) throw err;
    console.log(`listening to port ${port} http://localhost:${port}`);
});