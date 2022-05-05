
const bodyParser = require('body-parser');
const cors = require('cors');
const api = require('./api');

const ERL_NUM_PROXIES = parseInt(process.env.ERL_NUM_PROXIES || "2"); // The number of proxies between the user and the server

function beforeMiddleware(app){
    app.use(cors());
    app.use(bodyParser.json());
    app.enable('trust proxy');

    app.set('trust proxy',ERL_NUM_PROXIES)
    app.get('/ip', (request, response) => response.send(request.ip))

    // HTTPS Enforcement
    app.use('/api', api)
}

module.exports = {
    beforeMiddleware
};
