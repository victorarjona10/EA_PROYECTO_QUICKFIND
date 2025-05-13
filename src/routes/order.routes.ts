import { Router } from 'express';
import { postPedido, getPedidoById, deletePedidoById, updatePedidoById, getPedidosByUserId, deleteProductFromOrder} from '../controllers/order.controller';
import { checkJwt } from '../middleware/session';

const router = Router();

router.post("/", checkJwt, postPedido);   
router.get('/:id', checkJwt, getPedidoById);
router.put('/:id', checkJwt, updatePedidoById);
router.delete('/:id', checkJwt, deletePedidoById);
router.get("/AllOrdersByUser/:idUser", checkJwt, getPedidosByUserId);
router.put('/:orderId/:productId', checkJwt, deleteProductFromOrder);

export default router;
