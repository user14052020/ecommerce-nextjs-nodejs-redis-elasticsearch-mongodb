import mongoose, { Document, Schema } from "mongoose";

export interface TurkeyDocument extends Document {
  Il: string;
  Ilce: unknown[];
}

const TurkeySchema = new Schema<TurkeyDocument>(
  {
    Il: { type: String, required: true, unique: true },
    Ilce: { type: Array, required: true, unique: true },
  },
  {
    collection: "turkey",
  }
);

const Turkey = mongoose.model<TurkeyDocument>("Turkey", TurkeySchema);

export default Turkey;
