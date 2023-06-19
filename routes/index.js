const express = require('express')
const router = express.Router()
const axios = require('axios')
const registry = require('./registry.json')
const fs = require('fs')
const loadBalancer = require('../balancer/loadbalancer')
const gatewayConfig = require('../gateway.config')

router.post('/enable/:serviceName', (req, res) => {
    const serviceName = req.params.serviceName
    const requestBody = req.body
    const instances = registry.services[serviceName].instances
    const index = instances.findIndex((srv) => { return srv.url === requestBody.url })
    if(index === -1){
        res.send({ status: 'error', message: "Could not find '" + requestBody.url + "' for service '" + serviceName + "'"})
    } else {
        instances[index].enabled = requestBody.enabled
        fs.writeFile(gatewayConfig.REGISTRY_PATH, JSON.stringify(registry), (error) => {
            if (error) {
                res.send("Could not enable/disable '" + requestBody.url + "' for service '" + serviceName + ":'\n" + error)
            } else {
                res.send("Successfully enabled/disabled '" + requestBody.url + "' for service '" + serviceName + "'\n")
            }
        })
    }
})

router.all('/:apiName/:path', (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

    const service = registry.services[req.params.apiName]
    if (service) {
        if (!service.loadBalanceStrategy) {
            service.loadBalanceStrategy = 'ROUND_ROBIN'
            fs.writeFile('./routes/registry.json', JSON.stringify(registry), (error) => {
                if (error) {
                    res.send("Couldn't write load balance strategy" + error)
                }
            })
        }

        const newIndex = loadBalancer[service.loadBalanceStrategy](service)
        const url = service.instances[newIndex].url
        console.log("Full path:" + url + req.params.path)
        console.log("Req.params: " + JSON.stringify(req.params))

        axios({
            method: req.method,
            url: url + req.params.path,
            headers: { 'Content-Type': 'application/json' },
            data: req.body,
            timeout: 3000
        }).then((apiResponse) => {
            const result = apiResponse.data
            response = result;
            res.json(result)
        }).catch(apiError => {
            if (apiError.response) {
                res
                    .status(apiError.response.status)
                    .send(apiError.response.data);
            } else if (apiError.request) {
                res
                    .status(apiError.request.status)
                    .send(apiError.request.data);
            } else if (apiError.message.includes('timeout')) {
                res
                    .status(503)
                    .send(apiError.message);
            } else if (apiError.status === null || apiError.status === undefined) {
                res
                    .status(500)
                    .send(apiError.message);
            } else {
                res
                    .status(apiError.status)
                    .send(apiError.message);
            }
        })
    } else {
        res.send("API Name doesn't exist")
    }
})

router.all('/:apiName/:path/:id', (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

    const service = registry.services[req.params.apiName]
    if (service) {
        if (!service.loadBalanceStrategy) {
            service.loadBalanceStrategy = 'ROUND_ROBIN'
            fs.writeFile('./routes/registry.json', JSON.stringify(registry), (error) => {
                if (error) {
                    res.send("Couldn't write load balance strategy" + error)
                }
            })
        }

        const newIndex = loadBalancer[service.loadBalanceStrategy](service)
        const url = service.instances[newIndex].url
        console.log("Full path:" + url + req.params.path + "/" + req.params.id);
        console.log("Req.params: " + JSON.stringify(req.params))

        axios({
            method: req.method,
            url: url + req.params.path + '/' + req.params.id,
            headers: { 'Content-Type': 'application/json' },
            data: req.body,
            timeout: 3000
        }).then((apiResponse) => {
            const result = apiResponse.data
            res.json(result)
        }).catch(apiError => {
            if (apiError.response) {
                res
                    .status(apiError.response.status)
                    .send(apiError.response.data);
            } else if (apiError.request) {
                res
                    .status(apiError.request.status)
                    .send(apiError.request.data);
            } else if (apiError.message.includes('timeout')) {
                res
                    .status(503)
                    .send(apiError.message);
            } else if (apiError.status === null || apiError.status === undefined) {
                res
                    .status(500)
                    .send(apiError.message);
            } else {
                res
                    .status(apiError.status)
                    .send(apiError.message);
            }
        })
    } else {
        res.send("API Name doesn't exist")
    }
})

