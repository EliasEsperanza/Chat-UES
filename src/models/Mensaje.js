import { Schema, model } from "mongoose";

const MensajeSchema = new Schema({
    chatId: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    sender: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

export const Mensaje = model("Mensaje", MensajeSchema);

