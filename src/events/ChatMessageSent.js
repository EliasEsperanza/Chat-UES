import mongoose from 'mongoose';

const ChatMessageSentSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

export const ChatMessageSent = mongoose.model('ChatMessageSent', ChatMessageSentSchema);