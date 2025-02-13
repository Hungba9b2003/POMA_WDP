// Node v10.15.3
const axios = require("axios").default; // npm install axios
const CryptoJS = require("crypto-js"); // npm install crypto-js
const express = require("express"); // npm install express
const bodyParser = require("body-parser"); // npm install body-parser
const moment = require("moment"); // npm install moment
const qs = require("qs");

const app = express();
const cors = require("cors");
app.use(cors());

// APP INFO, STK TEST: 4111 1111 1111 1111
const config = {
  app_id: "2554",
  key1: "sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn",
  key2: "trMrHtvjo6myautxDUiAcYsVtaeQ8nhf",
  endpoint: "https://sb-openapi.zalopay.vn/v2/create",
};

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Server is running!");
});

//lưu token tạm thời
let storedToken;

app.post("/callback", async (req, res) => {
  let result = {};
  try {
    let dataStr = req.body.data;
    let reqMac = req.body.mac;
    let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();

    if (reqMac !== mac) {
      result.return_code = -1;
      result.return_message = "mac not equal";
    } else {
      let dataJson = JSON.parse(dataStr);
      const groupId = JSON.parse(dataJson.embed_data)
        .redirecturl.split("/")
        .pop();

      // Gọi API updatePremium với token được lưu từ trước
      await axios.post(
        "http://localhost:9999/groups/updatePremium",
        { _id: groupId, isPremium: true },
        {
          headers: {
            Authorization: storedToken,
          },
        }
      );
      console.log(`Cập nhật group ${groupId} thành Premium`);

      result.return_code = 1;
      result.return_message = "success";
    }
  } catch (ex) {
    console.log("lỗi:::" + ex.message);
    result.return_code = 0;
    result.return_message = ex.message;
  }

  res.json(result);
});

app.post("/check-status-order", async (req, res) => {
  const { app_trans_id } = req.body;

  let postData = {
    app_id: config.app_id,
    app_trans_id,
  };

  let data = postData.app_id + "|" + postData.app_trans_id + "|" + config.key1;
  postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

  let postConfig = {
    method: "post",
    url: "https://sb-openapi.zalopay.vn/v2/query",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: qs.stringify(postData),
  };

  try {
    const result = await axios(postConfig);
    return res.status(200).json(result.data);
  } catch (error) {
    console.log("lỗi");
    console.log(error);
    return res.status(500).json({ error: "Error checking order status" });
  }
});

app.listen(8888, function () {
  console.log("Server is listening at port :8888");
});
