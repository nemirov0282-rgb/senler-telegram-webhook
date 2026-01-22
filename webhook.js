const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

// Функция рекурсивного поиска поля в объекте
function findField(obj, fieldName) {
  if (!obj || typeof obj !== "object") return null;

  if (obj.hasOwnProperty(fieldName)) return obj[fieldName];

  for (const key of Object.keys(obj)) {
    const value = obj[key];
    if (typeof value === "object") {
      const result = findField(value, fieldName);
      if (result !== null) return result;
    }
  }

  return null;
}

// Формирование дополнительных полей, кроме name и phone
function formatExtraFields(obj, skipFields = ["name", "phone"]) {
  if (!obj || typeof obj !== "object") return "";

  const lines = [];

  for (const [key, value] of Object.entries(obj)) {
    if (skipFields.includes(key)) continue;

    if (typeof value === "object") {
      const nested = formatExtraFields(value, skipFields);
      if (nested) lines.push(nested);
    } else {
      lines.push(`${key.charAt(0).toUpperCase() + key.slice(1)}: ${value || "-"}`);
    }
  }

  return lines.join("\n");
}

app.post("/", async (req, res) => {
  try {
    // Логируем данные для отладки (можно убрать позже)
    console.log("=== Новый запрос от Senler ===");
    console.log(JSON.stringify(req.body, null, 2));

    const body = req.body;

    // Если integration_public — это строка JSON, парсим её
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

    // Ищем имя и телефон рекурсивно в integrationData или в body
    const name = findField(integrationData, "name") || findField(body, "name") || "-";
    const phone = findField(integrationData, "phone") || findField(body, "phone") || "-";

    // Формируем дополнительные поля
    const extraFields = formatExtraFields(integrationData) || formatExtraFields(body);

    const text = `🔔 Новое бронирование // Senler
Имя: ${name}
Телефон: ${phone}
${extraFields ? "\n" + extraFields : ""}`;

    // Отправка сообщения в Telegram
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
