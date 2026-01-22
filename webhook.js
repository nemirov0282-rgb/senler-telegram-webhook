const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

// 🔐 ДАННЫЕ БОТА
const BOT_TOKEN = "8263609736:AAFU6SpOS5v51FO-JOSUr6oaFD6pLQQ0Cwk";
const CHAT_ID = "130101004";

app.post("/", async (req, res) => {
  try {
    const body = req.body;

    const integrationPublic = JSON.parse(body.integration_public || "{}");

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
  console.log("Server started");
});
