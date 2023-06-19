const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const registry = require('./routes/registry.json');
const routes = require('./routes');
const app = express();
const gatewayConfig = require('./gateway.config');

// Get port from config file or use default port
const PORT = gatewayConfig.PORT || 3030

// Define CORS for origins - Bypassed for now
const allowedDomains = ['http://localhost:3000', 'https://localhost:3000'];
app.use(cors({
    origin: function (origin, callback) {
        // bypass the requests with no origin (like curl requests, mobile apps, etc)
        if (!origin) return callback(null, true);

        if (allowedDomains.indexOf(origin) === -1) {
            var msg = `This site ${origin} does not have an access. Only specific domains are allowed to access it.`;
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));
app.use(express.json());

// Helmet for HTTP Headers for security - Can be removed if causing too many errors
app.use(helmet())

// UI view engine for API Gateway stats and services
app.set('view engine', 'ejs')
app.get('/ui', (req, res) => {
    res.render('index', { services: registry.services })
})

const apiLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 200, // Limit each IP to 200 requests per `window` (here, per 10 minutes)
    message: 'Too many requests. Please try again in 10 minutes.'
})

// Apply the rate limiting middleware to all requests
app.use('/',apiLimiter);

// Accept all routes for microservices
app.use('/', routes)

// Start gateway in configured port
app.listen(PORT, () => {
    console.log(`API Gateway started on port: ${PORT}`)
})
