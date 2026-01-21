import mongoose, { Document, Schema, Types } from "mongoose";

export interface ProductsDocument extends Document {
  created_user: Record<string, unknown>;
  isActive: boolean;
  type: boolean;
  categories_id: Types.ObjectId | null;
  brands_id: Types.ObjectId | null;
  code?: string;
  title: string;
  description_short?: string;
  description?: string;
  seo: string;
  order: number;
  price: number;
  before_price: number;
  variants?: unknown[];
  variant_products?: unknown[];
  height?: number;
  width?: number;
  length?: number;
  qty: number;
  saleqty: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const ProductsSchema = new Schema<ProductsDocument>(
  {
    created_user: {
      required: true,
      type: Schema.Types.Mixed,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
    type: {
      type: Boolean,
      required: true,
      default: false,
    },
    categories_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categories",
      default: null,
    },
    brands_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brands",
      default: null,
    },
    code: {
      type: String,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
    description_short: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    seo: {
      type: String,
      required: true,
    },
    order: {
      required: true,
      type: Number,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    before_price: {
      type: Number,
      required: true,
      default: 0,
    },
    variants: {
      type: Array,
    },
    variant_products: {
      type: Array,
    },
    height: {
      type: Number,
    },
    width: {
      type: Number,
    },
    length: {
      type: Number,
    },
    qty: {
      type: Number,
      required: true,
      default: 0,
    },
    saleqty: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    collection: "products",
    timestamps: true,
  }
);

//line for search text
ProductsSchema.index({ title: "text", description: "text" });

const Products = mongoose.model<ProductsDocument>("Products", ProductsSchema);
export default Products;
