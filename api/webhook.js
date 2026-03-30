// file: api/webhook.js
const TelegramBot = require('node-telegram-bot-api');
const { token } = require('../setting');
const { handleUpdate } = require('../index'); // <-- Hanya memanggil handleUpdate

// Inisiasi bot tanpa polling (khusus untuk Webhook Vercel)
const bot = new TelegramBot(token); 

module.exports = async (req, res) => {
    try {
        if (req.body) {
            // TUNGGU sampai seluruh logika bot di index.js selesai
            await handleUpdate(req.body, bot); 
        }
        
        // Vercel baru boleh memberikan respons setelah semua selesai
        res.status(200).send('OK');
    } catch (error) {
        console.error("Webhook Error:", error);
        // Tetap kirim 200 OK agar Telegram tidak mengirim ulang request yang sama (spam)
        res.status(200).send('OK'); 
    }
};
