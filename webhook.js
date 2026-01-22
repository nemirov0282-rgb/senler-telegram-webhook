const express = require('express');
const request = require('request');

const app = express();
app.use(express.json());

// 🔐 данные бота
const BOT_TOKEN = '8263609736:AAFU6SpOS5v51FO-JOSUr6oaFD6pLQQ0Cwk';
const CHAT_ID = '130101004';

app.post('/', async (req, res) => {

    console.log(req.body);

    try {
        let body = req.body;
        let integration_public = body.integration_public;

        // 🔁 ВАША ОРИГИНАЛЬНАЯ ЛОГИКА
        if (body.lead_var) {
            integration_public = integration_public.replace(
                /\{%([A-Za-z0-9_]+)%\}/g,
                (_, k) => body.lead_var[k] || ''
            );
        }

        if (body.global_var) {
            integration_public = integration_public.replace(
                /\[%([A-Za-z0-9_]+)%\]/g,
                (_, k) => body.global_var[k] || ''
            );
        }

        if (body.lead) {
            integration_public = integration_public.replace(
                /%([A-Za-z0-9_]+)%/g,
                (_, k) => body.lead[k] || ''
            );
        }

        request.post(
            `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
            {
                json: {
                    chat_id: CHAT_ID,
                    text: integration_public,
                    parse_mode: 'HTML'
                }
            }
        );

        res.send('OK');

    } catch (e) {
        console.error(e);
        res.status(500).send('ERROR');
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log('Server started');
});
