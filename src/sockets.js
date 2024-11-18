import { registerEvents } from './services/EventServiceProvider.js';
import { verifyToken } from './services/auth.js'; // Función para verificar tokens y roles

export default (io) => {
    // Registrar los eventos
    registerEvents(io);

    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);
        socket.on("join-channel", async (channel, token) => {
            try {
                const user = await verifyToken(token);

                if (channel === "admin-channel" && user.role !== "admin") {
                    socket.emit("error", "No tienes permiso para unirte a este canal.");
                    return;
                }
                socket.join(channel);
                socket.emit("joined", `Te has unido al canal: ${channel}`);
                console.log(`Usuario ${user.name} se unió al canal ${channel}`);
            } catch (err) {
                console.error("Error al unirse al canal:", err.message);
                socket.emit("error", "Error de autenticación.");
            }
        });

        socket.on("client:sendMessage", (data) => {
            console.log("Message received from client:", data);

            io.emit("chat:messageSent", data);
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
};
