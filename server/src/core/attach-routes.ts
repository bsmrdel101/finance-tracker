import express, { type Application } from "express";
import plaidRouter from "../controllers/plaid.controller";


export function attachRoutes(app: Application) {
  const router = express.Router();
  router.use("/plaid", plaidRouter);

  app.use("/api", router);

  app.get("/", (_: any, res: any) => {
    res.status(200);
  });
}
