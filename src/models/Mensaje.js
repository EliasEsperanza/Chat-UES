import { Schema, model } from "mongoose";

const MensajeSchema = new Schema(
    {
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
            default: "unknown",
        },
        time: {
            type: String,
            default: () => new Date().toLocaleTimeString(),
        },
    },
    {
        timestamps: true,
    }
);

export const Mensaje = model("Mensaje", MensajeSchema);
