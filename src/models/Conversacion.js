import { Schema, model } from "mongoose";

const ConversacionSchema = new Schema({
    participants: [{
        type: Schema.Types.ObjectId,
        ref: "User",
    }],
    messages: [{
        type: Schema.Types.ObjectId,
        ref: "Mensaje",
        default: [],
    }],
}, {
    timestamps: true,
});

export const Conversacion = model("Conversacion", ConversacionSchema);
export default Conversacion;