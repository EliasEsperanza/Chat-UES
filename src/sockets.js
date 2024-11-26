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
                const messages = await Mensaje.find({ chatId }); // Obtener mensajes históricos
                socket.emit("server:chatMessages", messages);
            } catch (error) {
                console.error("Error al obtener mensajes:", error);
            }
        });


        // Guardar y emitir un nuevo mensaje
        socket.on("client:nuevoMensaje", async (rawData) => {
            try {
                // Si los datos llegan como cadena, convertirlos a JSON
                const data = typeof rawData === "string" ? JSON.parse(rawData) : rawData;
                
                console.log("Datos procesados:", data);
        
                // Validar campos requeridos
                const requiredFields = ["chatId", "text", "sender", "time"];
                const missingFields = requiredFields.filter((field) => !data[field]);
        
                if (missingFields.length > 0) {
                    throw new Error(`Faltan campos requeridos: ${missingFields.join(", ")}`);
                }
        
                // Validar tipos de datos
                const { chatId, text, sender, time } = data;
                if (
                    typeof chatId !== "string" ||
                    typeof text !== "string" ||
                    typeof sender !== "string" ||
                    typeof time !== "string"
                ) {
                    throw new Error("Tipos de datos inválidos.");
                }
        
                console.log("Datos a guardar:", {
                    chatId,
                    text,
                    sender,
                    time,
                });
        
                // Guardar el mensaje en la base de datos
                const newMensaje = new Mensaje({
                    chatId,
                    text,
                    sender,
                    time,
                });
        
                const savedMensaje = await newMensaje.save();
                console.log("Mensaje guardado:", savedMensaje);
        
                // Emitir el mensaje guardado a los clientes
                socket.to(data.chatId).emit("server:nuevoMensaje", savedMensaje);
            } catch (error) {
                console.error("Error al guardar mensaje:", error.message);
            }
        });

        socket.on("client:requestUserChats", async (userId) => {
            try {
                if (!userId) {
                    throw new Error("El ID de usuario es obligatorio.");
                }

                // Obtener todos los mensajes donde el usuario esté involucrado
                const mensajes = await Mensaje.find({
                    $or: [{ sender: userId }, { receiver: userId }]
                });

                // Obtener los IDs de los chats únicos involucrados con ese usuario
                const chatIds = [...new Set(mensajes.map((mensaje) => mensaje.chatId))];

                // Obtener los detalles de los chats (nombre y rol del usuario)
                const chatList = chatIds.map((id) => ({
                    id,
                    name: `Chat ${id}`, 
                    role: "Usuario",  
                }));

                // Emitir la lista de chats encontrados
                socket.emit("server:userChatsList", chatList);
            } catch (error) {
                console.error("Error al obtener chats del usuario:", error.message);
                socket.emit("server:error", { message: error.message });
            }
        });
        
    });
};
