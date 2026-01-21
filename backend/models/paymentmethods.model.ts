import mongoose, { Document, Schema } from "mongoose";

export interface PaymentmethodsDocument extends Document {
  created_user: Record<string, unknown>;
  title: string;
  contract?: string;
  isActive: boolean;
  order: number;
  public_key?: string;
  secret_key?: string;
  api?: unknown[];
}

const PaymentmethodsSchema = new Schema<PaymentmethodsDocument>(
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
    contract: {
      type: String,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
    order: {
      required: true,
      type: Number,
    },
    public_key: {
      type: String,
    },
    secret_key: {
      type: String,
    },
    api: {
      type: Array,
    },
  },
  {
    collection: "paymentmethods",
    timestamps: true,
  }
);

const Paymentmethods = mongoose.model<PaymentmethodsDocument>(
  "Paymentmethods",
  PaymentmethodsSchema
);

export default Paymentmethods;
