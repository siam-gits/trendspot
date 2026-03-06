import mongoose, { Schema, Document, Model } from "mongoose";

export interface IVerificationToken extends Document {
    email: string;
    otp: string;
    expires: Date;
}

const VerificationTokenSchema = new Schema<IVerificationToken>({
    email: {
        type: String,
        required: true,
        index: true,
    },
    otp: {
        type: String,
        required: true,
    },
    expires: {
        type: Date,
        required: true,
        index: { expires: "10m" }, // Automatically delete after 10 minutes
    },
});

const VerificationToken: Model<IVerificationToken> =
    mongoose.models.VerificationToken ||
    mongoose.model<IVerificationToken>("VerificationToken", VerificationTokenSchema);

export default VerificationToken;
