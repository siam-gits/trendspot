import mongoose, { Schema, Document } from "mongoose";

export interface IOrderItem {
    productId: number;
    title: string;
    price: number;
    quantity: number;
    thumbnail: string;
}

export interface IOrder extends Document {
    userEmail: string;
    items: IOrderItem[];
    totalAmount: number;
    status: "pending" | "paid" | "shipped" | "cancelled";
    stripeSessionId?: string;
    createdAt: Date;
    updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
    {
        userEmail: { type: String, required: true, index: true },
        items: [
            {
                productId: { type: Number, required: true },
                title: { type: String, required: true },
                price: { type: Number, required: true },
                quantity: { type: Number, required: true },
                thumbnail: { type: String, required: true },
            },
        ],
        totalAmount: { type: Number, required: true },
        status: {
            type: String,
            enum: ["pending", "paid", "shipped", "cancelled"],
            default: "pending",
        },
        stripeSessionId: { type: String, index: true },
    },
    { timestamps: true }
);

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
