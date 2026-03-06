import mongoose, { Schema, Document } from "mongoose";
import { Product } from "@/lib/api";

export interface ICartItem {
    product: Product;
    quantity: number;
}

export interface ICart extends Document {
    userEmail: string;
    items: ICartItem[];
    createdAt: Date;
    updatedAt: Date;
}

const CartSchema: Schema = new Schema(
    {
        userEmail: { type: String, required: true, index: true, unique: true },
        items: [
            {
                product: { type: Object, required: true },
                quantity: { type: Number, required: true, default: 1 },
            },
        ],
    },
    { timestamps: true }
);

export default mongoose.models.Cart || mongoose.model<ICart>("Cart", CartSchema);
