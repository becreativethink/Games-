// index.js
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { initializeFirebase, getUserData, setUserData } = require('./firebase');
const { handleConnectors, handleTask } = require('./connectors');
const { callAI } = require('./ai');

initializeFirebase();

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

// Handle /start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `Welcome! I'm your AI assistant. You can connect tools and run tasks.`, {
    reply_markup: {
      keyboard: [['Start Setup']],
      resize_keyboard: true,
    },
  });
});

// Handle setup flow
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === 'Start Setup') {
    // Ask for connectors
    bot.sendMessage(chatId, 'Choose connectors to connect:', {
      reply_markup: {
        keyboard: [['Gmail', 'Google Drive'], ['GitHub'], ['Done']],
        resize_keyboard: true,
      },
    });
    await setUserData(chatId, { step: 'choose_connectors', connectors: [] });
  } else {
    const userData = await getUserData(chatId);
    if (userData.step === 'choose_connectors') {
      // Collect connectors
      const connectors = userData.connectors || [];
      if (text !== 'Done') {
        connectors.push(text);
        await setUserData(chatId, { ...userData, connectors });
        bot.sendMessage(chatId, `Added ${text}. Add more or press 'Done' to finish.`);
      } else {
        // Proceed to API key input
        await setUserData(chatId, { step: 'api_keys', connectors });
        bot.sendMessage(chatId, 'Please enter your API key for the selected connectors.');
      }
    } else if (userData.step === 'api_keys') {
      // Save API key
      const { connectors } = userData;
      // Save API key for each connector
      for (const connector of connectors) {
        // Save encrypted API key in Firebase
        await setUserData(chatId, {
          [`api_${connector}`]: msg.text,
        });
      }
      // Proceed to AI configuration
      await setUserData(chatId, { step: 'ai_config' });
      bot.sendMessage(chatId, 'Use default AI API or provide your own?', {
        reply_markup: {
          keyboard: [['Default'], ['Custom']],
          resize_keyboard: true,
        },
      });
    } else if (userData.step === 'ai_config') {
      if (text === 'Default') {
        await setUserData(chatId, { ai_provider: 'huggingface', use_default: true });
        bot.sendMessage(chatId, 'Setup complete! Use /run to execute tasks.');
      } else if (text === 'Custom') {
        await setUserData(chatId, { step: 'custom_ai_provider' });
        bot.sendMessage(chatId, 'Enter provider (e.g., OpenAI, Claude):');
      }
    } else if (userData.step === 'custom_ai_provider') {
      await setUserData(chatId, { ai_provider: text, step: 'custom_ai_model' });
      bot.sendMessage(chatId, 'Enter model name:');
    } else if (userData.step === 'custom_ai_model') {
      await setUserData(chatId, { ai_model: text, step: 'custom_ai_key' });
      bot.sendMessage(chatId, 'Enter your API key:');
    } else if (userData.step === 'custom_ai_key') {
      await setUserData(chatId, { ai_api_key: msg.text, step: 'done' });
      bot.sendMessage(chatId, 'AI setup complete! Use /run to execute tasks.');
    } else if (text === '/run') {
      bot.sendMessage(chatId, 'Please enter your task prompt:');
      await setUserData(chatId, { step: 'awaiting_task' });
    } else if (userData.step === 'awaiting_task') {
      const taskPrompt = text;
      // Call AI and connectors
      const result = await handleTask(chatId, taskPrompt);
      bot.sendMessage(chatId, result);
      await setUserData(chatId, { step: 'done' });
    }
  }
});
