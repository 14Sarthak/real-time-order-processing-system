const WebSocket = require("ws");

let websocketServer;

function setupRealtime(server) {

  websocketServer = new WebSocket.Server({

    server,

    path: "/ws",

  });

  websocketServer.on("connection", (socket) => {

    console.log("Frontend connected");

    socket.send(

      JSON.stringify({

        type: "CONNECTED",

        message: "WebSocket connected",

      })

    );

  });

}

function broadcast(payload) {

  if (!websocketServer) return;

  const message = JSON.stringify(payload);

  websocketServer.clients.forEach((client) => {

    if (client.readyState === WebSocket.OPEN) {

      client.send(message);

    }

  });

}

module.exports = {

  setupRealtime,

  broadcast,

};