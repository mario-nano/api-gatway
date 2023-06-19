const express = require("express");
const app = express();
const axios = require("axios");
const HOST = process.env.HOSTNAME || "localhost";
const PORT = process.env.PORT || 3031;

app.use(express.json());

app.listen(PORT, () => {
  axios({
    method: "POST",
    url: "http://localhost:3030/register",
    headers: {
      "Content-Type": "application/json"
    },
    data: {
      serviceName: "test-service",
      protocol: "http",
      host: HOST,
      port: PORT,
      enabled: true
    },
  }).then((response) => {
    console.log(response.data);
  });
  console.log("Test service started on port " + PORT);
});

app.get("/mockapi", function(req, res) {
  console.log('Mock responding ...')
  res.send("Hello From Mock API server");
});

app.get("/mocksomething", function(req, res) {
  console.log('Mock 2 responding ...')
  res.send("Hello 2 From Mock API server");
});

app.post("/testapi", function(req, res) {
  console.log('Testing responding ...')
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
