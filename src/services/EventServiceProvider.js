import { Mensaje } from "../models/Mensaje.js";

export function registerEvents(io) {
    io.on("chat:messageSent", async (data) => {
        try {
            const newMessage = new Mensaje(data);
            const savedMessage = await newMessage.save();

            console.log("Message saved to database:", savedMessage);

            io.emit("server:messageSent", savedMessage);
        } catch (error) {
            console.error("Error handling chat:messageSent event:", error);
        }
    });
}
