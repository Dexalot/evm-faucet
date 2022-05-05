
const bodyParser = require('body-parser');
const cors = require('cors');
const api = require('./api');

function beforeMiddleware(app){
    app.use(cors());
    app.use(bodyParser.json());
    app.enable('trust proxy');

    app.set('trust proxy', 2)
    app.get('/ip', (request, response) => response.send(request.ip))

    // HTTPS Enforcement
    app.use('/api', api)
}

module.exports = {
    beforeMiddleware
};
