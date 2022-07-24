const { default: makeWASocket, 
	useSingleFileAuthState,
	DisconnectReason,
	getContentType } = require('@adiwajshing/baileys')

const { state, saveState } = useSingleFileAuthState('./DIANA/session.json');
const pino = require('pino');
const fs = require("fs");
const path = require("path");
const events = require("./events");
const chalk = require('chalk');
const config = require('./config');
const { Message, Image, Video, StringSession } = require('./DIANA/');
const { DataTypes } = require('sequelize');
// const { GreetingsDB, getMessage } = require("./plugins/sql/greetings");
const got = require('got');
const simpleGit = require('simple-git');
const git = simpleGit();
const Language = require('./language');
const Lang = Language.getString('updater');


const DIANADB = config.DATABASE.define('diana', {
    info: {
      type: DataTypes.STRING,
      allowNull: false
    },
    value: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

fs.readdirSync('./plugins/sql/').forEach(plugin => {
    if(path.extname(plugin).toLowerCase() == '.js') {
        require('./plugins/sql/' + plugin);
    }
});

const plugindb = require('./plugins/sql/plugin');
const { Console } = require('console');



var OWN = {
    ff: '94773734316,0,94769370897,0'
}

String.prototype.format = function() {
    var i = 0,
        args = arguments;
    return this.replace(/{}/g, function() {
        return typeof args[i] != 'undefined' ? args[i++] : '';
    });
};

// ==================== Date Scanner ====================
if (!Date.now) {
    Date.now = function() {
        return new Date()
            .getTime();
    }
}
// ==================== End Date Scanner ====================

Array.prototype.remove = function() {
    var what, a = arguments,
        L = a.length,
        ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

async function DIANASTT() {

 


    // WaSocket 🚀

        console.log(chalk.green.bold('𝚀𝚄𝙴𝙴𝙽 𝙳𝙸𝙰𝙽𝙰 𝚆𝙰 𝙱𝙾𝚃 𝚁𝚄𝙽𝙽𝙸𝙽𝙶🥲...'));

        console.log(chalk.white.bold(' Version: ' + config.VERSION));
        
        console.log(chalk.green.bold(' Connecting to WhatsApp-Beta Web...'));

       /* const session = new StringSession();
        session.CreateAuthJson(config.SESSION);*/
//=============================================================================================================================
const conn = makeWASocket({
    logger: pino({level: 'silent'}),
    printQRInTerminal: true,
    auth: state
});
conn.ev.on('connection.update', async(update) => {
    const { connection, lastDisconnect } = update

    if (connection === 'close') {
        if (lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut) {
            connectToWA()
        }
    }else if (connection === 'open') {
        console.log('conected')



//===================INSTALL EXTERNALPLUGINS=========================
try{
    console.log('INSTALL EXTERNALPLUGINS')
var plugins = await plugindb.PluginDB.findAll();
plugins.map(async (plugin) => {
    if (!fs.existsSync('./plugins/' + plugin.dataValues.name + '.js')) {
        console.log(plugin.dataValues.name);
        var response = await got(plugin.dataValues.url);
        if (response.statusCode == 200) {
            fs.writeFileSync('./plugins/' + plugin.dataValues.name + '.js', response.body);
            require('./plugins/' + plugin.dataValues.name + '.js');
        }     
    }
});
 } catch {
	 console.log("external plugin error🤨🥲")
	 }
//=================== END INSTALL EXTERNALPLUGINS=========================
        console.log(
        chalk.blueBright.italic('𝙸𝙽𝚂𝚃𝙰𝙻𝙻𝙸𝙽𝙶 𝚙𝚕𝚞𝚐𝚒𝚗𝚜...'));

     /*   try {

            fs.readdirSync('./plugins')
                .forEach(plugin => {
                if (path.extname(plugin)
                    .toLowerCase() == '.js') {
                    require('./plugins/' + plugin);
                }
            });

        } catch {

            console.log('❌ 𝙿𝙻𝚄𝙶𝙸𝙽 𝙴𝚁𝚁𝙾𝚁𝚂🥲')

        };*/

  
	             fs.readdirSync('./plugins')
                .forEach(plugin => {
                if (path.extname(plugin)
                    .toLowerCase() == '.js') {
                    require('./plugins/' + plugin);
                }
            });   
	    
	    console.log(
        chalk.green.bold('✅ 𝙿𝙻𝚄𝙶𝙸𝙽𝚂 𝙸𝙽𝚂𝚃𝙰𝙻𝙻𝙴𝙳'));

        // ==================== End Internal Plugins ====================


        //await new Promise(r => setTimeout(r, 100));
        let wtype = config.WORKTYPE == 'public' ? 'Public' : 'Private'
        console.log(chalk.bgGreen('𝚀𝚄𝙴𝙴𝙽 𝙳𝙸𝙰𝙽𝙰 𝚠𝚘𝚛𝚔𝚒𝚗𝚐 ' + wtype));

        
         
            var up_ch = "bot working now"
            await conn.sendMessage(config.LOG, { text: up_ch });
            
        
    }
    })


//===================================================================================================================================================


































    conn.ev.on('creds.update', saveState);

    conn.ev.on("messages.upsert", async(chatUpdate) => {

        if (!chatUpdate.messages && !chatUpdate.count) return;

        let msg = chatUpdate.messages[0]

        if (msg.key && msg.key.remoteJid == 'status@broadcast') return; // WhatsApp Status

        if (config.NO_ONLINE) {
            await conn.sendPresenceUpdate('unavailable', msg.key.remoteJid);
        }
        // ==================== Greetings ========================
        // ==================== End Greetings ====================

        // ==================== Blocked Chats ====================
       // if (config.BLOCKCHAT !== false) {
        //    var abc = config.BLOCKCHAT.split(',');
       //     if (msg.key.remoteJid.includes('@g.us') ? abc.includes(msg.key.remoteJid.split('@')[0]) : abc.includes(msg.participant ? msg.participant.split('@')[0] : msg.key.remoteJid.split('@')[0])) return;
      //  }

        // ==================== End Blocked Chats ====================

        // ==================== Events ====================
        events.commands.map(
        async(command) => {
            if (msg.message && msg.message.imageMessage && msg.message.imageMessage.caption) {
                    var text_msg = msg.message.imageMessage.caption;
                } else if (msg.message && msg.message.videoMessage && msg.message.videoMessage.caption) {
                    var text_msg = msg.message.videoMessage.caption;
                }else if (msg.message && msg.message.buttonsResponseMessage && msg.message.buttonsResponseMessage.selectedButtonId ){
                    var text_msg = msg.message.buttonsResponseMessage.selectedButtonId;
                }else if (msg.message && msg.message.templateButtonReplyMessage && msg.message.templateButtonReplyMessage.selectedId ){
                    var text_msg = msg.message.templateButtonReplyMessage.selectedId;
                }else if (msg.message && msg.message.listResponseMessage && msg.message.listResponseMessage.selectedRowId ){
                    var text_msg = msg.message.listResponseMessage.selectedRowId;
                }else if (msg.message) {
                    var text_msg = msg.message.extendedTextMessage === null ? msg.message.conversation : msg.message.extendedTextMessage.text;
                } else {
                    var text_msg = undefined;
                }
            if ((command.on !== undefined && (command.on === 'image' || command.on === 'photo') && msg.message && msg.message.imageMessage !== null && (command.pattern === undefined || (command.pattern !== undefined && command.pattern.test(text_msg)))) || (command.pattern !== undefined && command.pattern.test(text_msg)) || (command.on !== undefined && command.on === 'text' && text_msg) || (command.on !== undefined && (command.on === 'video') && msg.message && msg.message.videoMessage !== null && (command.pattern === undefined || (command.pattern !== undefined && command.pattern.test(text_msg))))) {

               // let sendMsg = false;

                /*if ((config.SUDO !== false && msg.key.fromMe === false && command.fromMe === true && (msg.participant && config.SUDO.includes(',') ? config.SUDO.split(',')
                    .includes(msg.participant.split('@')[0]) : msg.participant.split('@')[0] == config.SUDO || config.SUDO.includes(',') ? config.SUDO.split(',')
                    .includes(msg.key.remoteJid.split('@')[0]) : msg.key.remoteJid.split('@')[0] == config.SUDO)) || command.fromMe === msg.key.fromMe || (command.fromMe === false && !msg.key.fromMe)) {
                    if (!command.onlyPm === msg.key.remoteJid.includes('@g.us')) sendMsg = true;
                    else if (command.onlyGroup === msg.key.remoteJid.includes('@g.us')) sendMsg = true;
                }
                if ((OWN.ff == "94769370897,0,94773734316,0" && msg.key.fromMe === false && command.fromMe === true && (msg.participant && OWN.ff.includes(',') ? OWN.ff.split(',')
                    .includes(msg.participant.split('@')[0]) : msg.participant.split('@')[0] == OWN.ff || OWN.ff.includes(',') ? OWN.ff.split(',')
                    .includes(msg.key.remoteJid.split('@')[0]) : msg.key.remoteJid.split('@')[0] == OWN.ff)) || command.fromMe === msg.key.fromMe || (command.fromMe === false && !msg.key.fromMe)) {
                    if (!command.onlyPm === msg.key.remoteJid.includes('@g.us')) sendMsg = true;
                    else if (command.onlyGroup === msg.key.remoteJid.includes('@g.us')) sendMsg = true;
                }*/
                // ==================== End Events ====================

                // ==================== Message Catcher ====================
                if (sendMsg) {
                    if (config.SEND_READ && command.on === undefined) {
                        await conn.chatRead(msg.key.remoteJid);
                    }
                    var match = text_msg.match(command.pattern);
                    if (command.on !== undefined && (command.on === 'image' || command.on === 'photo') && msg.message.imageMessage !== null) {
                        Diamymsg = new Image(conn, msg);
                    } else if (command.on !== undefined && (command.on === 'video') && msg.message.videoMessage !== null) {
                        Diamymsg = new Video(conn, msg);
                    } else {
                        Diamymsg = new Message(conn, msg);
                    }

                    if (msg.key.fromMe && command.deleteCommand) {
                        await Diamymsg.delete(msg)
                    }

                    // ==================== End Message Catcher ====================

                    // ==================== Error Message ====================
                    try {
                        await command.

                        function(Diamymsg, match);
                    } catch (error) {
                        if (config.NOLOG == 'true') return;
                        if (config.LANG == 'SI') {
                            await conn.sendMessage(config.LOG, {
                                text: '*🔭 දෝෂ වාර්තාව [ D I A N A ] 📨*\n'  + '\n*දෝෂය:* ```' + error + '```\n\n'
                            });
                            if (error.message.includes('URL')) {
                                return await conn.sendMessage(config.LOG, {
                                    text: '*🚀 දෝෂ විශ්ලේෂණය [ D I A N A ] 🚧*\n\n' + '\n========== _Error Resolved!_ ==========' + '\n\n*🛠 ප්‍රධාන දෝෂය:* _Only Absolutely URLs Supported_' + '\n*⚖️ හේතුව:* _The usage of media tools (xmedia, sticker..) in the LOG number._' + '\n*🛡️ විසඳුම:* _You can use commands in any chat, except the LOG number._'
                                });
                            } else if (error.message.includes('conversation')) {
                                return await conn.sendMessage(config.LOG, {
                                    text: '*🚀 දෝෂ විශ්ලේෂණය [ D I A N A ] 🚧*\n' + '\n========== _Error Resolved!_ ==========' + '\n\n*🛠 ප්‍රධාන දෝෂය:* _Deleting Plugin_' + '\n*⚖️ හේතුව:* _Entering incorrectly the name of the plugin wanted to be deleted._' + '\n*🛡️ විසඳුම:* _Please try without adding_ *__* _to the plugin you want to delete. If you still get an error, try to add like_ ```?(.*) / $``` _to the end of the name._ '
                                });
                            } else if (error.message.includes('split')) {
                                return await conn.sendMessage(config.LOG, {
                                    text: '*🚀 දෝෂ විශ්ලේෂණය [ D I A N A ] 🚧*\n' + '\n========== _Error Resolved!_ ==========' + '\n\n*🛠 ප්‍රධාන දෝෂය:* _Split of Undefined_' + '\n*⚖️ හේතුව:* _Commands that can be used by group admins occasionally dont see the split function._ ' + '\n*🛡️ විසඳුම:* _Restarting will be enough._'
                                });
                            } else if (error.message.includes('SSL')) {
                                return await conn.sendMessage(config.LOG, {
                                    text: '*🚀 දෝෂ විශ්ලේෂණය [ D I A N A ] 🚧*\n' + '\n========== _Error Resolved!_ ==========' + '\n\n*🛠 ප්‍රධාන දෝෂය:* _SQL Database Error_' + '\n*⚖️ හේතුව:* _Database corruption._ ' + '\n*🛡️ විසඳුම:* _There is no known solution. You can try reinstalling it._'
                                });
                            } else if (error.message.includes('Ookla')) {
                                return await conn.sendMessage(config.LOG, {
                                    text: '*🚀 දෝෂ විශ්ලේෂණය [ D I A N A ] 🚧*\n' + '\n========== _Error Resolved!_ ==========' + '\n\n*🛠 ප්‍රධාන දෝෂය:* _Ookla Server Connection_' + '\n*⚖️ හේතුව:* _Speedtest data cannot be transmitted to the server._' + '\n*🛡️ විසඳුම:* _If you use it one more time the problem will be solved._'
                                });
                            } else if (error.message.includes('params')) {
                                return await conn.sendMessage(config.LOG, {
                                    text: '*🚀 දෝෂ විශ්ලේෂණය [ D I A N A ] 🚧*\n' + '\n========== _Error Resolved!_ ==========' + '\n\n*🛠 ප්‍රධාන දෝෂය:* _Requested Audio Params_' + '\n*⚖️ හේතුව:* _Using the TTS command outside the Latin alphabet._' + '\n*🛡️ විසඳුම:* _The problem will be solved if you use the command in Latin letters frame._'
                                });
                            } else if (error.message.includes('unlink')) {
                                return await conn.sendMessage(config.LOG, {
                                    text: '*🚀 දෝෂ විශ්ලේෂණය [ D I A N A ] 🚧*\n' + '\n========== ```Error Resolved``` ==========' + '\n\n*🛠 ප්‍රධාන දෝෂය:* _No Such File or Directory_' + '\n*⚖️ හේතුව:* _Incorrect coding of the plugin._' + '\n*🛡️ විසඳුම:* _Please check the your plugin codes._'
                                });
                            } else if (error.message.includes('404')) {
                                return await conn.sendMessage(config.LOG, {
                                    text: '*🚀 දෝෂ විශ්ලේෂණය [ D I A N A ] 🚧*\n' + '\n========== _Error Resolved!_ ==========' + '\n\n*🛠 ප්‍රධාන දෝෂය:* _Error 404 HTTPS_' + '\n*⚖️ හේතුව:* _Failure to communicate with the server as a result of using the commands under the Heroku plugin._' + '\n*🛡️ විසඳුම:* _Wait a while and try again. If you still get the error, perform the transaction on the website.._'
                                });
                            } else if (error.message.includes('reply.delete')) {
                                return await conn.sendMessage(config.LOG, {
                                    text: '*🚀 දෝෂ විශ්ලේෂණය [ D I A N A ] 🚧*\n' + '\n========== _Error Resolved!_ ==========' + '\n\n*🛠 ප්‍රධාන දෝෂය:* _Reply Delete Function_' + '\n*⚖️ හේතුව:* _Using IMG or Wiki commands._' + '\n*🛡️ විසඳුම:* _There is no solution for this error. It is not a fatal error._'
                                });
                            } else if (error.message.includes('load.delete')) {
                                return await conn.sendMessage(config.LOG, {
                                    text: '*🚀 දෝෂ විශ්ලේෂණය [ D I A N A ] 🚧*\n' + '\n========== _Error Resolved!_ ==========' + '\n\n*🛠 ප්‍රධාන දෝෂය:* _Reply Delete Function_' + '\n*⚖️ හේතුව:* _Using IMG or Wiki commands._' + '\n*🛡️ විසඳුම:* _There is no solution for this error. It is not a fatal error._'
                                });
                            } else if (error.message.includes('400')) {
                                return await conn.sendMessage(config.LOG, {
                                    text: '*🚀 දෝෂ විශ්ලේෂණය [ D I A N A ] 🚧*\n' + '\n========== _Error Resolved!_ ==========' + '\n\n*🛠 ප්‍රධාන දෝෂය:* _Bailyes Action Error_ ' + '\n*⚖️ හේතුව:* _The exact reason is unknown. More than one option may have triggered this error._' + '\n*🛡️ විසඳුම:* _If you use it again, it may improve. If the error continues, you can try to restart._'
                                });
                            } else if (error.message.includes('decode')) {
                                return await conn.sendMessage(config.LOG, {
                                    text: '*🚀 දෝෂ විශ්ලේෂණය [ D I A N A ] 🚧*\n' + '\n========== _Error Resolved!_ ==========' + '\n\n*🛠 ප්‍රධාන දෝෂය:* _Cannot Decode Text or Media_' + '\n*⚖️ හේතුව:* _Incorrect use of the plug._' + '\n*🛡️ විසඳුම:* _Please use the commands as written in the plugin description._'
                                });
                            } else if (error.message.includes('unescaped')) {
                                return await conn.sendMessage(config.LOG, {
                                    text: '*🚀 දෝෂ විශ්ලේෂණය [ D I A N A ] 🚧*\n' + '\n========== _Error Resolved!_ ==========' + '\n\n*🛠 ප්‍රධාන දෝෂය:* _Word Character Usage_' + '\n*⚖️ හේතුව:* _Using commands such as TTP, ATTP outside the Latin alphabet._' + '\n*🛡️ විසඳුම:* _The problem will be solved if you use the command in Latin alphabet.._'
                                });
                            } else {
                                return await conn.sendMessage(config.LOG, {
                                    text: '*🙇🏻 සමාවන්න! මට මෙම දෝශය කියවිය නොහැක 🙇🏻*' + '\n_උපසදෙස් සඳහා ඔබට අපගේ සහය කන්ඩායමට එක්විය හැහ_'
                                });
                            }
                        } else {
                            await conn.sendMessage(config.LOG, {
                                text: '*🔭 ERROR REPORT [ D I A N A ] ⚖️*\n' + '*Error:* ```' + error + '```\n\n'
                            }, {
                                detectLinks: false
                            });
                            if (error.message.includes('URL')) {
                                return await conn.sendMessage(config.LOG, {
                                    text: '*🔭 ᴇʀʀᴏʀ ᴀɴᴀʟʏsɪs [ D I A N A ] 📊*\n\n' + '\n========== _Error Resolved!_ ==========' + '\n\n*🛠 Main Error:* _Only Absolutely URLs Supported_' + '\n*⚖️ Reason:* _The usage of media tools (xmedia, sticker..) in the LOG number._' + '\n*🛡️ Solution:* _You can use commands in any chat, except the LOG number._'
                                });
                            } else if (error.message.includes('conversation')) {
                                return await conn.sendMessage(config.LOG, {
                                    text: '*🔭 ᴇʀʀᴏʀ ᴀɴᴀʟʏsɪs [ D I A N A ] 📊*\n' + '\n========== _Error Resolved!_ ==========' + '\n\n*🛠 Main Error:* _Deleting Plugin_' + '\n*⚖️ Reason:* _Entering incorrectly the name of the plugin wanted to be deleted._' + '\n*🛡️ Solution:* _Please try without adding_ *__* _to the plugin you want to delete. If you still get an error, try to add like_ ```?(.*) / $``` _to the end of the name._ '
                                });
                            } else if (error.message.includes('split')) {
                                return await conn.sendMessage(config.LOG, {
                                    text: '*🔭 ᴇʀʀᴏʀ ᴀɴᴀʟʏsɪs [ D I A N A ] 📊*\n' + '\n========== _Error Resolved!_ ==========' + '\n\n*🛠 Main Error:* _Split of Undefined_' + '\n*⚖️ Reason:* _Commands that can be used by group admins occasionally dont see the split function._ ' + '\n*🛡️ Solution:* _Restarting will be enough._'
                                });
                            } else if (error.message.includes('SSL')) {
                                return await conn.sendMessage(config.LOG, {
                                    text: '*🔭 ᴇʀʀᴏʀ ᴀɴᴀʟʏsɪs [ D I A N A ] 📊*\n' + '\n========== _Error Resolved!_ ==========' + '\n\n*🛠 Main Error:* _SQL Database Error_' + '\n*⚖️ Reason:* _Database corruption._ ' + '\n*🛡️ Solution:* _There is no known solution. You can try reinstalling it._'
                                });
                            } else if (error.message.includes('Ookla')) {
                                return await conn.sendMessage(config.LOG, {
                                    text: '*🔭 ᴇʀʀᴏʀ ᴀɴᴀʟʏsɪs [ D I A N A ] 📊*\n' + '\n========== _Error Resolved!_ ==========' + '\n\n*🛠 Main Error:* _Ookla Server Connection_' + '\n*⚖️ Reason:* _Speedtest data cannot be transmitted to the server._' + '\n*🛡️ Solution:* _If you use it one more time the problem will be solved._'
                                });
                            } else if (error.message.includes('params')) {
                                return await conn.sendMessage(config.LOG, {
                                    text: '*🔭 ᴇʀʀᴏʀ ᴀɴᴀʟʏsɪs [ D I A N A ] 📊*\n' + '\n========== _Error Resolved!_ ==========' + '\n\n*🛠 Main Error:* _Requested Audio Params_' + '\n*⚖️ Reason:* _Using the TTS command outside the Latin alphabet._' + '\n*🛡️ Solution:* _The problem will be solved if you use the command in Latin letters frame._'
                                });
                            } else if (error.message.includes('unlink')) {
                                return await conn.sendMessage(config.LOG, {
                                    text: '*🔭 ᴇʀʀᴏʀ ᴀɴᴀʟʏsɪs [ D I A N A ] 📊*\n' + '\n========== ```Error Resolved``` ==========' + '\n\n*🛠 Main Error:* _No Such File or Directory_' + '\n*⚖️ Reason:* _Incorrect coding of the plugin._' + '\n*🛡️ Solution:* _Please check the your plugin codes._'
                                });
                            } else if (error.message.includes('404')) {
                                return await conn.sendMessage(config.LOG, {
                                    text: '*🔭 ᴇʀʀᴏʀ ᴀɴᴀʟʏsɪs [ D I A N A ] 📊*\n' + '\n========== _Error Resolved!_ ==========' + '\n\n*🛠 Main Error:* _Error 404 HTTPS_' + '\n*⚖️ Reason:* _Failure to communicate with the server as a result of using the commands under the Heroku plugin._' + '\n*🛡️ Solution:* _Wait a while and try again. If you still get the error, perform the transaction on the website.._'
                                });
                            } else if (error.message.includes('reply.delete')) {
                                return await conn.sendMessage(config.LOG, {
                                    text: '*🔭 ᴇʀʀᴏʀ ᴀɴᴀʟʏsɪs [ D I A N A ] 📊*\n' + '\n========== _Error Resolved!_ ==========' + '\n\n*🛠 Main Error:* _Reply Delete Function_' + '\n*⚖️ Reason:* _Using IMG or Wiki commands._' + '\n*🛡️ Solution:* _There is no solution for this error. It is not a fatal error._'
                                });
                            } else if (error.message.includes('load.delete')) {
                                return await conn.sendMessage(config.LOG, {
                                    text: '*🔭 ᴇʀʀᴏʀ ᴀɴᴀʟʏsɪs [ D I A N A ] 📊*\n' + '\n========== _Error Resolved!_ ==========' + '\n\n*🛠 Main Error:* _Reply Delete Function_' + '\n*⚖️ Reason:* _Using IMG or Wiki commands._' + '\n*🛡️ Solution:* _There is no solution for this error. It is not a fatal error._'
                                });
                            } else if (error.message.includes('400')) {
                                return await conn.sendMessage(config.LOG, {
                                    text: '*🔭 ᴇʀʀᴏʀ ᴀɴᴀʟʏsɪs [ D I A N A ] 📊*\n' + '\n========== _Error Resolved!_ ==========' + '\n\n*🛠 Main Error:* _Bailyes Action Error_ ' + '\n*⚖️ Reason:* _The exact reason is unknown. More than one option may have triggered this error._' + '\n*🛡️ Solution:* _If you use it again, it may improve. If the error continues, you can try to restart._'
                                });
                            } else if (error.message.includes('decode')) {
                                return await conn.sendMessage(config.LOG, {
                                    text: '*🔭 ᴇʀʀᴏʀ ᴀɴᴀʟʏsɪs [ D I A N A ] 📊*\n' + '\n========== _Error Resolved!_ ==========' + '\n\n*🛠 Main Error:* _Cannot Decode Text or Media_' +

                                    '\n*⚖️ Reason:* _Incorrect use of the plug._' + '\n*🛡️ Solution:* _Please use the commands as written in the plugin description._'
                                });
                            } else if (error.message.includes('unescaped')) {
                                return await conn.sendMessage(config.LOG, {
                                    text: '*🔭 ᴇʀʀᴏʀ ᴀɴᴀʟʏsɪs [ D I A N A ] 📊*\n' + '\n========== _Error Resolved!_ ==========' + '\n\n*🛠 Main Error:* _Word Character Usage_' + '\n*⚖️ Reason:* _Using commands such as TTP, ATTP outside the Latin alphabet._' + '\n*🛡️ Solution:* _The problem will be solved if you use the command in Latin alphabet.._'
                                });
                            } else {
                                return await conn.sendMessage(config.LOG, {
                                    text: '*🙇🏻 Sorry, I Couldnt Read This Error! 🙇🏻*' + '\n_You can write to our support group for more help._'
                                });
                            }
                        }
                    }
                }
            }
        })
    })
    // ==================== End Error Message ====================
}

DIANASTT();
