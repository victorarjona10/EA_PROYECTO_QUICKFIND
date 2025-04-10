import { ObjectId, Schema, model } from "mongoose";

export interface ICompany {
  _id: ObjectId;
  name: string;
  rating: number;
  description: string;
  location: string;
  email: string;
  phone: string;
  password: string;
  wallet: number;
  coordenates_lat?: number;
  coordenates_lng?: number;
  products: ObjectId[];
}

const companySchema = new Schema<ICompany>({
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (value: string) {
        return value.includes("@");
      },
      message: "Email must contain @",
    },
  },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  wallet: { type: Number, required: false, default: 0 },
  products: [{ type: Schema.Types.ObjectId, ref: "Product", required: false }],
  coordenates_lat: { type: Number, required: false },
  coordenates_lng: { type: Number, required: false },
});

export const CompanyModel = model("Company", companySchema);
