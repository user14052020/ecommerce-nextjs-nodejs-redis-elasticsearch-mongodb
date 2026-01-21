import mongoose, { Document, Schema, Types } from "mongoose";

export interface CategoriesDocument extends Document {
  created_user: Record<string, unknown>;
  categories_id: Types.ObjectId | null;
  order: number;
  title: string;
  description: string;
  seo: string;
  isActive: boolean;
  link: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const CategoriesSchema = new Schema<CategoriesDocument>(
  {
    created_user: {
      required: true,
      type: Schema.Types.Mixed,
    },
    categories_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categories",
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
    collection: "categories",
    timestamps: true,
  }
);

const Categories = mongoose.model<CategoriesDocument>(
  "Categories",
  CategoriesSchema
);

export default Categories;
