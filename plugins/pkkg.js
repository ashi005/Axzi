const evt = require('../events');
const Config = require('../config');
const axios = require('axios');
const fs = require('fs');
const Db = require('./sql/plugin');
const Language = require('../language');
const Lang = Language.getString('_plugin');

evt.getCMD({pattern: 'pkkg$', fromMe: true }, (async (message, match) => {
  
    match = match[1]!==""?match[1]:message.reply_message.text
    if (!match || !/\bhttps?:\/\/\S+/gi.test(match)) return ///await message.sendMessage(Lang.NEED_URL)
    let links = match.match(/\bhttps?:\/\/\S+/gi);
    for (let link of links){
    try {
        var url = new URL(link);
    } catch {
        return //await message.sendMessage(Lang.INVALID_URL);
    }
    if (url.host === 'gist.github.com') {
        url.host = 'gist.githubusercontent.com';
        url = url.toString() + '/raw'
    } else {
        url = url.toString()
    }
    try {
        var response = await axios(url+"?timestamp="+new Date());
    } catch {
        return //await message.sendMessage(Lang.INVALID_URL)
    }
    let plugin_name = /pattern: ["'](.*)["'],/g.exec(response.data)
    //var plugin_name_temp = response.data.match(/pattern: ["'](.*)["'],/g)?response.data.match(/pattern: ["'](.*)["'],/g).map(e=>e.replace("pattern","").replace(/[^a-zA-Z]/g, "")):"temp"
    try { plugin_name = plugin_name[1].split(" ")[0] } catch { return await message.client.sendMessage(message.jid, { text:"_Invalid plugin. No plugin name found!_"}) }
    fs.writeFileSync('./plugins/' + plugin_name + '.js', response.data);
    try {
        require('./' + plugin_name);
    } catch (e) {
        fs.unlinkSync('/root/queendianamd/' + plugin_name + '.js')
        return //await message.client.sendMessage(message.jid, { text: Lang.INVALID_PLUGIN + e });
    }
    await Db.installPlugin(url, plugin_name);
   // await //message.client.sendMessage(message.jid, { text: 'plugin installed' });
}
}));
