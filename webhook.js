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

    // Берем integration_public
    let integrationData = {};
    if (body.integration_public) {
      if (typeof body.integration_public === "string") {
        try {
          integrationData = JSON.parse(body.integration_public);
        } catch (e) {
          console.warn("Не удалось распарсить integration_public:", e);
          integrationData = {};
        }
      } else {
        integrationData = body.integration_public;
      }
    }

    // Если внутри есть subscriber, вытаскиваем его
    const subscriber = integrationData.subscriber || {};

    const name = subscriber.name || "-";
    const phone = subscriber.phone || "-";

    // Остальные поля (если нужны)
    const extraFields = Object.entries(integrationData)
      .filter(([key]) => key !== "subscriber")
      .map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value || "-"}`)
      .join("\n");

    const text = `🔔 Новое бронирование // Senler
Имя: ${name}
Телефон: ${phone}
${extraFields ? "\n" + extraFields : ""}`;

    // Отправка в Telegram
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
