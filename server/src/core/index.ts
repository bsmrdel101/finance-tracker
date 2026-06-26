import { attachMiddlewares } from "./attach-middlewares";
import { attachRoutes } from "./attach-routes";


export function configureServer(app: import("express").Application) {
  attachMiddlewares(app);
  attachRoutes(app);
}
