import express, { RequestHandler, Request, Response } from "express";
import path from "path";
import { startConnection } from "./database";
import { setupSwagger } from "./swagger";
import userRoutes from "./routes/user.routes";
import productsRoutes from "./routes/product.routes";
import companyRoutes from "./routes/company.routes";
import pedidosRoutes from "./routes/order.routes";
import adminRoutes from "./routes/admin.routes";
import chatRoutes from "./routes/chat.routes";
import { corsHandler } from "./middleware/corsHandler";
import cors from "cors";
import { loggingHandler } from "./middleware/loggingHandler";
import { routeNotFound } from "./middleware/routeNotFound";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import session from "express-session";
import { UserService } from "./services/user.service";
import dotenv from "dotenv";
import notificationRoutes from "./routes/notification.routes";
import { notificationService } from "./services/notification.service";
import http from "http";
import { initializeSocketIO, initializeChatService } from "./socket";
import feedbackRoutes from "./routes/feedback.routes";

dotenv.config({ path: "../.env" });
// Removed duplicate import of express
const app = express();
const server = http.createServer(app);

// Inicializamos Socket.IO en el servidor
const io = initializeSocketIO(server);
initializeChatService();
notificationService.initializeListeners();
export { io };
app.use("/public", express.static(path.join(__dirname, "../public")));

console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
console.log("GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET);
console.log("GOOGLE_REDIRECT_URI:", process.env.GOOGLE_REDIRECT_URI);
// Removed duplicate import of axios
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 40000;
const HOST_IP = process.env.HOST_IP || "0.0.0.0";
const ANGULAR_DOMAIN = process.env.ANGULAR_DOMAIN || "localhost";
const REACT_DOMAIN = process.env.REACT_DOMAIN || "localhost";
// ================= Google OAuth 配置 =================
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || "";

// ================= Passport & Session 配置 =================
app.use(
  session({
    secret: "your_random_session_secret_here", // 可以随便写一个随机字符串
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.disable("etag");

// Google OAuth 策略
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_REDIRECT_URI,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const userService = new UserService();
        const user = await userService.findOrCreateUserFromGoogle(profile);

        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

// 序列化用户（用于 session）
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// 反序列化用户
passport.deserializeUser(async (id: string, done) => {
  try {
    const userService = new UserService();
    const user = await userService.getUserById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

app.set("port", PORT);
app.use(corsHandler); //Middleware para gestionar las peticiones permitidas
app.use(loggingHandler); //Middleware para registrar las peticiones por consola
app.use(express.json()); //Middleware para convertir JSON a objetos de JS a traves de req.body

app.use(express.json() as RequestHandler);

startConnection();

setupSwagger(app);

app.use("/api/users", userRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/orders", pedidosRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/feedback", feedbackRoutes);
// ================= Google Test登录回调测试路由 =================
app.get("/api/auth/google/callback/test", (req: Request, res: Response) => {
  res.send("Google OAuth Succcess! 回调成功！请检查控制台日志。");
});

app.use(
  cors({
    origin: [
      `https://${ANGULAR_DOMAIN}:*`,
      `https://${REACT_DOMAIN}:*`,
      `https://147.83.7.208:80`,
      `https://ea6.upc.edu`,
    ], //quitar puertos y acerptar dominiso *
    credentials: true,
  })
);
app.use(routeNotFound); //Middleware para informar de una ruta inexistente fuera de /users , /products ,etc.

server.listen(PORT, HOST_IP, () => {
  console.log(`Server running at http://${HOST_IP}:${PORT}`);
  console.log(`Swagger running at http://${HOST_IP}:${PORT}/api-docs/`);
  console.log(`Socket.IO server running`);
});

export default app;
