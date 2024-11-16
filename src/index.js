import app from "./app.js";
import { Server as WebsocketServer } from "socket.io";
import http from "http";
import sockets from "./sockets.js";
import { connectDB } from "./database/db.js";

connectDB().then(() => {
    console.log("Conectado a la base de datos");

    const server = http.createServer(app);
    const PORT = process.env.PORT || 3000;
   
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });

    const io = new WebsocketServer(server,{
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    sockets(io);
}).catch((err) => {
    console.error("Error al conectar a la base de datos:", err);
});