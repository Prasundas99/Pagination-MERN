import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config()

const dbConnection = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        })
        console.log(`MongoDB connected: ${conn.connection.host}`)
        return conn
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

export default dbConnection