import mongoose, { Document, Schema } from "mongoose";

export interface BrandsDocument extends Document {
  created_user: Record<string, unknown>;
  title: string;
  order: number;
  description: string;
  seo: string;
  image?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const BrandsSchema = new Schema<BrandsDocument>(
  {
    created_user: {
      required: true,
      type: Schema.Types.Mixed,
    },

    title: {
      required: true,
      type: String,
      unique: true,
      trim: true,
    },
    order: {
      required: true,
      type: Number,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    seo: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    collection: "brands",
    timestamps: true,
  }
);

const Brands = mongoose.model<BrandsDocument>("Brands", BrandsSchema);
export default Brands;
