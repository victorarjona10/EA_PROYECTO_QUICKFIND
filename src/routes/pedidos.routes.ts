import { Router } from 'express';
import { postPedido, getPedidoById, deletePedidoById, updatePedidoById, /*getPedidoByUserId */} from '../controllers/pedidos.controller';

const router = Router();

router.post("/", postPedido);   
//router.get('/:idUser', getPedidoByUserId);
router.get('/:id', getPedidoById);
router.put('/:idUser', updatePedidoById);
router.delete('/:idUser/:idPedido', deletePedidoById);

export default router;
