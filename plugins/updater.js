
const Config = require('../config');
const config = require('../config');
const diana = require("../events");
const {
	default: makeWASocket,
	useSingleFileAuthState,
	DisconnectReason,
	getContentType
} = require('@adiwajshing/baileys')
const fs = require('fs')
const P = require('pino')

const simpleGit = require('simple-git');
const git = simpleGit();
const exec = require('child_process').exec;
const Heroku = require('heroku-client');
const { PassThrough } = require('stream');
const heroku = new Heroku({ token: Config.HEROKU.API_KEY })
const { state, saveState } = useSingleFileAuthState('./session.json')
const Language = require('../language');
const Lang = Language.getString('updater');
			       

  
		

diana.getCMD({pattern: 'update now$', fromMe: true, deleteCommand: false, desc: "ping pong 📨"}, (async (message, match) => {

 
				
					 await git.fetch();
    var commits = await git.log([Config.BRANCH + '..origin/' + Config.BRANCH]);
    if (commits.total === 0) {
      //  reply('no updates')  
await  message.client.sendMessage(message.jid , { text: Lang.UPDATE }, { quoted: message.data } )
  
    } else {
    if (Config.HEROKU.HEROKU) {
            try {
                var app = await heroku.get('/apps/' + Config.HEROKU.APP_NAME)
            } catch {
                message.client.sendMessage(message.jid , { text: Lang.INVALID_HEROKU + "\n\n" + IN_AF }, { quoted: message.data } );
            }
            message.client.sendMessage(message.jid , { text: Lang.UPDATING }, { quoted: message.data } );

            git.fetch('upstream', Config.BRANCH);
            git.reset('hard', ['FETCH_HEAD']);

            var git_url = app.git_url.replace(
                "https://", "https://api:" + Config.HEROKU.API_KEY + "@"
            )
            
            try {
                await git.addRemote('heroku', git_url);
            } catch { console.log('heroku remote ekli'); }
            await git.push('heroku', config.BRANCH);

            message.client.sendMessage(message.jid , { text: Lang.UPDATED_LOCAL }, { quoted: message.data } );
            message.client.sendMessage(message.jid , { text: Lang.AFTER_UPDATE }, { quoted: message.data } );

        } 
    }
}));
//===============================================CHECK UPDATE=========================================					
	diana.getCMD({pattern: 'update$', fromMe: false, deleteCommand: false, desc: "ping pong 📨"}, (async (message, match) => {
			
					 await git.fetch();
    var commits = await git.log([Config.BRANCH + '..origin/' + Config.BRANCH]);
    if (commits.total === 0) {
       // reply('no updates')    
await  message.client.sendMessage(message.jid , { text: Lang.UPDATE }, { quoted: message.data } )
    } else {

        var newzels = Lang.NEW_UPDATE ;
        commits['all'].map(
            (commit) => {
                newzels += '\n\n' +'🔹 [' + commit.date.substring(0, 10) + ']: ' + commit.message + ' ◁◁' + commit.author_name + '▷▷\n';
            }
        );
      //  reply(ne
await  message.client.sendMessage(message.jid , { text: newzels }, { quoted: message.data } )

    }


}));
