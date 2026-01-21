import mongoose, { Document, Schema, Types } from "mongoose";

export interface ProductimagesDocument extends Document {
  created_user: Record<string, unknown>;
  isActive: boolean;
  product_id: Types.ObjectId | null;
  title?: string;
  order: number;
  image: string;
}

const ProductimagesSchema = new Schema<ProductimagesDocument>(
  {
    created_user: {
      type: Schema.Types.Mixed,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      required: true,
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Products",
      default: null,
      required: true,
    },
    title: {
      type: String,
      trim: true,
    },
    order: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    collection: "productimages",
    timestamps: true,
  }
);

const Productimages = mongoose.model<ProductimagesDocument>(
  "Productimages",
  ProductimagesSchema
);

export default Productimages;
