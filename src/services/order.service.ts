import { OrderModel } from '../models/order';
import { IOrder } from '../models/order';

export class PedidosService {
    async postPedido(pedido: IOrder) {
        const newPedido = new OrderModel(pedido);
        return await newPedido.save();
    }

    async getPedidosByUserId(userId: string) {
        return await OrderModel.find({ user_id: userId }).populate('user_id').populate('products.product_id').exec();
    }

    async getPedidoById(id: string) {
        return await OrderModel.findById(id).populate('user_id').populate('products.product_id').exec();
    }

    // async updatePedidoById(id: string, pedido: IOrder) {
    //     return await OrderModel.findByIdAndUpdate(id, pedido, { new: true }).populate('user_id').populate('products.product_id').exec();
    // }


    // async updatePedidoById(id: string, updateData: Partial<IOrder>){
    //     try{
    //         return await OrderModel.updateOne({_id: id}, {$set: updateData});
    //     }catch(error:any){
    //         console.log(error);
    //         throw error;        
    //     }
    // }

    async updatePedidoById(id: string, updateData: Partial<IOrder>) {
        try {
            if (updateData.products && Array.isArray(updateData.products)) {
                const updates = updateData.products.map(product => ({
                    updateOne: {
                        filter: { _id: id, "products.product_id": product.product_id },
                        update: { $set: { "products.$.quantity": product.quantity } },
                    }
                }));
    
                await OrderModel.bulkWrite(updates);//por si queremos actualizar multiples cosas del vector de products se usa blikWrite
            }
    
            // Actualiza otros campos fuera del array de productos
            const { products, ...otherFields } = updateData; 
            if (Object.keys(otherFields).length > 0) {
                return await OrderModel.updateOne({ _id: id }, { $set: otherFields });
            }
    
            return { message: "Update successful" };
        } catch (error: any) {
            console.log(error);
            throw error;
        }
    }


    async deletePedidoById(id: string) {
        return await OrderModel.findByIdAndDelete(id).populate('user_id').populate('products.product_id').exec();
    }

   
}
