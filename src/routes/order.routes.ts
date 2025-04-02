import { Router } from 'express';
import { postPedido, getPedidoById, deletePedidoById, updatePedidoById, getPedidosByUserId} from '../controllers/order.controller';

const router = Router();

router.post("/", postPedido);   
router.get('/:id', getPedidoById);
router.put('/:id', updatePedidoById);
router.delete('/:idUser/:idPedido', deletePedidoById);
router.get("/AllOrdersByUser/:idUser", getPedidosByUserId);

export default router;
