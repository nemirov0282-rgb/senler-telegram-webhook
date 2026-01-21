const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

app.post("/", async (req, res) => {
  try {
    const body = req.body;

    // Парсим данные заявки от Senler
    const integrationPublic = JSON.parse(body.integration_public || "{}");

    // Берём токен и chat_id из переменных окружения Render
    const BOT_TOKEN = process.env.BOT_TOKEN;
    const CHAT_ID = process.env.CHAT_ID;

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

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running on port", process.env.PORT || 3000);
});
