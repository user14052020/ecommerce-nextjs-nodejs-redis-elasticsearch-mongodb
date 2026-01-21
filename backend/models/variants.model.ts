import mongoose, { Document, Schema } from "mongoose";

export interface VariantsDocument extends Document {
  created_user: Record<string, unknown>;
  name: string;
  description?: string;
  variants: unknown[];
}

const VariantsSchema = new Schema<VariantsDocument>(
  {
    created_user: {
      required: true,
      type: Schema.Types.Mixed,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
    variants: {
      type: Array,
      required: true,
    },
  },
  {
    collection: "variants",
    timestamps: true,
  }
);

const Variants = mongoose.model<VariantsDocument>("Variants", VariantsSchema);

export default Variants;
