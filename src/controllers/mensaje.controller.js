import Mensaje from "../models/Mensaje.js";
import Conversacion from "../models/Conversacion.js";

export const sendMenssage = async (req, res) => {
    try {
        const { id: receiverId } = req.params;
        const { message } = req.body;
        const senderId = req.user.id;

        let conversation = await Conversacion.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        if (!conversation) {
            conversation = await Conversacion.create({
                participants: [senderId, receiverId],
            });
        }

        const newMessage = await Mensaje.create({
            senderId,
            receiverId,
            message,
        });

        if(newMessage) {
            conversation.messages.push(newMessage._id);
        }

        //await conversation.save();
        //await newMessage.save();

        await Promise.all([conversation.save(), newMessage.save()]);

        return res.status(201).json(newMessage);
    } catch (error) {
        return res.status(500).json({ message: "Error al enviar mensaje" });
    }
}

export const getMenssage = async (req, res) => {
    try {
        const { id:userToChatId } = req.params;
        const senderId = req.user.id;

        const conversation = await Conversacion.findOne({
            participants: { $all: [senderId, userToChatId] },
        }).populate("messages");

        if (!conversation) {
            return res.status(404).json({ message: "Conversación no encontrada" });
        }

        const messages = conversation.messages;

        return res.status(200).json(messages);
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener mensajes" });
    
    }

}