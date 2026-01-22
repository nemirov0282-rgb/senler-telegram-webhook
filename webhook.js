const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

app.post("/", async (req, res) => {
  try {
    const body = req.body;

    const integrationPublic = JSON.parse(body.integration_public || "{}");
    const integrationPrivate = JSON.parse(body.integration_private || "{}");

    const BOT_TOKEN = integrationPrivate.bot_token;
    const CHAT_ID = integrationPrivate.chat_id;

    const text = `
🔔 Новое событие в Senler
Тип: ${body.event || "неизвестно"}
Имя: ${integrationPublic.name || "-"}
Телефон: ${integrationPublic.phone || "-"}
    `;

    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: text,
      }),
    });

    res.send("OK");
  } catch (e) {
    console.error(e);
    res.status(500).send("Error");
  }
});

app.listen(process.env.PORT || 3000);
