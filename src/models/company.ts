import {ObjectId, Schema, model} from 'mongoose';
import mongoose from 'mongoose';


export interface ICompany {
  _id: ObjectId;
  ownerId: ObjectId;
  name: string;
  rating: number;
  userRatingsTotal: number;
  description: string;
  location: string;
  email: string;
  phone: string;
  password: string;
  wallet: number;
  products: ObjectId[];
  coordenates_lat: number;
  coordenates_lng: number;
  icon: string;
  photos?: string[];
  reviews?: ObjectId[];
  pendingOrders?: ObjectId[];
  followers: number
  user_Followers: {
      user_id: mongoose.Types.ObjectId;
    }[];
}



const companySchema = new Schema<ICompany>({
  ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    userRatingsTotal: {type: Number, required: false},
    description: { type: String, required: true },
    location: { type: String, required: true },
    email: { type: String, required: true, unique: true, validate: {
      validator: function(value: string) {
        return value.includes('@');
    },
      message: 'Email must contain @'
    }}, 
    phone: { type: String, required: true },
    password: { type: String, required: true },
    wallet: { type: Number, required: false, default: 0 },
    products: [{ type: Schema.Types.ObjectId, ref: "Product" , required: false}],
    coordenates_lat: { type: Number, required: true },
    coordenates_lng: { type: Number, required: true },
    icon: {type: String, required: true},
    photos: [{type: String, required: false}],
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review", required: false }],
    pendingOrders: [{ type: Schema.Types.ObjectId, ref: "Order", required: false }],
    followers: { type: Number, required: false, default: 0 },
    user_Followers: [
        {
          user_id: {
            type: mongoose.Types.ObjectId, 
            ref: 'User', 
            required: false
          },
        },
      ],

  });
  
  export const CompanyModel = model("Company", companySchema);