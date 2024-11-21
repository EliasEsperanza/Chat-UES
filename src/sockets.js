import { Mensaje } from "./models/Mensaje.js";

export default (io) => {
    io.on("connection", async (socket) => {
        const emitMensajes = async () => {
            const mensajes = await Mensaje.find();
            io.emit("server:mensajes", mensajes);
        }
        emitMensajes();

        socket.on("client:nuevoMensaje", async (data) => {
            const newMensaje = new Mensaje(data);
            const savedMensaje = await newMensaje.save();
            io.emit("server:nuevoMensaje", savedMensaje); 
        });
    });
};
