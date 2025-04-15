import express from "express";
import path from "path";
import { NODE_ENV, PORT, CORS_ORIGIN } from "./utils/env";
import connectDB from "./db/db";
import logger from "./utils/logger";
import cors from "cors"
import cookieParser from 'cookie-parser';
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();

app.use(cors({
  origin : CORS_ORIGIN,
  credentials : true
}));

app.use(express.json());
app.use(express.urlencoded({ extended : true}));
app.use(cookieParser());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  },
});

app.set("io", io); // With this we can access socket.io in our routes with req,res,...

const port = PORT || 6900;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running at : ${port}`);
    });
  })
  .catch((err) => {
    console.log(`DB Connection Failed !!`, err);
  });

const __dirname1 = path.resolve();

if (NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/client/build")));
  app.get("*path", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "client", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    logger.debug("Server is Running");
    res.send(`Server-API is running`);
  });
}


import userRoutes from "./routes/users.routes";
import chatRoutes from "./routes/chats.routes";
import messageRoutes from "./routes/messages.routes";



app.use("/api/v1/users", userRoutes);
app.use("/api/v1/chats", chatRoutes);
app.use("/api/v1/messages", messageRoutes);




export default app;
