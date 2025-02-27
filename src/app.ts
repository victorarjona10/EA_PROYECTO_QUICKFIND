import express, { RequestHandler } from 'express';
import { startConnection } from './database';
import { setupSwagger } from './swagger'; 
import userRoutes from './routes/user.routes'; 
import productsRoutes from './routes/products.routes';
import companyRoutes from './routes/company.routes';
import pedidosRoutes from './routes/pedidos.routes';

const app: express.Application = express();

app.set('port', process.env.PORT || 4000);

app.use(express.json() as RequestHandler);

startConnection();

setupSwagger(app);

app.use('/api/users', userRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/pedidos', pedidosRoutes);

app.listen(app.get('port'), () => {
    console.log(`Server running on port ${app.get('port')}`);
});

export default app;