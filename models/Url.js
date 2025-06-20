// models/Url.js
import mongoose from 'mongoose';

const urlSchema = new mongoose.Schema({
    longUrl: { type: String, required: true },
    shortCode: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
    clicks: { type: Number, default: 0 },
});

export default mongoose.models.URL || mongoose.model('URL', urlSchema);
