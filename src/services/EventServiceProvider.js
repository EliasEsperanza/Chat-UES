import { ChatMessageSent } from "../events/ChatMessageSent.js";  



export function registerEvents(io) {
    io.on("chat:messageSent", async (data) => {
        try {
            // Guardar el mensaje en la base de datos
            const newMessage = new ChatMessageSent(data);
            const savedMessage = await newMessage.save();

            console.log("Message saved to database:", savedMessage);

            // Emitir el evento para notificar a otros clientes
            io.emit("server:messageSent", savedMessage);
        } catch (error) {
            console.error("Error handling chat:messageSent event:", error);
        }
    });
}