import { Router } from 'express';
import { postPedido, getPedidoById, deletePedidoById, updatePedidoById, getPedidosByUserId, deleteProductFromOrder} from '../controllers/order.controller';

const router = Router();

router.post("/", postPedido);   
router.get('/:id', getPedidoById);
router.put('/:id', updatePedidoById);
router.delete('/:id', deletePedidoById);
router.get("/AllOrdersByUser/:idUser", getPedidosByUserId);
router.put('/:orderId/:productId',deleteProductFromOrder);

export default router;
