import mongoose from "mongoose";

const connectDB = async() => {
    try {
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
            socketTimeoutMS: 45000, // Increase socket timeout
        };

        await mongoose.connect(process.env.MONGO_URL, options);
        console.log("MongoDB connected successfully");
    }
    catch(error) {
        console.error("MongoDB connection error:", error);
        // Implement reconnection logic
        setTimeout(connectDB, 5000);
    }
}

export default connectDB;