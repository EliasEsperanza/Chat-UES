import Mensaje from '../models/Mensaje.js';

class ChatService {
    constructor(io) {
        this.io = io;
    }

    async handleSendMessage(messageData) {
        try {
            // Crear nuevo mensaje en la base de datos
            const nuevoMensaje = new Mensaje({
                usuario: messageData.usuario, // Cambié id_emisor por usuario para coincidir con el modelo
                mensaje: messageData.mensaje
            });

            await nuevoMensaje.save();

            // Emitir mensaje a todos en el canal
            this.io.to(messageData.chatId).emit("chat:messageSent", {
                usuario: nuevoMensaje.usuario,
                mensaje: nuevoMensaje.mensaje,
                createdAt: nuevoMensaje.createdAt
            });

            return nuevoMensaje;
        } catch (error) {
            console.error('Error al guardar mensaje:', error);
            throw error;
        }
    }

    async getChatHistory(chatId, limit = 50) {
        try {
            // Obtener mensajes históricos, ordenados por fecha
            const mensajes = await Mensaje.find()
                .sort({ createdAt: -1 }) // Ordenar de más reciente a más antiguo
                .limit(limit)
                .populate('usuario', 'name'); // Opcional: popular datos del usuario

            return mensajes;
        } catch (error) {
            console.error('Error al obtener historial de mensajes:', error);
            throw error;
        }
    }
}

export default ChatService;
