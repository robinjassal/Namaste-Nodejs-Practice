const http = require("http");

const server = http.createServer(function (req, res) {
  if (req.url === "/api") {
    res.end("you will get api here");
  } else res.end("Hello User");
});

server.listen(4000);
