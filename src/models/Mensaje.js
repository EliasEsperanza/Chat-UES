import { Schema, model } from "mongoose";

const MensajeSchema = new Schema({
    mensaje: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 500, 
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: "Usuario", 
        required: true,
    },
    canal: {
        type: String,
        required: true,
        default: "general", 
    },
}, {
    timestamps: true,
});

export const Mensaje = model("Mensaje", MensajeSchema);
