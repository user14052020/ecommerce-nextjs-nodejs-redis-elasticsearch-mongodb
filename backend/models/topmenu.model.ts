import mongoose, { Document, Schema, Types } from "mongoose";

export interface TopmenuDocument extends Document {
  created_user: Record<string, unknown>;
  categories_id: Types.ObjectId | null;
  order: number;
  title: string;
  description: string;
  description_short: string;
  seo: string;
  isActive: boolean;
  link: string;
}

const TopmenuSchema = new Schema<TopmenuDocument>(
  {
    created_user: {
      required: true,
      type: Schema.Types.Mixed,
    },
    categories_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topmenu",
      default: null,
    },
    order: {
      required: true,
      type: Number,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    description_short: {
      type: String,
      trim: true,
      default: "",
    },
    seo: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
    link: {
      type: String,
      default: "",
    },
  },
  {
    collection: "topmenu",
    timestamps: true,
  }
);
const Topmenu = mongoose.model<TopmenuDocument>("Topmenu", TopmenuSchema);

export default Topmenu;
