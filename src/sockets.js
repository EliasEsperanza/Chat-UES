import { registerEvents } from './services/EventServiceProvider.js';

export default (io) => {
    // Registrar los eventos
    registerEvents(io);

    io.on("connection", (socket) => {
        console.log("A user connected");

        socket.on("client:sendMessage", (data) => {
            console.log("Message received from client:", data);

            // Emitir el evento 'chat:messageSent' para guardar el mensaje en la base de datos
            io.emit("chat:messageSent", data);
        });

        // Manejar la desconexión
        socket.on("disconnect", () => {
            console.log("User disconnected");
        });
    });
};



