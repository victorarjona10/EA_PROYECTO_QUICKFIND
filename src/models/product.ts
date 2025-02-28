import {ObjectId, Schema, model} from 'mongoose';

export interface IProduct {
  _id: ObjectId;
  name: string;
  rating: number;
  description: string;
  price: number;
  
}


const productSchema = new Schema<IProduct>({
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true }
  });
  
  export const ProductModel = model("Product", productSchema);