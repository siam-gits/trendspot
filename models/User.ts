import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    image?: string;
    favorites: string[];
    resetToken?: string;
    resetTokenExpiry?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
        },
        image: {
            type: String,
        },
        favorites: {
            type: [String],
            default: [],
        },
        resetToken: {
            type: String,
        },
        resetTokenExpiry: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

// Handle model compilation errors in development due to HMR
if (mongoose.models.User) {
    delete mongoose.models.User;
}

const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);

export default User;
