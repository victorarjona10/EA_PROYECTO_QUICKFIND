import { Router } from 'express';
<<<<<<< HEAD
import { postPedido, getPedidoById, deletePedidoById, updatePedidoById, /*getPedidoByUserId */} from '../controllers/order.controller';
=======
import { postPedido, getPedidoById, deletePedidoById, updatePedidoById, getPedidosByUserId} from '../controllers/order.controller';
>>>>>>> ordersPopulate

const router = Router();

router.post("/", postPedido);   
router.get('/:id', getPedidoById);
router.put('/:idUser', updatePedidoById);
router.delete('/:idUser/:idPedido', deletePedidoById);
<<<<<<< HEAD
=======
router.get("/AllOrdersByUser/:idUser", getPedidosByUserId);
>>>>>>> ordersPopulate

export default router;
