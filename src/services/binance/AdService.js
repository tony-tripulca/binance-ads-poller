import axios from "axios";
import URL from "../../config/url.js";

const AdService = {
  list: (payload) => {
    return axios({
      method: "GET",
      baseURL: URL.binance(),
      url: "/orders",
      headers: {
        "X-DV-Auth-Token": process.env.BORZO_TOKEN,
      },
      params: payload,
    });
  },

  create: (payload) => {
    return axios({
      method: "POST",
      baseURL: URL.binance(),
      url: "/create-order",
      headers: {
        "X-DV-Auth-Token": process.env.BORZO_TOKEN,
      },
      data: payload,
    });
  },
};

export default AdService;
