import { Server, Socket } from 'socket.io';
import { query } from '../config/database';
import { logger } from '../utils/logger';

interface ProjectRoom {
  [socketId: string]: {
    userId: string;
    userName: string;
    cursor?: { x: number; y: number };
    color: string;
  };
}

const projectRooms: Map<string, ProjectRoom> = new Map();

const cursorColors = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b',
  '#8b5cf6', '#ec4899', '#06b6d4', '#f97316',
];

export function setupSocketHandlers(io: Server): void {
  io.on('connection', (socket: Socket) => {
    logger.info(`Client connected: ${socket.id}`);

    // Join project room
    socket.on('join-project', (data: { projectId: string; userId: string; userName: string }) => {
      const { projectId, userId, userName } = data;
      socket.join(`project:${projectId}`);

      if (!projectRooms.has(projectId)) {
        projectRooms.set(projectId, {});
      }

      const room = projectRooms.get(projectId)!;
      const colorIndex = Object.keys(room).length % cursorColors.length;

      room[socket.id] = {
        userId,
        userName,
        color: cursorColors[colorIndex],
      };

      // Notify others
      socket.to(`project:${projectId}`).emit('user-joined', {
        socketId: socket.id,
        userName,
        color: cursorColors[colorIndex],
      });

      // Send existing users to new joiner
      socket.emit('room-users', Object.entries(room)
        .filter(([id]) => id !== socket.id)
        .map(([id, user]) => ({ socketId: id, ...user })));

      logger.info(`${userName} joined project ${projectId}`);
    });

    // Cursor position updates
    socket.on('cursor-move', (data: { projectId: string; x: number; y: number }) => {
      const room = projectRooms.get(data.projectId);
      if (room && room[socket.id]) {
        room[socket.id].cursor = { x: data.x, y: data.y };
        socket.to(`project:${data.projectId}`).emit('cursor-update', {
          socketId: socket.id,
          userName: room[socket.id].userName,
          color: room[socket.id].color,
          x: data.x,
          y: data.y,
        });
      }
    });

    // Unit selection sync
    socket.on('unit-select', (data: { projectId: string; unitId: string; userName: string }) => {
      socket.to(`project:${data.projectId}`).emit('unit-selected', {
        unitId: data.unitId,
        userName: data.userName,
      });
    });

    // Edit sync
    socket.on('edit-made', async (data: {
      projectId: string;
      action: string;
      element: string;
      before: string;
      after: string;
      userId: string;
      userName: string;
    }) => {
      // Save to database
      try {
        await query(
          `INSERT INTO edit_history (project_id, user_id, user_name, action, element, before_value, after_value)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [data.projectId, data.userId, data.userName, data.action, data.element, data.before, data.after]
        );
      } catch (err) {
        logger.error('Failed to save edit', err);
      }

      // Broadcast to room
      socket.to(`project:${data.projectId}`).emit('edit-synced', {
        userName: data.userName,
        action: data.action,
        element: data.element,
        timestamp: new Date().toISOString(),
      });
    });

    // Chat messages
    socket.on('chat-message', (data: { projectId: string; message: string; userName: string }) => {
      socket.to(`project:${data.projectId}`).emit('chat-received', {
        userName: data.userName,
        message: data.message,
        timestamp: new Date().toISOString(),
      });
    });

    // Disconnect
    socket.on('disconnect', () => {
      projectRooms.forEach((room, projectId) => {
        if (room[socket.id]) {
          const userName = room[socket.id].userName;
          delete room[socket.id];
          socket.to(`project:${projectId}`).emit('user-left', {
            socketId: socket.id,
            userName,
          });
        }
      });
      logger.info(`Client disconnected: ${socket.id}`);
    });
  });
}
