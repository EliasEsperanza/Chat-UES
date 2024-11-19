import { registerEvents } from './services/EventServiceProvider.js';
import { verifyToken } from './services/auth.js';
import ChatService from './services/chatService.js'; // Importamos el servicio de chat

export default (io) => {
    // Crear una instancia del servicio de chat
    const chatService = new ChatService(io);

    // Registrar los eventos
    registerEvents(io);

    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);

        // Evento para unirse a un canal con autenticación
        socket.on("join-channel", async (channel, token) => {
            try {
                const user = await verifyToken(token);

                if (channel === "admin-channel" && user.role !== "admin") {
                    socket.emit("error", "No tienes permiso para unirte a este canal.");
                    return;
                }

                // Asociar el usuario al socket para uso posterior
                socket.user = user;

                socket.join(channel);
                socket.emit("joined", `Te has unido al canal: ${channel}`);
                console.log(`Usuario ${user.name} se unió al canal ${channel}`);
            } catch (err) {
                console.error("Error al unirse al canal:", err.message);
                socket.emit("error", "Error de autenticación.");
            }
        });

        // Evento para enviar mensaje utilizando el servicio de chat
        socket.on("client:sendMessage", async (data) => {
            try {
                // Verificar que el usuario esté autenticado
                if (!socket.user) {
                    socket.emit("error", "Debes estar autenticado para enviar mensajes");
                    return;
                }

                // Preparar datos del mensaje
                const mensajeData = {
                    id_emisor: socket.user._id, // ID del usuario que envía
                    mensaje: data.mensaje,
                    chatId: data.channel || 'default-channel' // Canal o canal por defecto
                };

                // Usar el método del servicio de chat para manejar el mensaje
                await chatService.handleSendMessage(mensajeData);

                console.log("Message received from client:", data);
            } catch (error) {
                console.error("Error al enviar mensaje:", error);
                socket.emit("error", "No se pudo enviar el mensaje");
            }
        });

        // Evento para obtener historial de mensajes
        socket.on("client:getChatHistory", async (channel) => {
            try {
                // Verificar que el usuario esté autenticado
                if (!socket.user) {
                    socket.emit("error", "Debes estar autenticado para ver el historial");
                    return;
                }

                // Obtener historial de mensajes del servicio de chat
                const historial = await chatService.getChatHistory(channel);
                
                socket.emit("chat:historyLoaded", historial);
            } catch (error) {
                console.error("Error al cargar historial:", error);
                socket.emit("error", "No se pudo cargar el historial de mensajes");
            }
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
};