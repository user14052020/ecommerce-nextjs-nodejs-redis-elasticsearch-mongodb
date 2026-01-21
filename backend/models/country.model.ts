import mongoose, { Document, Schema } from "mongoose";

type CountryState = {
  code?: string;
  name?: string;
  subdivision?: string;
};

export interface CountryDocument extends Document {
  code2: string;
  code3: string;
  name?: string;
  capital?: string;
  region?: string;
  subregion?: string;
  states: CountryState[];
}

const CountrySchema = new Schema<CountryDocument>(
  {
    code2: {
      type: String,
      required: true,
      unique: true,
    },
    code3: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
    },
    capital: {
      type: String,
    },
    region: {
      type: String,
    },
    subregion: {
      type: String,
    },
    states: [
      {
        code: {
          type: String,
        },
        name: {
          type: String,
        },
        subdivision: {
          type: String,
        },
      },
    ],
  },
  {
    collection: "country",
    timestamps: true,
  }
);

const Country = mongoose.model<CountryDocument>("country", CountrySchema);

export default Country;
