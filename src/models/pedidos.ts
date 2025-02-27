import { ObjectId, Schema, model } from 'mongoose';

// Definición de la interfaz IPedido
export interface IPedido {
  _id: ObjectId;
  usuario_id: ObjectId;
  productos: {
    producto_id: ObjectId;
    cantidad: number;
    precio_unitario: number;
  }[];
  fecha: Date;
  estado: string;
}

// Creación del esquema del pedido
const pedidoSchema = new Schema<IPedido>({
  usuario_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  productos: [
    {
      producto_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      cantidad: { type: Number, required: true },
      precio_unitario: { type: Number, required: true }
    }
  ],
  fecha: { type: Date, default: Date.now },
  estado: { type: String, enum: ['Pendiente', 'Enviado', 'Entregado', 'Cancelado'], default: 'Pendiente' }
});

// Exportación del modelo Pedido
export const PedidoModel = model<IPedido>('Pedido', pedidoSchema);
