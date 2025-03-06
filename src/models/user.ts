import {ObjectId, Schema, model} from 'mongoose';

export interface IUser {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  phone: string;
  wallet: number;
  Flag: boolean;
  //reservas--productos 
}

const userSchema = new Schema<IUser>({
  name: {type: String, required: false},
  email: {type: String, required: true},
  password: {type: String, required: true},
  phone: {type: String, required: false},
  wallet: {type: Number, required: false, default: 0},
  Flag: {type: Boolean, required: false, default: true}
  //reservas--productos
});

export const UserModel = model("User", userSchema);