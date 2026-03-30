// file: index.js
const { botName } = require('./setting'); 

async function handleUpdate(update, bot) {
    try {
        if (update.message) {
            const msg = update.message;
            const chatId = msg.chat.id;
            const text = msg.text ? msg.text.trim() : '';

            // Memisahkan command dan query (q) dari pesan teks
            const command = text.split(' ')[0].toLowerCase();
            const q = text.substring(command.length).trim();
            
            // Ganti ini dengan logika ID admin Telegram Anda. Contoh: msg.from.id.toString() === global.ownerId
            const isSuperOwner = true; 

            // ==========================================
            // FITUR OWNER: eval, curl, get
            // ==========================================
            if (command === '/eval' || command === 'eval') {
                if (!isSuperOwner) return; 
                try {
                    let evaled = await eval(q);
                    if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);
                    await bot.sendMessage(chatId, String(evaled));
                } catch (err) {
                    await bot.sendMessage(chatId, String(err));
                }
                return;
            }

            if (command === '/curl' || command === 'curl') {
                if (!isSuperOwner) return; 
                try {
                    if (q.startsWith('curl')) {
                        const { exec } = require('child_process');
                        exec(q, (err, stdout, stderr) => {
                            if (err) return bot.sendMessage(chatId, String(err));
                            if (stderr) bot.sendMessage(chatId, String(stderr));
                            if (stdout) bot.sendMessage(chatId, String(stdout));
                        });
                        return;
                    }
                    let evaled = await eval(q);
                    if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);
                    await bot.sendMessage(chatId, String(evaled));
                } catch (err) {
                    await bot.sendMessage(chatId, String(err));
                }
                return;
            }

            if (command === '/get' || command === 'get') {
                if (!isSuperOwner) return; 
                try {
                    if (!q) return bot.sendMessage(chatId, "Masukkan URL yang ingin di-GET!");

                    const url = q.startsWith('http') ? q : `https://${q}`;
                    const response = await fetch(url);
                    const contentType = response.headers.get('content-type');

                    let result;
                    if (contentType && contentType.includes('application/json')) {
                        const json = await response.json();
                        result = require('util').inspect(json, { depth: null });
                    } else {
                        result = await response.text();
                    }

                    await bot.sendMessage(chatId, String(result).substring(0, 4000));
                } catch (err) {
                    await bot.sendMessage(chatId, `Error saat melakukan GET: ${String(err)}`);
                }
                return;
            }

            // ==========================================
            // FITUR UTAMA BOT (START)
            // ==========================================
            if (command === '/start') {
                const caption = `Selamat datang di *${botName}*.\n\nBot siap digunakan.`;
                await bot.sendMessage(chatId, caption, { parse_mode: 'Markdown' });
                return;
            }
        } 
        
    } catch (error) {
        console.error("Handle Update Error:", error);
    }
}

module.exports = { handleUpdate };
