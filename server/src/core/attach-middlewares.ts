import cors from "cors";
import express, { type Application } from "express";
import helmet from "helmet";
import { errorCatcher } from "../middlewares/index";
import { configDotenv } from "dotenv";
import { camelCaseMiddleware } from "../middlewares/data";
configDotenv();


export function attachMiddlewares(app: Application) {
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));
  app.use(camelCaseMiddleware);
  app.use(helmet());
  app.use(cors({
    origin: [
      'https://finance-tracker.up.railway.app',
      'http://localhost:5173'
    ],
    credentials: true
  }));
  
  app.set('trust proxy', 1);
  app.use(errorCatcher);
}
