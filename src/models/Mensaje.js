import { Schema, model } from "mongoose";

const MensajeSchema = new Schema({
    senderId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

export const Mensaje = model("Mensaje", MensajeSchema);

export default Mensaje;

