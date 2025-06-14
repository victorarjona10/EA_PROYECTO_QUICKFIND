import { Server as SocketIOServer } from "socket.io";
import { Server } from "http";
import { verifyToken } from "./utils/jwt.handle";
import { ChatService } from "./services/chat.service";
import fs from 'fs';
const logToFile = (message: string) => {
  fs.appendFileSync('chat.log', `${new Date().toISOString()} - ${message}\n`);
};

// Variable para almacenar la instancia de Socket.IO
let io: SocketIOServer;

/**
 * Inicializa Socket.IO en el servidor HTTP
 */
export function initializeSocketIO(server: Server) {
  io = new SocketIOServer(server, {
    cors: {
      origin: ["http://localhost:4200", "http://localhost:3000"],
      credentials: true,
    },
  });

  return io;
}

/**
 * Devuelve la instancia de Socket.IO
 */
export function getIO(): SocketIOServer {
  if (!io) {
    throw new Error(
      "Socket.IO no ha sido inicializado. Llama a initializeSocketIO primero."
    );
  }
  return io;
}

// -------------------- ADD NEW CODE BELOW THIS LINE --------------------

// Interfaz para tipado de mensajes del chat
export interface ChatMessage {
  id?: string
  room: string;
  author: string;
  receiver?: string; // Opcional si el mensaje es privado
  message: string;
  time: string;
}

/**
 * Inicializa el servicio de chat usando la instancia existente de Socket.IO
 * Debe llamarse después de initializeSocketIO pero antes de usar el chat
 */
const chatService = new ChatService();

export function initializeChatService() {
  if (!io) {
    throw new Error("Socket.IO no ha sido inicializado. Llama a initializeSocketIO primero.");
  }

  // Crear un namespace específico para chat
  const chatNamespace = io.of('/chat');

  // Configurar eventos de chat en el namespace
  chatNamespace.on('connection', (socket) => {
    // Verificación JWT para los sockets de chat
    socket.use(([_event, ..._args], next) => {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error('unauthorized'));

      try {
        verifyToken(token);
        return next();
      } catch (err) {
        return next(new Error('unauthorized'));
      }
    });

    socket.on('error', (err) => {
      if (err && err.message === 'unauthorized') {
        socket.emit('status', { status: 'unauthorized' });
        socket.disconnect();
      }
    });

    // Unirse a una sala
    socket.on('join_room', async (roomId) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} se unió a la sala ${roomId}`);
      try {
        // Get message history
        const messageHistory = await chatService.getMessagesByRoom(roomId, 50);

        // Convert to the format expected by the frontend
        const formattedHistory = messageHistory.map(msg => ({
          id: msg.id,
          text: msg.message,
          sender: msg.author.toString(),
          timestamp: msg.time
        }));

        // Send history to the client
        socket.emit('message_history', formattedHistory);
      } catch (error) {
        console.error('Error retrieving chat history:', error);
      }
    });

    // Enviar mensaje a una sala
    socket.on('send_message', async (data) => {
      console.log(`Mensaje enviado a la sala ${data.room}:`, data.message);
      try {
        // Extract the nested messageData from the frontend format
        const messageContent = data.message;
        // Create a properly formatted message object for our database
        const chatMessage: ChatMessage = {
          room: data.room,
          author:  messageContent.sender,
          receiver: messageContent.receiver,
          message: messageContent.text || messageContent,  // Handle both object and string formats
          time: messageContent.timestamp ? new Date(messageContent.timestamp).toISOString() : new Date().toISOString(),
          // Use ID from messageContent if available
          id: messageContent.id
        };  

        // Save to database
        const savedMessage = await chatService.saveMessage(chatMessage);

        // Broadcast to everyone else in the room
        socket.broadcast.to(data.room).emit('receive_message', {
          id: savedMessage.id,
          text: savedMessage.message,
          sender: savedMessage.author.toString(),
          timestamp: new Date(savedMessage.time).getTime()
        });

      } catch (error) {
        console.error('Error handling message:', error);
        socket.emit('message_error', { error: 'Failed to process message' });
      }
    });

    // Manejar desconexión
    socket.on('disconnect', () => {
      logToFile(`Usuario desconectado del chat: ${socket.id}`);
    });
  });

  return chatNamespace;
}

/**
 * Obtiene el namespace de chat
 */
export function getChatNamespace() {
  if (!io) {
    throw new Error("Socket.IO no ha sido inicializado. Llama a initializeSocketIO primero.");
  }
  return io.of('/chat');
}