import mongoose, { Document, Schema, Types } from "mongoose";

type BasketProduct = {
  product_id: string;
  selectedVariants?: Record<string, unknown>;
  qty: number;
  seo: string;
};

export interface BasketDocument extends Document {
  created_user?: Record<string, unknown>;
  customer_id: Types.ObjectId | null;
  receiver_name?: string;
  receiver_email?: string;
  receiver_phone?: string;
  cargoes_id: Types.ObjectId | null;
  total_price: number;
  total_discount: number;
  cargo_price: number;
  cargo_price_discount: number;
  shipping_address?: Record<string, unknown>;
  billing_address?: Record<string, unknown>;
  products: BasketProduct[];
}

const BasketSchema = new Schema<BasketDocument>(
  {
    created_user: {
      type: Schema.Types.Mixed,
    },
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      default: null,
      unique: true,
    },
    receiver_name: {
      type: String,
    },
    receiver_email: {
      type: String,
    },
    receiver_phone: {
      type: String,
    },
    cargoes_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cargoes",
      default: null,
    },
    total_price: {
      type: Number,
      default: 0,
    },
    total_discount: {
      type: Number,
      default: 0,
    },
    cargo_price: {
      type: Number,
      default: 0,
    },
    cargo_price_discount: {
      type: Number,
      default: 0,
    },
    shipping_address: {
      type: Schema.Types.Mixed,
    },
    billing_address: {
      type: Schema.Types.Mixed,
    },

    products: [
      {
        product_id: {
          type: String,
          required: true,
        },
        selectedVariants: {
          type: Schema.Types.Mixed,
        },
        qty: {
          type: Number,
          required: true,
          default: 1,
        },
        seo: {
          type: String,
          required: true,
        },
      },
    ],
  },

  {
    collection: "basket",
    timestamps: true,
  }
);

const Basket = mongoose.model<BasketDocument>("Basket", BasketSchema);

export default Basket;
