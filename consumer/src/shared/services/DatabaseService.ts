
import mongoose from "mongoose";

export async function connectDatabase(connectionString: string) {
    await mongoose.connect(connectionString);
}

export async function disconnectDatabase() {
    await mongoose.disconnect();
}
