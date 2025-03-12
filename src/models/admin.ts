import { ObjectId, Schema, model } from "mongoose";

export interface IAdmin {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  phone: string;
  password2: string;
  Flag: boolean;
  //reservas--productos
}

const AdminSchema = new Schema<IAdmin>({
  name: { type: String, required: false },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: String, required: false },
  password2: { type: String, required: true },
  Flag: { type: Boolean, required: false, default: true },
  //reservas--productos
});

export const AdminModel = model("Admin", AdminSchema);
