import fs from "fs";

import URL from "../../config/url.js";
import AdService from "../../services/binance/AdService.js";

import Logger from "../../util/Logger.js";

const AdController = {
  ads: [],
  buy: {
    interval: null,
    page: 1,
    resource: {},
    done: false,
  },
  sell: {
    interval: null,
    page: 1,
    resource: {},
    done: false,
  },
  polling: null,
  startPoll: (req, res) => {
    if (!req.query.asset || !req.query.fiat) {
      res.json({
        required: ["asset", "fiat"],
      });
      return;
    }

    let minutes = 0.5;

    let data = {
      asset: req.query.asset,
      fiat: req.query.fiat,
    };

    AdController.polling = setInterval(() => {
      AdController.poller(data);
    }, minutes * 60 * 1000);

    res.send("Success");
  },
  stopPoll: () => {
    clearInterval(AdController.polling);
    Logger.out([">>>>>>>>>>>>>>>>>>>>>>>> Poller stopped"]);
  },
  poller: (data) => {
    Logger.out([">>>>>>>>>>>>>>>>>>>>>>>> Poller started"]);

    // Poll for buy side orders first
    AdController.buy.interval = setInterval(() => {
      AdController.getBuySide(data);
    }, 2000);

    // Poll for sell side if the buy side is done
    AdController.sell.interval = setInterval(() => {
      if (AdController.buy.done) {
        AdController.getSellSide(data);
      }
    }, 2000);

    // Save to file if both buy and sell are done
    let interval = setInterval(() => {
      if (AdController.buy.done && AdController.sell.done) {
        fs.writeFile(
          "../database/ads.json",
          JSON.stringify(AdController.ads),
          function (err) {
            if (err) throw err;
            Logger.out([
              "ads.json has been created",
              ">>>>>>>>>>>>>>>>>>>>>>>> Poller done",
            ]);
          }
        );
        // Clear save to file
        // Reset
        clearInterval(interval);
        AdController.ads = [];
        AdController.buy.done = false;
        AdController.buy.page = 1;
        AdController.sell.done = false;
        AdController.sell.page = 1;
      }
    }, 1000);
  },
  getBuySide: async (data) => {
    AdController.buy.resource = await AdService.searchAndSave({
      asset: data.asset,
      fiat: data.fiat,
      page: AdController.buy.page,
      rows: 15, // This value should be less than 20
      tradeType: "BUY",
      timestamp: Date.now(),
    });

    const { total, data: ads } = AdController.buy.resource.data;

    if (ads.length) {
      Logger.out([
        `Buy side total: ${total}`,
        `Storing page ${AdController.buy.page}`,
      ]);

      ads.forEach((i, iKey) => {
        AdController.ads.push(i);
      });

      AdController.buy.page++;
    } else {
      AdController.buy.done = true;
      clearInterval(AdController.buy.interval);
    }
  },
  getSellSide: async (data) => {
    AdController.sell.resource = await AdService.searchAndSave({
      asset: data.asset,
      fiat: data.fiat,
      page: AdController.sell.page,
      rows: 15, // This value should be less than 20
      tradeType: "SELL",
      timestamp: Date.now(),
    });

    const { total, data: ads } = AdController.sell.resource.data;

    // Clear interval
    if (ads.length) {
      Logger.out([
        `Sell side total: ${total}`,
        `Storing page ${AdController.sell.page}`,
      ]);

      ads.forEach((i, iKey) => {
        AdController.ads.push(i);
      });

      AdController.sell.page++;
    } else {
      AdController.sell.done = true;
      clearInterval(AdController.sell.interval);
    }
  },
};

export default AdController;
