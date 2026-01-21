import mongoose, { Document, Schema } from "mongoose";

export interface CargoesDocument extends Document {
  created_user: Record<string, unknown>;
  title: string;
  price: number;
  before_price: number;
  link: string;
  order: number;
  image?: string;
  isActive: boolean;
}

const CargoesSchema = new Schema<CargoesDocument>(
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
    price: {
      required: true,
      type: Number,
    },
    before_price: {
      required: true,
      type: Number,
      default: 0,
    },
    link: {
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
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    collection: "cargoes",
    timestamps: true,
  }
);

const Cargoes = mongoose.model<CargoesDocument>("Cargoes", CargoesSchema);

export default Cargoes;
