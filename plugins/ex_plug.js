/* Copyright (C) 2020.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
*/


const Axzi = require('../events');
const Config = require('../config');
const axios = require('axios');
const fs = require('fs');
const Db = require('./sql/plugin');
const Language = require('../language');
const Lang = Language.getString('external_plugin');



Axzi.getCMD({pattern: 'install ?(.*)', fromMe: true,desc: Lang.INSTALL_DESC}, (async (message, match) => {
    if (match[1] === '') return await  message.client.sendMessage(message.jid , { text: Lang.NEED_URL }, { quoted: message.data } )
    
    try {
        var url = new URL(match[1]);
    } catch {
        return 
        
        await  message.client.sendMessage(message.jid , { text: Lang.INVALID_URL }, { quoted: message.data } )
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

await  message.client.sendMessage(message.jid , { text: Lang.INVALID_URL }, { quoted: message.data } )
}
    let plugin_name = /pattern: ["'](.*)["'],/g.exec(response.data)
    var plugin_name_temp = response.data.match(/pattern: ["'](.*)["'],/g)?response.data.match(/pattern: ["'](.*)["'],/g).map(e=>e.replace("pattern","").replace(/[^a-zA-Z]/g, "")):"temp"
    try { plugin_name = plugin_name[1].split(" ")[0] } catch { return await message.sendReply("_Invalid plugin. No plugin name found!_") }
    fs.writeFileSync('./plugins/' + plugin_name + '.js', response.data);
    try {
        require('./' + plugin_name);
    } catch (e) {
        fs.unlinkSync('/root/queendianamd/plugins/' + plugin_name + '.js')

await  message.client.sendMessage(message.jid , { text: Lang.INVALID_PLUGIN }, { quoted: message.data } )

    }
    await Db.installPlugin(url, plugin_name);
    await  message.client.sendMessage(message.jid , { text: Lang.INSTALLED }, { quoted: message.data } )
}));
