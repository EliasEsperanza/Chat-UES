import { Mensaje } from "../models/Mensaje.js";

class ChatMessageListener {
    static async handle(event) {
        try {
            const newMessage = new Mensaje({
                usuario: event.userId,
                mensaje: event.message,
                canal: event.channel || "general",
            });

            await newMessage.save();
            console.log("Message saved to database:", newMessage);
        } catch (error) {
            console.error("Error saving message to database:", error);
        }
    }
}

export default ChatMessageListener;