router.all(`/:apiName/:path/:endpoint/:id`, (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

    const service = registry.services[req.params.apiName]
    if (service) {
        if (!service.loadBalanceStrategy) {
            service.loadBalanceStrategy = 'ROUND_ROBIN'
            fs.writeFile('./routes/registry.json', JSON.stringify(registry), (error) => {
                if (error) {
                    res.send("Couldn't write load balance strategy" + error)
                }
            })
        }

        const newIndex = loadBalancer[service.loadBalanceStrategy](service)
        const url = service.instances[newIndex].url
        console.log("Full path:" + url + req.params.path + "/" + req.params.id);
        console.log("Req.params: " + JSON.stringify(req.params))

        axios({
            method: req.method,
            url: url + req.params.path + '/' + req.params.endpoint + '/' + req.params.id,
            headers: { 'Content-Type': 'application/json' },
            data: req.body,
            timeout: 3000
        }).then((apiResponse) => {
            const result = apiResponse.data
            res.json(result)
        }).catch(apiError => {
            if (apiError.response) {
                res
                    .status(apiError.response.status)
                    .send(apiError.response.data);
            } else if (apiError.request) {
                res
                    .status(apiError.request.status)
                    .send(apiError.request.data);
            } else if (apiError.message.includes('timeout')) {
                res
                    .status(503)
                    .send(apiError.message);
            } else if (apiError.status === null || apiError.status === undefined) {
                res
                    .status(500)
                    .send(apiError.message);
            } else {
                res
                    .status(apiError.status)
                    .send(apiError.message);
            }
        })
    } else {
        res.send("API Name doesn't exist")
    }
})
router.all('/:apiName/:path/:identifier/:endpoint/:id', (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

    const service = registry.services[req.params.apiName]
    if (service) {
        if (!service.loadBalanceStrategy) {
            service.loadBalanceStrategy = 'ROUND_ROBIN'
            fs.writeFile('./routes/registry.json', JSON.stringify(registry), (error) => {
                if (error) {
                    res.send("Couldn't write load balance strategy" + error)
                }
            })
        }

        const newIndex = loadBalancer[service.loadBalanceStrategy](service)
        const url = service.instances[newIndex].url
        console.log("Full path:" + url + req.params.path + "/" + req.params.identifier + "/" + req.params.endpoint + "/" + req.params.id);
        console.log("Req.params: " + JSON.stringify(req.params))

        axios({
            method: req.method,
            url: url + req.params.path + '/' + req.params.id,
            headers: { 'Content-Type': 'application/json' },
            data: req.body,
            timeout: 3000
        }).then((apiResponse) => {
            const result = apiResponse.data
            res.json(result)
        }).catch(apiError => {
            if (apiError.response) {
                res
                    .status(apiError.response.status)
                    .send(apiError.response.data);
            } else if (apiError.request) {
                res
                    .status(apiError.request.status)
                    .send(apiError.request.data);
            } else if (apiError.message.includes('timeout')) {
                res
                    .status(503)
                    .send(apiError.message);
            } else if (apiError.status === null || apiError.status === undefined) {
                res
                    .status(500)
                    .send(apiError.message);
            } else {
                res
                    .status(apiError.status)
                    .send(apiError.message);
            }
        })
    } else {
        res.send("API Name doesn't exist")
    }
})


router.post('/register', (req, res) => {
    const registrationInfo = req.body
    registrationInfo.url = registrationInfo.protocol + "://" + registrationInfo.host + ":" + registrationInfo.port + "/"

    if (serviceAlreadyExists(registrationInfo)) {
        res.send("Configuration already exists for '" + registrationInfo.serviceName + "' at '" + registrationInfo.url + "'")
    } else {
        registry.services[registrationInfo.serviceName].instances.push({ ...registrationInfo })
        fs.writeFile(gatewayConfig.REGISTRY_PATH, JSON.stringify(registry), (error) => {
            if (error) {
                res.send("Could not register '" + registrationInfo.serviceName + "'\n" + error)
            } else {
                res.send("Successfully registered '" + registrationInfo.serviceName + "'")
            }
        })
    }
})

router.post('/unregister', (req, res) => {
    const registrationInfo = req.body

    if (serviceAlreadyExists(registrationInfo)) {
        const index = registry.services[registrationInfo.serviceName].instances.findIndex((instance) => {
            return registrationInfo.url === instance.url
        })
        registry.services[registrationInfo.serviceName].instances.splice(index, 1)
        fs.writeFile(gatewayConfig.REGISTRY_PATH, JSON.stringify(registry), (error) => {
            if (error) {
                res.send("Could not unregister '" + registrationInfo.serviceName + "'\n" + error);
            } else {
                res.send("Successfully unregistered '" + registrationInfo.serviceName + "'");
            }
        })
    } else {
        res.send("Configuration does not exist for '" + registrationInfo.serviceName + "' at '" + registrationInfo.url + "'");
    }
})

const serviceAlreadyExists = (registrationInfo) => {
    let serviceExists = false;
    registry.services[registrationInfo.serviceName].instances.forEach(instance => {
        if (instance.url === registrationInfo.url) {
            serviceExists = true;
            return;
        }
    })
    return serviceExists;
}

const errorMapping = (error) => {
    let errorStatus = {
        status: 500,
        data: ''
    };
    if (error.status === undefined || error.status === null) {
        errorStatus.status = 500
        errorStatus.data = 'Internal Server Error. Please try again later.'
    } else if (error.message.includes('timeout')) {
        errorStatus.status = 503
        errorStatus.data = 'Service timeout. Please try again later.'
    } else {
        errorStatus.status = error.status
        errorStatus.data = error
    }
    return errorStatus;
}

module.exports = router
