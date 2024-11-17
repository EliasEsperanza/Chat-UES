import { registerEvents } from './services/EventServiceProvider.js';
import { connectDB } from './database/db.js';  // Asegúrate de que la conexión a la base de datos esté bien importada

export default (io) => {
    // Establecer la conexión a la base de datos
    connectDB().then(() => {
        console.log("Connected to MongoDB");

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
    }).catch((err) => {
        console.error("Error while connecting to DB:", err);
    });
};


