const evt = require('../events');

evt.getCMD({pattern: 'gethi$', fromMe: false, deleteCommand: false, desc: "ping pong 📨"}, (async (message, match) => {

 await message.client.sendMessage(message.jid, { text: 'hi hello' }) 

}));
