import mongoose, { Document, Schema, Types } from "mongoose";

export interface HomesliderDocument extends Document {
  created_user: Record<string, unknown>;
  categories_id: Types.ObjectId | null;
  title: string;
  description: string;
  link: string;
  order: number;
  image: string;
  isActive: boolean;
}

const HomesliderSchema = new Schema<HomesliderDocument>(
  {
    created_user: {
      required: true,
      type: Schema.Types.Mixed,
    },
    categories_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Homeslider",
      default: null,
    },
    title: {
      type: String,
      trim: true,
      default: "",
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    link: {
      type: String,
      trim: true,
      default: "",
    },
    order: {
      required: true,
      type: Number,
    },
    image: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    collection: "homeslider",
    timestamps: true,
  }
);

const Homeslider = mongoose.model<HomesliderDocument>(
  "Homeslider",
  HomesliderSchema
);

export default Homeslider;
