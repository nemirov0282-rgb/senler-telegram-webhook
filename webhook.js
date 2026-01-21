const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

// 🔹 Вставьте сюда свои данные
const BOT_TOKEN = "8263609736:AAFU6SpOS5v51FO-JOSUr6oaFD6pLQQ0Cwk";   // токен Telegram-бота
const CHAT_ID = "1062930781";         // ID чата или канала

app.post("/", async (req, res) => {
  try {
    const body = req.body;

    // Парсим данные заявки
    const integrationPublic = JSON.parse(body.integration_public || "{}");

    const text = `
🔔 Новое событие в Senler
Тип: ${body.event || "неизвестно"}
Имя: ${integrationPublic.name || "-"}
Телефон: ${integrationPublic.phone || "-"}
    `;

    // Отправка сообщения в Telegram
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
