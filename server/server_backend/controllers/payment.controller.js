const axios = require('axios').default; // npm install axios
const CryptoJS = require('crypto-js'); // npm install crypto-js
const moment = require('moment'); // npm install moment
const qs = require('qs');
const config = require('../config'); // Nhập thông tin cấu hình từ file config

// Tạo đơn hàng, thanh toán
exports.createPayment = async (req, res) => {
    const amount = 5075140; // Số tiền cụ thể
    const embed_data = {
        redirecturl: 'http://localhost:3000/groups/671e36e30f93d8b077a7957a', // Chuyển hướng về trang groups sau khi thanh toán
    };

    const items = [];
    const transID = Math.floor(Math.random() * 1000000);

    const order = {
        app_id: config.app_id,
        app_trans_id: `${moment().format('YYMMDD')}_${transID}`,
        app_user: 'user123',
        app_time: Date.now(),
        item: JSON.stringify(items),
        embed_data: JSON.stringify(embed_data),
        amount: amount, // Sử dụng số tiền cụ thể
        callback_url: 'https://b074-1-53-37-194.ngrok-free.app/callback',
        description: `Lazada - Payment for the order #${transID}`,
        bank_code: '',
    };

    const data = `${config.app_id}|${order.app_trans_id}|${order.app_user}|${order.amount}|${order.app_time}|${order.embed_data}|${order.item}`;
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    try {
        const result = await axios.post(config.endpoint, null, { params: order });
        return res.status(200).json(result.data);
    } catch (error) {
        return res.status(500).json({ error: 'Payment processing failed' });
    }
};

// Callback để Zalopay Server call đến khi thanh toán thành công
exports.callback = (req, res) => {
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
            result.return_code = 1;
            result.return_message = 'success';

            // Chuyển hướng đến trang groups sau khi thanh toán thành công
            res.redirect('http://localhost:3000/groups/671e36e30f93d8b077a7957a');
            return;
        }
    } catch (ex) {
        result.return_code = 0;
        result.return_message = ex.message;
    }

    // thông báo kết quả cho ZaloPay server
    res.json(result);
};

// Kiểm tra trạng thái đơn hàng
exports.checkStatusOrder = async (req, res) => {
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
        console.log('lỗi', error);
    }
};
