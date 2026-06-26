import express from "express";
import { configureServer } from "./core/index";
import http from "http";

const app = express();
configureServer(app);

const server = http.createServer(app);

const PORT = process.env.PORT || 8440;
server.listen(PORT, () => {
  console.log(`Server is up on http://localhost:${PORT}`);
});
