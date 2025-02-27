import {ObjectId, Schema, model} from 'mongoose';

export interface IUser {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  phone: string;
  wallet: number;
  //reservas--productos 
}

const userSchema = new Schema<IUser>({
  name: {type: String, required: true},
  email: {type: String, required: true},
  password: {type: String, required: true},
  phone: {type: String, required: true},
  wallet: {type: Number, required: true}
  //reservas--productos
});

export const UserModel = model("User", userSchema);