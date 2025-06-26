const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const OpenAI = require('openai');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Обработка POST-запроса
app.post('/ask', async (req, res) => {
  const userQuestion = req.body.question;

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Ты волшебный кот, который отвечает на вопросы судьбы с юмором и теплотой. Отвечай коротко, максимум 3-5 слов. Ответ должен быть прямым и не риторическим.',
        },
        { role: 'user', content: userQuestion },
      ],
      temperature: 0.9,
      max_tokens: 150,
    });

    const aiAnswer = chatCompletion.choices[0].message.content;
    res.json({ answer: aiAnswer });
  } catch (error) {
    console.error('Ошибка OpenAI:', error.message);
    res.status(500).json({ error: 'Ошибка генерации ответа' });
  }
});

// Фронтенд из public
app.use(express.static(path.join(__dirname, '..', 'public')));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Используем PORT из среды, иначе 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🐾 Сервер запущен на http://localhost:${PORT}`);
});
