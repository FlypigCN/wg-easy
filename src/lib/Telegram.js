'use strict';

const TelegramBot = require('node-telegram-bot-api');

const {
    TG_TOKEN,
    TG_CHAT_ID,
} = require('../config');

module.exports = class Telegram { 
    constructor() {
        if (TG_TOKEN) {
            this.botEngine = new TelegramBot(TG_TOKEN);
        }
    }

    async notifyText(text) {
        if (this.botEngine && TG_CHAT_ID && text) {
            this.botEngine.sendMessage(TG_CHAT_ID, text)
            .then(async (value) => {}).catch(console.error)
        }
    }
};