import { IOrder } from '../models/order';
export declare class PedidosService {
    postPedido(pedido: IOrder): Promise<import("mongoose").Document<unknown, {}, IOrder, {}> & IOrder & Required<{
        _id: import("mongoose").Schema.Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getPedidosByUserId(userId: string): Promise<(import("mongoose").Document<unknown, {}, IOrder, {}> & IOrder & Required<{
        _id: import("mongoose").Schema.Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getPedidoById(id: string): Promise<(import("mongoose").Document<unknown, {}, IOrder, {}> & IOrder & Required<{
        _id: import("mongoose").Schema.Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    updatePedidoById(id: string, updateData: Partial<IOrder>): Promise<import("mongoose").UpdateWriteOpResult | {
        message: string;
    } | undefined>;
    updateOrderStatus(id: string, status: string): Promise<(import("mongoose").Document<unknown, {}, IOrder, {}> & IOrder & Required<{
        _id: import("mongoose").Schema.Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    deletePedidoById(id: string): Promise<(import("mongoose").Document<unknown, {}, IOrder, {}> & IOrder & Required<{
        _id: import("mongoose").Schema.Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    deleteProductFromOrder(orderId: string, productId: string): Promise<any>;
    getAllCompanyOrders(companyId: string): Promise<(import("mongoose").Document<unknown, {}, IOrder, {}> & IOrder & Required<{
        _id: import("mongoose").Schema.Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
}
