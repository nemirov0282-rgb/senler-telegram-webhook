var request = require('request');

// 🔐 ТВОИ ДАННЫЕ
const BOT_TOKEN = '8263609736:AAFU6SpOS5v51FO-JOSUr6oaFD6pLQQ0Cwk';
const CHAT_ID = '130101004';

module.exports.handler = async function (event, context) {

    console.log(event.body);

    let responce = {};

    try {
        let body = JSON.parse(event.body);
        console.log('BODY=', body);

        let integration_public = body.integration_public;

        // 🔁 Оставляем всю оригинальную логику replace
        try {
            if ('lead_var' in body) {
                integration_public = integration_public.replace(
                    /\{%([A-Za-z0-9_]+)%\}/g,
                    (whole, part1) => body.lead_var[part1] || ''
                );
            }

            if ('global_var' in body) {
                integration_public = integration_public.replace(
                    /\[%([A-Za-z0-9_]+)%\]/g,
                    (whole, part1) => body.global_var[part1] || ''
                );
            }

            integration_public = integration_public.replace(
                /%([A-Za-z0-9_]+)%/g,
                (whole, part1) => body.lead?.[part1] || ''
            );
        } catch (e) {
            console.log('ERR=', e);
        }

        // 📩 Отправка сообщения
        request.post(
            `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
            {
                json: {
                    chat_id: CHAT_ID,
                    text: integration_public,
                    parse_mode: 'HTML'
                }
            },
            function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    console.log('Telegram OK:', body);
                } else {
                    console.log('Telegram ERROR:', error, body);
                }
            }
        );

    } catch (e) {
        console.log(e);
        responce = { err: JSON.stringify(e) };
    }

    return {
        statusCode: 200,
        body: JSON.stringify(responce)
    };
};
