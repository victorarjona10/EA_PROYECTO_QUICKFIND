import express, { RequestHandler } from "express";
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

const app = express();

<<<<<<< HEAD
=======
//puerto
>>>>>>> ordersPopulate
app.set("port", process.env.PORT || 4000);
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

app.listen(app.get("port"), () => {
  console.log(`Server running on port ${app.get("port")}`);
  console.log(`Swagger running at http://localhost:${app.get("port")}/api-docs/`);
});

export default app;
