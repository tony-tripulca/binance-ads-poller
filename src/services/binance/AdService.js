import axios from "axios";
import URL from "../../config/url.js";
import { createSignature, toQueryString } from "../../util/Hash.js";

const API_KEY = process.env.BINANCE_API_KEY;
const SECRET_KEY = process.env.BINANCE_SECRET_KEY;

const AdService = {
  searchAndSave: (payload) => {
    let endpoint = "/ads/search";
    payload.signature = createSignature(SECRET_KEY, toQueryString(payload));

    return axios({
      method: "POST",
      baseURL: URL.binance(),
      url: `${endpoint}?${toQueryString(payload)}`,
      headers: { "X-MBX-APIKEY": API_KEY },
      data: payload,
    });
  },
};

export default AdService;
