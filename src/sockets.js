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
            console.log("Datos recibidos:", data); // Imprime los datos recibidos desde el cliente
        
            try {
                // Validar campos requeridos
                const { chatId, text, sender, time } = data;
                if (!chatId || !text || !sender || !time) {
                    throw new Error("Faltan campos requeridos.");
                }
        
                // Validar tipos de datos
                if (
                    typeof chatId !== "string" ||
                    typeof text !== "string" ||
                    typeof sender !== "string" ||
                    typeof time !== "string"
                ) {
                    throw new Error("Tipos de datos inválidos.");
                }
        
                // Imprimir detalles de los datos antes de crear el modelo
                console.log("Datos a guardar:", {
                    chatId,
                    text,
                    sender,
                    time,
                });
        
                // Crear un nuevo mensaje
                const newMensaje = new Mensaje({
                    chatId,
                    text,
                    sender,
                    time,
                });
        
                // Guardar mensaje en la base de datos
                const savedMensaje = await newMensaje.save();
                console.log("Mensaje guardado:", savedMensaje);
        
                // Emitir mensaje a los clientes conectados
                io.emit("server:nuevoMensaje", savedMensaje);
            } catch (error) {
                console.error("Error al guardar mensaje:", error.message);
            }
        });
        
        
        
    });
};
