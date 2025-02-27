import {ObjectId, Schema, model} from 'mongoose';

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
  //lista de productos
}


const companySchema = new Schema<ICompany>({
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    wallet: { type: Number, required: true }
  });
  
  export const CompanyModel = model("Company", companySchema);