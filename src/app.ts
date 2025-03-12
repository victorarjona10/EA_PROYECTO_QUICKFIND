import express, { RequestHandler } from "express";
import cors from "cors";
import { startConnection } from "./database";
import { setupSwagger } from "./swagger";
import userRoutes from "./routes/user.routes";
import productsRoutes from "./routes/product.routes";
import companyRoutes from "./routes/company.routes";
import pedidosRoutes from "./routes/order.routes";
import adminRoutes from "./routes/admin.routes";

const app = express();

app.set("port", process.env.PORT || 4000);
app.use(cors()); // Permet totes les peticions
app.use(express.json());

app.use(express.json() as RequestHandler);

startConnection();

setupSwagger(app);

app.use("/api/users", userRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/orders", pedidosRoutes);
app.use("/api/admins", adminRoutes);

app.listen(app.get("port"), () => {
  console.log(`Server running on port ${app.get("port")}`);
});

export default app;
