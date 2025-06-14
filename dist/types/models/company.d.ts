import { ObjectId, Schema } from 'mongoose';
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
    followers: number;
    user_Followers: {
        user_id: mongoose.Types.ObjectId;
    }[];
}
export declare const CompanyModel: mongoose.Model<ICompany, {}, {}, {}, mongoose.Document<unknown, {}, ICompany, {}> & ICompany & Required<{
    _id: Schema.Types.ObjectId;
}> & {
    __v: number;
}, Schema<ICompany, mongoose.Model<ICompany, any, any, any, mongoose.Document<unknown, any, ICompany, any> & ICompany & Required<{
    _id: Schema.Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, ICompany, mongoose.Document<unknown, {}, mongoose.FlatRecord<ICompany>, {}> & mongoose.FlatRecord<ICompany> & Required<{
    _id: Schema.Types.ObjectId;
}> & {
    __v: number;
}>>;
