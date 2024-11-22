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
            console.log("Datos recibidos:", data);
        
            try {
                // Validar que los datos recibidos son correctos
                if (typeof data !== "object" || !data.chatId || !data.text || !data.sender || !data.time) {
                    throw new Error("Datos de mensaje inválidos.");
                }
        
                // Crear un nuevo mensaje basado en los datos
                const newMensaje = new Mensaje({
                    chatId: data.chatId,
                    text: data.text,
                    sender: data.sender,
                    time: data.time,
                });
        
                // Intentar guardar el mensaje en la base de datos
                const savedMensaje = await newMensaje.save();
                console.log("Mensaje guardado:", savedMensaje);
        
                // Emitir el mensaje a los clientes conectados
                io.emit("server:nuevoMensaje", savedMensaje);
            } catch (error) {
                console.error("Error al guardar mensaje:", error.message);
            }
        });
        
        
    });
};
