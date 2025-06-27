import { WebSocketServer } from 'ws';
import http from 'http';
import https from 'https';

const targetHost = "farahani21.xqrnk58cmohx.workers.dev";
const targetPath = "/ghorbunetberam.ir/";

const server = http.createServer();
const wss = new WebSocketServer({ server });

wss.on('connection', function connection(wsClient, req) {
  const reqOptions = {
    hostname: targetHost,
    port: 443,
    path: targetPath,
    method: 'GET',
    headers: {
      'Connection': 'Upgrade',
      'Upgrade': 'websocket',
      'Host': targetHost
    }
  };

  const proxyReq = https.request(reqOptions);

  proxyReq.on('upgrade', (res, socket, head) => {
    wsClient.on('message', msg => socket.write(msg));
    socket.on('data', data => wsClient.send(data));

    socket.on('close', () => wsClient.close());
    wsClient.on('close', () => socket.destroy());
  });

  proxyReq.on('error', err => {
    console.error("Proxy error:", err);
    wsClient.close();
  });

  proxyReq.end();
});

server.listen(process.env.PORT || 3000, () => {
  console.log('🟢 WebSocket proxy running...');
});
