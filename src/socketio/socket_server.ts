/** @format */

import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected: " + socket.id);

  // Task view events
  socket.on("task", (data) => {
    io.emit("taskchanged", {
      groupId: data.groupId,
      taskchanged: data.taskchanged,
    });
  });

  // Inside task events
  socket.on("taskdialog", (data) => {
    if (data.taskId && data.subtaskchanged) {
      io.emit("subtaskchanged", {
        taskId: data.taskId,
        subtaskchanged: data.subtaskchanged,
        userId: data.userId,
      });
    }

    if (data.taskId && data.taskcomment) {
      io.emit("taskcommentchanged", {
        taskId: data.taskId,
        message: data.message,
      });
    } else if (data.subtaskId && data.subtaskcomment) {
      io.emit("subtaskcommentchanged", {
        subtaskId: data.subtaskId,
        message: data.message,
      });
    }
  });

  // File storage events
  socket.on("file", (data) => {
    if (data.fileupload) {
      io.emit("fileuploaded", {
        groupId: data.groupId,
        folderId: data.folderId,
        fileuploaded: true,
      });
    }
    if (data.fileupdated) {
      io.emit("fileupdated", {
        groupId: data.groupId,
        folderId: data.folderId,
        fileupdated: true,
      });
    }
  });

  // Schedule events
  socket.on("schedule", (data) => {
    io.emit("schedulechange", {
      collabId: data.collabId,
      schedulechanged: data.schedulechanged,
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected: " + socket.id);
  });
});

const port = process.env.SOCKET_PORT || 3001;

httpServer.listen(port, () => {
  console.log("Socket server listening on *:3001");
});
