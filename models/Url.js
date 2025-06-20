// models/Url.js
import mongoose from 'mongoose';

const urlSchema = new mongoose.Schema({
    longUrl: { 
        type: String, 
        required: true 
    },
    shortCode: { 
        type: String, 
        required: true, 
        unique: true,
        index: true // Add index for faster lookups
    },
    createdAt: { 
        type: Date, 
        default: Date.now,
        index: true, // Index for faster sorting
        expires: 60*60*24*90 // URLs expire after 90 days automatically (TTL index)
    },
    clicks: { 
        type: Number, 
        default: 0 
    }
}, {
    timestamps: false, // Don't need both createdAt and timestamps
    // Enable fast and lean queries
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Create compound index for even faster lookups
urlSchema.index({ shortCode: 1, createdAt: 1 });

// Add pre-fetch hook for more efficient query construction
urlSchema.statics.findByShortCode = function(shortCode) {
    return this.findOne({ shortCode }).lean().exec();
};

// Add batch operation method for better performance when needed
urlSchema.statics.findRecentUrls = function(limit = 10) {
    return this.find({})
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean()
        .exec();
};

// Create the model once using mongoose.models cache to avoid recompilation
export default mongoose.models.URL || mongoose.model('URL', urlSchema);
