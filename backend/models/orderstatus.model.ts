import mongoose, { Document, Schema } from "mongoose";

export interface OrderstatusDocument extends Document {
  created_user: Record<string, unknown>;
  title: string;
  order: number;
  image?: string;
}

const OrderstatusSchema = new Schema<OrderstatusDocument>(
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
    image: {
      type: String,
    },
  },
  {
    collection: "orderstatus",
    timestamps: true,
  }
);

const Orderstatus = mongoose.model<OrderstatusDocument>(
  "Orderstatus",
  OrderstatusSchema
);

export default Orderstatus;
