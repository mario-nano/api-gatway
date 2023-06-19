<div align="center">
  ![Dentsemo](https://cdn.discordapp.com/attachments/1017822557514248263/1061618183838117908/logo_sm_trans.png){:height="200" width="200"}
  <br>
</div>

# Dentsemo
Appointment management system for Dental offices booking and its management 

- [Introduction](#introduction)
- [How to use](#how-to-use)
- [License](#license)

## Introduction

API Gateway will be used to expose the services to external clients, such as web and
mobile applications. The API Gateway will handle tasks such as microservices registry, load
balancing, and request routing. It will act as a single point of entry for external clients,
allowing them to access the various services offered by the website through a unified REST
API. This will improve the security and performance of the website, as the API Gateway can
handle tasks such as authentication and rate limiting that would otherwise need to be
implemented separately by each service.

A load balancer will be used to distribute incoming traffic to the different instances of each
type of the services. This will help to ensure that the website can handle high levels of traffic
and remain available even if individual services fail. The load balancer will automatically
route traffic to healthy services and redirect traffic away from any services that are
experiencing issues.

## How to use

### Register your microservice
In order to register a microservice with an API gateway, you will need to specify certain information in a configuration file called the ".env" file in the microservice. This file typically contains environment variables that are used to configure the microservice and its dependencies. To register the microservice successfully with the API gateway, you will need to include the host name and port number on which the microservice is running, as well as the name of the service itself. This information is typically used by the API gateway to route incoming requests to the appropriate microservice and ensure that the microservice is able to handle the request. Once you have provided this information in the ".env" file, you can then register the microservice with the API gateway by making a request to the API gateway's registration endpoint.

### Unregister your microservice

During the process of stopping your Docker container gracefully, you should run the following CURL command to unregister the microservice manually. Make sure to replace the service hostname, port, and gateway hostname with the correct values for your container setup.

```curl -X POST -d '{"serviceName": "YOUR_MICROSERVICE_NAME", "url": "http://SERVICE_HOSTNAME:PORT/"}' http://API_GATEWAY_HOSTNAME:3030/unregister -H "Content-Type: application/json"```

For testing from Windows, you will need the following format for double quotes escaping:

```curl -d "{\"serviceName\": \"YOUR_MICROSERVICE_NAME\", \"url\": \"http://SERVICE_HOSTNAME:PORT/\"}" -X POST http://API_GATEWAY_HOSTNAME:3030/unregister -H "Content-Type: application/json"```


For more information about the website please click [here](https://git.chalmers.se/courses/dit355/dit356-2022/t-13/frontend)


## License
MIT © Team-13 for DIT356
The source code for the site is licensed under the MIT license, which you can find in the MIT-LICENSE.txt file.

