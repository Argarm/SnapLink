// lib/db.js
import mongoose from 'mongoose';

// Track connection state
let isConnected = false;
let connectionPromise = null;

// Track connection attempts and allow retry after failures
let lastConnectionAttempt = 0;
const CONNECTION_COOLDOWN = 5000; // 5 seconds cooldown between connection attempts

// Connection options with performance optimizations
const connectionOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'snaplink',
    // Add performance optimizations
    connectTimeoutMS: 5000, // 5 seconds timeout for connection
    socketTimeoutMS: 45000, // 45 seconds timeout for operations
    // Enable connection pooling
    maxPoolSize: 10,
    minPoolSize: 3,
    // Add caching for frequent queries
    bufferCommands: true,
};

const connectDB = async () => {
    // Return existing connection if already connected
    if (isConnected) {
        return Promise.resolve();
    }
    
    // Return existing connection promise if one is in progress
    if (connectionPromise) {
        return connectionPromise;
    }
    
    // Implement connection cooldown to prevent hammering the database on failures
    const now = Date.now();
    if (now - lastConnectionAttempt < CONNECTION_COOLDOWN) {
        return Promise.reject(new Error('Connection attempt too frequent'));
    }
    
    lastConnectionAttempt = now;    // Create new connection with performance optimizations
    connectionPromise = mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/snaplink', connectionOptions)
        .then(() => {
            console.log('MongoDB connected successfully');
            isConnected = true;
            
            // Set up connection monitoring for reliability
            mongoose.connection.on('error', (err) => {
                console.error('MongoDB connection error:', err);
                isConnected = false;
            });
            
            mongoose.connection.on('disconnected', () => {
                console.log('MongoDB disconnected');
                isConnected = false;
            });
        })
        .catch((error) => {
            console.error('MongoDB connection error:', error);
            isConnected = false;
            throw error;
        })
        .finally(() => {
            connectionPromise = null; // Reset after completion
        });

    return connectionPromise;
};

export default connectDB;
