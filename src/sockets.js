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
            console.log("Datos recibidos:", data); // Log para inspeccionar los datos recibidos
        
            try {
                // Validación de los datos
                if (typeof data !== "object" || !data.chatId || !data.text) {
                    throw new Error("Datos de mensaje inválidos.");
                }
        
                // Creación del mensaje
                const newMensaje = new Mensaje({
                    chatId: data.chatId,
                    text: data.text,
                    sender: data.sender || "unknown",
                    time: data.time || new Date().toLocaleTimeString(),
                });
        
                // Guardar en la base de datos
                const savedMensaje = await newMensaje.save();
                io.emit("server:nuevoMensaje", savedMensaje);
            } catch (error) {
                console.error("Error al guardar mensaje:", error.message);
            }
        });
        
    });
};
