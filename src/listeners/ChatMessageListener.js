import { ChatMessage } from '../models/ChatMessage.js';

class ChatMessageListener {
    static async handle(event) {
        try {
            const newMessage = new ChatMessage({
                userId: event.userId,
                message: event.message,
                createdAt: event.createdAt,
            });

            await newMessage.save();
            console.log("Message saved to database:", newMessage);
        } catch (error) {
            console.error("Error saving message to database:", error);
        }
    }
}

export default ChatMessageListener;


