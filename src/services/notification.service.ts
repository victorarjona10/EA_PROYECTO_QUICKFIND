import { getIO } from "../socket";
import { IOrder } from "../models/order";
import { UserService } from "./user.service";
import { CompanyService } from "./company.service";
import { NotificationModel } from "../models/notification";
import mongoose from "mongoose";
import { UserModel } from "../models/user";

export class NotificationService {
  private userService = new UserService();
  private companyService = new CompanyService();

  // Mapa para rastrear conexiones de socket por userId
  private userSockets = new Map<string, string[]>();
  // Variable para controlar si ya se configuraron los listeners
  private listenersInitialized = false;
  public initializeListeners() {
    if (!this.listenersInitialized) {
      this.setupSocketListeners();
      this.listenersInitialized = true;
    }
  }
  private setupSocketListeners() {
    try {
      const io = getIO();
      io.on("connection", (socket) => {


        // Cuando un usuario se identifica
        socket.on("authenticate", async (userId: string) => {


          // Almacenamos la conexión de socket para este usuario
          if (!this.userSockets.has(userId)) {
            this.userSockets.set(userId, []);
          }
          this.userSockets.get(userId)?.push(socket.id);

          // Informamos al cliente que la autenticación fue exitosa
          socket.emit("authenticated", { success: true });

          // Enviamos notificaciones pendientes (no leídas) al usuario
          await this.sendPendingNotifications(userId, socket.id);
        });

        // Cuando un usuario se desconecta
        socket.on("disconnect", () => {


          // Eliminamos este socket de userSockets
          this.userSockets.forEach((socketIds, userId) => {
            const updatedSocketIds = socketIds.filter((id) => id !== socket.id);
            if (updatedSocketIds.length === 0) {
              this.userSockets.delete(userId);
            } else {
              this.userSockets.set(userId, updatedSocketIds);
            }
          });
        });
      });

    } catch (error) {
      console.error("Failed to initialize socket listeners:", error);
    }
  }

  // Método para enviar notificaciones pendientes al usuario cuando se conecta
  private async sendPendingNotifications(userId: string, socketId: string) {
    try {
      // Buscar notificaciones no leídas del usuario
      const notifications = await NotificationModel.find({
        recipient_id: new mongoose.Types.ObjectId(userId),
        read: false,
      })
        .sort({ created_at: -1 })
        .limit(10);

      if (notifications.length > 0) {

        // Enviar cada notificación al socket del usuario
        for (const notification of notifications) {
          const io = getIO();
          io.to(socketId).emit("notification", {
            id: notification._id.toString(),
            type: notification.type,
            message: notification.message,
            created_at: notification.created_at,
            read: notification.read,
          });
        }
      }
    } catch (error) {
      console.error("Error sending pending notifications:", error);
    }
  }

  // Método para enviar notificación de nuevo pedido
  async sendNotification(
    order: IOrder,
    type: "new_order" | "order_status_update",
    newStatus?: string
  ) {
    try {
      // Obtenemos la empresa
      const company = await this.companyService.getCompanyById(
        order.company_id.toString()
      );
      if (!company) {
        console.error("Company not found for notification");
        return;
      }

      // Obtenemos el usuario que realizó el pedido
      const user = await UserModel.findById(order.user_id).lean();

      if (!user) {
        console.error("User not found for notification");
        return;
      }

      // Obtenemos el propietario de la empresa
      const ownerId = company.ownerId.toString();
      const userIdStr = user._id.toString();



      let message: string;
      let senderId: string;
      let recipientId: string;
      // Diferencia entre notificación nueva y actualización
      if (type === "new_order") {
        recipientId = ownerId; // El dueño de la empresa recibe
        senderId = userIdStr; // El usuario envía
        // Notificación de nuevo pedido: del usuario a la empresa
        message = `Nuevo pedido de ${user.name} para ${company.name}`;
      } else {
        // Notificación de cambio de estado: de la empresa al usuario
        recipientId = userIdStr; // El dueño de la empresa recibe
        senderId = ownerId; // El usuario envía
        if (newStatus === "Procesado") {
          message = `Tu pedido en ${company.name} ha sido procesado correctamente.`;
        } else if (newStatus === "Cancelado") {
          message = `Tu pedido en ${company.name} ha sido cancelado.`;
        } else {
          message = `El estado de tu pedido en ${company.name} ha cambiado a: ${
            newStatus || "actualizado"
          }`;
        }
      }

      const notification = new NotificationModel({
        recipient_id: new mongoose.Types.ObjectId(recipientId),
        sender_id: new mongoose.Types.ObjectId(senderId),
        related_id: new mongoose.Types.ObjectId(order._id.toString()),
        type,
        message,
        read: false,
        created_at: new Date(),
      });

      // Guardar en base de datos
      await notification.save();

      // Enviamos la notificación si el destinatario está conectado
      if (this.userSockets.has(recipientId)) {
        const socketIds = this.userSockets.get(recipientId) || [];
        for (const socketId of socketIds) {
          const io = getIO();

          // Preparar objeto para envío por socket
          const socketNotification = {
            id: notification._id.toString(),
            type: notification.type,
            message: notification.message,
            created_at: notification.created_at,
            read: false,
            order: {
              id: order._id.toString(),
              status: type === "new_order" ? order.status : newStatus,
            },
            company: {
              id: company._id.toString(),
              name: company.name,
            },
            user: {
              id: userIdStr,
              name: user.name,
            },
          };

          io.to(socketId).emit("notification", socketNotification);

        }
      } 
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  }

  // Método para marcar una notificación como leída
  async markAsRead(notificationId: string, userId: string): Promise<boolean> {
    try {
      const result = await NotificationModel.updateOne(
        {
          _id: new mongoose.Types.ObjectId(notificationId),
          recipient_id: new mongoose.Types.ObjectId(userId),
        },
        { read: true }
      );

      return result.modifiedCount > 0;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      return false;
    }
  }

  // Método para obtener notificaciones de un usuario
  async getUserNotifications(
    userId: string,
    limit: number = 20,
    offset: number = 0,
    onlyUnread: boolean = false
  ) {
    try {
      const query: any = { recipient_id: new mongoose.Types.ObjectId(userId) };

      if (onlyUnread) {
        query.read = false;
      }

      const notifications = await NotificationModel.find(query)
        .sort({ created_at: -1 })
        .skip(offset)
        .limit(limit);

      return notifications;
    } catch (error) {
      console.error("Error getting user notifications:", error);
      return [];
    }
  }

  // Método para eliminar notificaciones antiguas (puede ejecutarse periódicamente)
  async deleteOldNotifications(daysOld: number = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    try {
      const result = await NotificationModel.deleteMany({
        created_at: { $lt: cutoffDate },
      });
      return result.deletedCount;
    } catch (error) {
      console.error("Error deleting old notifications:", error);
      return 0;
    }
  }

  // src/services/notification.service.ts
  async readNotifications(userId: string): Promise<void> {
    await NotificationModel.updateMany(
      { recipient_id: new mongoose.Types.ObjectId(userId), read: false },
      { $set: { read: true } }
    );
  }
}

// Exportamos una instancia para uso global
export const notificationService = new NotificationService();
