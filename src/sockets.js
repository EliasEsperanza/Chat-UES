import { Mensaje } from "./models/Mensaje.js";

export default (io) => {
    io.on("connection", (socket) => {
        console.log("Cliente conectado:", socket.id);

        // Enviar lista de chats al cliente
        socket.on("client:requestChats", async () => {
            const chats = await Mensaje.distinct("chatId"); // Obtener IDs únicos de chats
            const chatList = chats.map((id) => ({
                id,
                name: `Chat ${id}`, 
                role: "Usuario", 
            }));
            socket.emit("server:chatsList", chatList);
        });

        // Enviar mensajes de un chat específico
        socket.on("client:requestMessages", async ({ chatId }) => {
            try {
                const messages = await Mensaje.find({ chatId });
                socket.emit("server:chatMessages", messages);
            } catch (error) {
                console.error("Error al obtener mensajes:", error);
            }
        });

        // Guardar y emitir un nuevo mensaje
        socket.on("client:nuevoMensaje", async (data) => {
            try {
                const newMensaje = new Mensaje(data);
                const savedMensaje = await newMensaje.save();
                io.emit("server:nuevoMensaje", savedMensaje); // Enviar a todos los clientes
            } catch (error) {
                console.error("Error al guardar mensaje:", error);
            }
        });
    });
};
