require('dotenv').config();

const express = require('express');
const rateLimit = require('express-rate-limit')
const {resolve} = require('path');
const {CONFIG} = require('./eth');
const history = require('connect-history-api-fallback');
const {beforeMiddleware} = require('./configure');
const helmet = require("helmet");

const ERL_WINDOW_MIN = parseInt(process.env.ERL_WINDOW_MIN || "15"); // Time period for which requests are checked/remembered in minutes
const ERL_MAX_HIT = parseInt(process.env.ERL_MAX_HIT || "10"); // The maximum number of connections to allow during the window

// VALUE CHECKING ####################################################
if(!CONFIG.PK){
    console.error("You must start the server with a valid PRIVATE_KEY.");
}

if(!CONFIG.CAPTCHA_SECRET){
    console.error("You must provide a CAPTCHA_SECRET.");
}

const app = express();

const limiter = rateLimit({
        windowMs: ERL_WINDOW_MIN * 60 * 1000,  // windowed period ERL_WINDOW_MIN in milliseconds
        max: ERL_MAX_HIT,                      // limit each IP to ERL_MAX_HIT requests per window
        standardHeaders: true,
        legacyHeaders: false,
})

app.use('/api/token', limiter);

app.use(helmet());

// API
beforeMiddleware(app);

// Https rerouting
app.use((req, res, next) => {
    if (req.secure) {
        // request was via https, so do no special handling
        next();
    } else {
        // request was via http, so redirect to https
        res.redirect('https://' + req.headers.host + req.url);
    }
});
app.use(helmet.xssFilter());
app.use(helmet.frameguard());

// Serve static files
const publicPath = resolve(__dirname, '../../dist');
const staticConf = { maxAge: '1y', etag: false };

app.use(express.static(publicPath, staticConf));
app.use(history());


const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log("listening on port:\t",port);
    console.log("Droplet:\t",CONFIG.DROP_SIZE);
    console.log("Address:\t",CONFIG.FAUCET_ADDRESS);

    if(CONFIG.ASSET_ID){
        console.log("Asset:\t",CONFIG.ASSET_ID);
    }
});
