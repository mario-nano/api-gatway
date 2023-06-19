const express = require("express");
const app = express();
const rabbitMQ = require('./rabbitmq');
const axios = require("axios");
const HOST = process.env.HOSTNAME || "mockapi.e-nomads.com";
const PORT = process.env.PORT || 8100;

app.use(express.json());

// InitConnection of rabbitmq
const queue = 'APPOINTMENT';
let rabbitMsg = undefined;

function fnConsumer(msg, callback) {
  rabbitMsg = msg.content.toString();
  console.log("Received message: ", msg.content.toString());
  // we tell rabbitmq that the message was processed successfully
  callback(true);
}

rabbitMQ.InitConnection(() => {
    console.log('Connection to RabbitMQ broker was successful.');

    // start consumer worker when the connection to rabbitmq has been made
    rabbitMQ.StartConsumer(queue, fnConsumer);
    // start Publisher when the connection to rabbitmq has been made
    rabbitMQ.StartPublisher();
});

app.listen(PORT, () => {
  axios({
    method: "POST",
    url: "http://gateway.e-nomads.com:3030/register",
    headers: {
      "Content-Type": "application/json"
    },
    data: {
      serviceName: "mockapi-service",
      protocol: "http",
      host: HOST,
      port: PORT,
      enabled: true
    },
  }).then((response) => {
    console.log(response.data);
  });
  console.log("Mock server started on port " + PORT);
});

app.get("/mockapi", function(req, res) {
  console.log('Mock responding ...')
  res.send("Hello From Mock API server");
});

app.get("/mocksomething", function(req, res) {
  console.log('Mock 2 responding ...')

  if (rabbitMsg !== undefined) {
    res.send("Message From Mock API server: " + rabbitMsg);
    rabbitMsg = undefined;
  } else {
    res.send("No message on Mock API server");
  }

  res.send("Hello 2 From Mock API server");
});

app.post("/testapi", function(req, res) {
  console.log('Params: ' + JSON.stringify(req.params))
  console.log('Test msg: ' + req.body.data.message)
  rabbitMQ.PublishMessage(queue, "", req.body.data.message);
  res.send("Test API says hello!");
});

app.put("/update", function(req, res) {
  console.log('Mock updating ...')
  res.send("Update From Mock API server");
});

app.delete("/delete", function(req, res) {
  console.log('Mock deleting ...')
  console.log('Headers: ' + req.headers["user-agent"])
  res.send("Deleted From Mock API server");
});
