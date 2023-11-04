import { app } from "./Server.js";
import AdController from "./controllers/binance/AdController.js";

import Logger from "./util/Logger.js";

function AppRoutes() {
  app.get("/", (req, res) => {
    res.json({ service: process.env.APP_NAME });
  });

  app.get("/start-poller", (req, res) => {
    AdController.startPoller(req, res);
  });
}

AppRoutes();
