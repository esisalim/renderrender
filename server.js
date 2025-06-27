const express = require("express");
const httpProxy = require("http-proxy");
const app = express();

const proxy = httpProxy.createProxyServer({ changeOrigin: true });

app.use("/ghavi8.ir/", (req, res) => {
  proxy.web(req, res, {
    target: "https://farahani21.xqrnk58cmohx.workers.dev", // Cloudflare Worker or real VLESS server
    ws: true
  }, (err) => {
    console.error("Proxy error:", err);
    res.status(500).send("Proxy failed.");
  });
});

// WebSocket support
const server = app.listen(process.env.PORT || 3000, () => {
  console.log("Proxy server running on port", server.address().port);
});
server.on("upgrade", (req, socket, head) => {
  proxy.ws(req, socket, head, {
    target: "https://farahani21.xqrnk58cmohx.workers.dev",
    ws: true
  });
});
