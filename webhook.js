var request = require('request');
module.exports.handler = async function (event, context) {
    //event.body
    console.log(event.body)

    let responce = {};
    try {

        let body = JSON.parse(event.body);
        console.log('BODY=',body);


        let integration_public = JSON.parse(body.integration_public);
        let integration_private = JSON.parse(body.integration_private);


        if(Object.prototype.toString.call(integration_private) === '[object Array]') {

            for(let item_user of integration_private){
                console.log('item_user=',item_user);
                let token = item_user.token;
                let chatId = item_user.chat_id;

                try{
                    if ('lead_var' in body){
                        integration_public = integration_public.replace(
                            new RegExp('\{%([A-Za-z0-9_]+)%\}', "g"),
                            (whole, part1) => {
                                if (body.lead_var.hasOwnProperty(part1)) {
                                    return body.lead_var[part1];
                                } else {
                                    return '';
                                }
                            }
                        )
                    }
                    if ('global_var' in body){
                        integration_public = integration_public.replace(
                            new RegExp('\\[%([A-Za-z0-9_]+)%\\]', "g"),
                            (whole, part1) => {
                                if (body.global_var.hasOwnProperty(part1)) {
                                    return body.global_var[part1];
                                } else {
                                    return '';
                                }
                            }
                        )
                    }

                    integration_public = integration_public.replace(
                        new RegExp('%([A-Za-z0-9_]+)%', "g"),
                        (whole, part1) => {
                            if (body.lead.hasOwnProperty(part1)) {
                                return body.lead[part1];
                            } else {
                                return '';
                            }
                        }
                    )
                }
                catch(e){
                    console.log('ERR=',e);
                }



                let data = {
                    method: 'post',
                    payload: {
                        method: 'sendMessage',
                        chat_id: String(chatId),
                        text: integration_public,
                        parse_mode: 'HTML',
                        reply_markup: JSON.stringify(null)
                    }
                }

                //textarea.replaceArray(find, replace);
                console.log( 'https://api.telegram.org/bot'1062930781:AAFU6SpOS5v51FO-JOSUr6oaFD6pLQQ0Cwk'/sendMessage?text='+integration_public+'&chat_id='+chatId);
                console.log(data);
                request.post(
                    'https://api.telegram.org/bot' + token + '/sendMessage?text='+encodeURIComponent(integration_public)+'&chat_id='+chatId,
                    { json:data },
                    function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                            console.log(body);
                        }
                        console.log(error, body);
                    }
                );

            }

        }


    } catch (e) {
        console.log(e);
        responce = {err:JSON.stringify(e)}
    }
    return {
        statusCode: 200,
        body: JSON.stringify(responce)
    };
};
