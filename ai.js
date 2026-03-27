// ai.js
const axios = require('axios');
const { getUserData } = require('./firebase');

async function callAI(chatId, prompt) {
  const userData = await getUserData(chatId);
  const useDefault = userData.use_default;
  const apiKey = userData.ai_api_key || process.env.HF_API_KEY;
  const provider = userData.ai_provider || 'huggingface';

  if (provider === 'huggingface' || useDefault) {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/' + (userData.ai_model || 'Qwen-2.7B'),
      { inputs: prompt },
      { headers: { Authorization: `Bearer ${apiKey}` } }
    );
    return response.data.generated_text || response.data;
  }
  // Add support for other providers
  return 'Provider not supported yet.';
}

module.exports = { callAI };
