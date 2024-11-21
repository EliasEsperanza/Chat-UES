import { Schema, model } from "mongoose";

const MensajeSchema = new Schema({
    mensaje: {
        type: String,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: "id_usuario",
    }
},{
    timestamps: true
})

export const Mensaje = model("Mensaje", MensajeSchema);