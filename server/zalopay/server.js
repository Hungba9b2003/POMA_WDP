const axios = require('axios').default; // npm install axios
const CryptoJS = require('crypto-js'); // npm install crypto-js
const express = require('express'); // npm install express
const bodyParser = require('body-parser'); // npm install body-parser
const moment = require('moment'); // npm install moment
const qs = require('qs');

const app = express();
const cors = require('cors');
app.use(cors());

// APP INFO, STK TEST: 4111 1111 1111 1111
const config = {
    app_id: '2554',
    key1: 'sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn',
    key2: 'trMrHtvjo6myautxDUiAcYsVtaeQ8nhf',
    endpoint: 'https://sb-openapi.zalopay.vn/v2/create',
};

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Server is running!');
});

//lưu token tạm thời
//let storedToken;

/**
 * method: POST
 * Sandbox POST https://sb-openapi.zalopay.vn/v2/create
 * Real POST https://openapi.zalopay.vn/v2/create
 * description: tạo đơn hàng, thanh toán
 */

app.post('/payment', async (req, res) => {
    const { projectId } = req.body;
    //storedToken = req.headers['authorization']; // Lưu token vào biến toàn cục

    // Tiếp tục xử lý thanh toán như trước
    const amount = 5075140;
    const embed_data = { redirecturl: `http://localhost:3000/projects/${projectId}` };
    const items = [];
    const transID = Math.floor(Math.random() * 1000000);

    const order = {
        app_id: config.app_id,
        app_trans_id: `${moment().format('YYMMDD')}_${transID}`,
        app_user: 'user123',
        app_time: Date.now(),
        item: JSON.stringify(items),
        embed_data: JSON.stringify(embed_data),
        amount,
        callback_url: 'https://0655-118-70-211-234.ngrok-free.app',
        description: `POMA - Payment for the order #${transID}`,
        bank_code: ''
    };

    const data = `${config.app_id}|${order.app_trans_id}|${order.app_user}|${order.amount}|${order.app_time}|${order.embed_data}|${order.item}`;
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    try {
        const result = await axios.post(config.endpoint, null, { params: order });
        return res.status(200).json(result.data);
    } catch (error) {
        console.log('Payment request error:', error.response ? error.response.data : error.message);
        return res.status(500).json({ error: 'Payment processing failed' });
    }
});


/**
 * method: POST
 * description: callback để Zalopay Server call đến khi thanh toán thành công.
 * Khi và chỉ khi ZaloPay đã thu tiền khách hàng thành công thì mới gọi API này để thông báo kết quả.
 */
app.post('/callback', async (req, res) => {
    let result = {};
    try {
        let dataStr = req.body.data;
        let reqMac = req.body.mac;
        let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();

        if (reqMac !== mac) {
            result.return_code = -1;
            result.return_message = 'mac not equal';
        } else {
            let dataJson = JSON.parse(dataStr);
            const projectId = JSON.parse(dataJson.embed_data).redirecturl.split('/').pop();

            // Gọi API updatePremium với token được lưu từ trước
            await axios.post(
                'http://localhost:9999/groups/updatePremium',
                { _id: projectId, isPremium: true },
                // {
                //     headers: {
                //         Authorization: storedToken,
                //     },
                // }
            );
            console.log(`Cập nhật project ${projectId} thành Premium`);

            result.return_code = 1;
            result.return_message = 'success';
        }
    } catch (ex) {
        console.log('lỗi:::' + ex.message);
        result.return_code = 0;
        result.return_message = ex.message;
    }

    res.json(result);
});


app.post('/check-status-order', async (req, res) => {
    const { app_trans_id } = req.body;

    let postData = {
        app_id: config.app_id,
        app_trans_id,
    };

    let data = postData.app_id + '|' + postData.app_trans_id + '|' + config.key1;
    postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    let postConfig = {
        method: 'post',
        url: 'https://sb-openapi.zalopay.vn/v2/query',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: qs.stringify(postData),
    };

    try {
        const result = await axios(postConfig);
        return res.status(200).json(result.data);
    } catch (error) {
        console.log('lỗi');
        console.log(error);
        return res.status(500).json({ error: 'Error checking order status' });
    }
});

app.listen(8888, function () {
    console.log('Server is listening at port :8888');
});
