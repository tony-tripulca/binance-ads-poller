import { app } from "./Server.js";
import AdController from "./controllers/binance/AdController.js";

import Logger from "./util/Logger.js";

function AppRoutes() {
  app.get("/", (req, res) => {
    res.json({ service: process.env.APP_NAME });
  });

  app.get("/start-poll", (req, res) => {
    AdController.startPoll(req, res);
  });

  app.get("/end-poll", (req, res) => {
    AdController.stopPoll(req, res);
  });
}

AppRoutes();
