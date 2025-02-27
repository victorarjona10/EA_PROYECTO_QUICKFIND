import { PedidoModel } from '../models/pedidos';
import { IPedido } from '../models/pedidos';

export class PedidosService {
    async postPedido(pedido: IPedido) {
        const newPedido = new PedidoModel(pedido);
        return await newPedido.save();
    }

    async getPedidosByUserId(userId: string) {
        return await PedidoModel.find({ usuario_id: userId }).populate('usuario_id').populate('productos.producto_id').exec();
    }

    async getPedidoById(id: string) {
        return await PedidoModel.findById(id).populate('usuario_id').populate('productos.producto_id').exec();
    }

    async updatePedidoById(id: string, pedido: IPedido) {
        return await PedidoModel.findByIdAndUpdate(id, pedido, { new: true }).populate('usuario_id').populate('productos.producto_id').exec();
    }

    async deletePedidoById(id: string) {
        return await PedidoModel.findByIdAndDelete(id).populate('usuario_id').populate('productos.producto_id').exec();
    }
}
