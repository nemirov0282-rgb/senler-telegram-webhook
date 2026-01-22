const express = require("express");
const fetch = require("node-fetch");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

app.post("/", async (req, res) => {
  try {
    const body = req.body;

    const integrationPublic =
      typeof body.integration_public === "string"
        ? JSON.parse(body.integration_public)
        : body.integration_public || {};

    const text = `
🔔 Новое событие в Senler
Тип: ${body.event || "неизвестно"}
Имя: ${integrationPublic.name || "-"}
Телефон: ${integrationPublic.phone || "-"}
    `;

    const tgRes = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text,
        }),
      }
    );

    const tgData = await tgRes.json();
    console.log("Telegram response:", tgData);

    res.send("OK");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running on port", process.env.PORT || 3000);
});
