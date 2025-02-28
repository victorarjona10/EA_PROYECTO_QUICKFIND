import { OrderModel } from '../models/order';
import { IOrder } from '../models/order';

export class PedidosService {
    async postPedido(pedido: IOrder) {
        const newPedido = new OrderModel(pedido);
        return await newPedido.save();
    }

    async getPedidosByUserId(userId: string) {
        return await OrderModel.find({ user_id: userId }).populate('usuario_id').populate('productos.producto_id').exec();
    }

    async getPedidoById(id: string) {
        return await OrderModel.findById(id).populate('usuario_id').populate('productos.producto_id').exec();
    }

    async updatePedidoById(id: string, pedido: IOrder) {
        return await OrderModel.findByIdAndUpdate(id, pedido, { new: true }).populate('usuario_id').populate('productos.producto_id').exec();
    }

    async deletePedidoById(id: string) {
        return await OrderModel.findByIdAndDelete(id).populate('usuario_id').populate('productos.producto_id').exec();
    }
}
