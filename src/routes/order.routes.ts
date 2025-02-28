import { Router } from 'express';
import { postPedido, getPedidoById, deletePedidoById, updatePedidoById, /*getPedidoByUserId */} from '../controllers/order.controller';

const router = Router();

router.post("/", postPedido);   
router.get('/:id', getPedidoById);
router.put('/:idUser', updatePedidoById);
router.delete('/:idUser/:idPedido', deletePedidoById);

export default router;
