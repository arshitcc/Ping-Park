import express from "express";
import path from "path";
import { NODE_ENV, PORT, CORS_ORIGIN } from "./utils/env";
import connectDB from "./db/db";
import logger from "./utils/logger";
import cors from "cors"
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
  origin : CORS_ORIGIN,
  credentials : true
}));

app.use(express.json());
app.use(express.urlencoded({ extended : true}));
app.use(cookieParser());

const port = PORT || 6900;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`DB Connection Successful : ${port}`);
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




export default app;
