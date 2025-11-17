import express from "express";
import cors from "cors";

import notFoundHandler from "./middlewares/notFoundHandler.js";
import errorHandler from "./middlewares/errorHandler.js";

import authRouter from "./routers/auth.router.js";

const startServer = () => {
  const app = express();
  const port = process.env.PORT || 3000;

  app.use(cors());
  app.use(express.json());

  app.use("/auth", authRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(port, () => console.log(`Server is running on ${port} port`));
};

export default startServer;
