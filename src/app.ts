import express, { RequestHandler, Request, Response } from "express";
import { startConnection } from "./database";
import { setupSwagger } from "./swagger";
import userRoutes from "./routes/user.routes";
import productsRoutes from "./routes/product.routes";
import companyRoutes from "./routes/company.routes";
import pedidosRoutes from "./routes/order.routes";
import adminRoutes from "./routes/admin.routes";
import { corsHandler } from "./middleware/corsHandler";
import { loggingHandler } from "./middleware/loggingHandler";
import { routeNotFound } from "./middleware/routeNotFound";
import { Result } from "express-validator";
import axios from "axios";


// Removed duplicate import of express
const app = express();
// Removed duplicate import of axios
const PORT = process.env.PORT || 4000;

app.set("port", PORT);
app.use(corsHandler); //Middleware para gestionar las peticiones permitidas
app.use(loggingHandler); //Middleware para registrar las peticiones por consola
app.use(express.json());//Middleware para convertir JSON a objetos de JS a traves de req.body

app.use(express.json() as RequestHandler);

startConnection();

setupSwagger(app);

app.use("/api/users", userRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/orders", pedidosRoutes);
app.use("/api/admins", adminRoutes);

app.use(routeNotFound);//Middleware para informar de una ruta inexistente fuera de /users , /products ,etc.

app.listen(PORT, () => {
  console.log(`Server running at  http://localhost:${PORT}`);
  console.log(`Swagger running at http://localhost:${PORT}/api-docs/`);
});

export default app;
