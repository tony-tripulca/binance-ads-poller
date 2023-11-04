module.exports = {
  apps: [
    {
      name: "BinanceAdsPoller",
      namespace: "binance-ads-poller",
      script: "./src/index.js",
      watch: ["./src", "./src/*.js"],
      output: "./logs/out.log",
      error: "./logs/error.log",
    },
  ],
};
