import { Mensaje } from "../models/Mensaje.js";

export default (io) => {
    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);

        socket.on("client:sendChatMessage", async (data) => {
            try {
                // Guardar el mensaje en la base de datos
                const newMessage = new Mensaje(data);
                await newMessage.save();

                // Emitir evento a todos los usuarios
                io.emit("server:broadcastMessage", newMessage);
                console.log("Message broadcasted:", newMessage);
            } catch (err) {
                console.error("Error processing message:", err.message);
                socket.emit("error", "Error al enviar el mensaje.");
            }
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
};
