const fs = require('fs');
const simple = require('./lib/simple')
const { WAConnection: _WAConnection, MessageType, compressImage } = require("@adiwajshing/baileys")
const WAConnection = simple.WAConnection(_WAConnection)
const util = require('util')
const syntaxErr = require('syntax-error')
const { exec } = require('child_process')
const axios = require('axios')
const yts = require('yt-search')
const fetch = require('node-fetch')
const fetch = require('node-fetch')
const chalk = require('chalk')
const config = require('./config.json')
let { yta, ytv } = require('../lib/y2mate');

module.exports = ws = async (ws, m) => {
	try {
	if (!m.hasNewMessage) return
    	if (!m.messages) return
    	if (!m) return
    	m = m.messages.all()[0];
    	simple.smsg(ws, m)
    	if (m.text && typeof m.text !== 'string') return
    	let { quoted, mentionedJid, sender, isGroup, text, pushname, fromMe, mtype } = m
    	command = text.replace(config.prefix, '').trim().split(/ +/).shift().toLowerCase()
    	const args = text.trim().split(/ +/).slice(1);
    	const query = args.join(' ')
    	const isCmd = text.startsWith(config.prefix)

    	const isOwner = config.ownerNumber.includes(sender)

    	if (isCmd) {console.log(chalk.yellow('[ CMD ] '), chalk.green(command))}

    switch(command) {
        case 'menu':
        case 'help':
                    var mani = `[SIMPLE WHATSAPP BOT]

Hello ${pushname}!
I am simple whatsapp bot
And
I was coded yourself

All Commands:-
${config.prefix}menu
${config.prefix}help
${config.prefix}sticker
${config.prefix}play
${config.prefix}yta
${config.prefix}ytv
${config.prefix}eval

Source code : https://github.com/Adiixyz/simplebot/

Thats all!`
await ws.send2ButtonLoc(m.chat, await (await fetch('https://telegra.ph/file/84df649016403fadbdb86.jpg')).buffer(), mani, '© Adii', 'Simple', `.`, 'Bot', `.`, m)
	   
        break

	case 'sticker':
	case 'stiker':
	case 's':
		let q = m.quoted ? m.quoted : m
		let mime = (q.msg || q).mimetype || ''
		if (/image/.test(mime)) {
		   let img = await q.download()
		if (!img) m.reply(`balas gambar dengan caption *${config.prefix}sticker*`)
		   ws.sendSticker(m.chat, img, 'UwU', `${pushname}`)
		} else if (/video/.test(mime)) { 
		   let img = await q.download()
		if (!img) throw `balas gambar dengan caption */sticker*`
		   ws.sendSticker(m.chat, img, 'UwU', `${pushname}`)
		} else {
		   m.reply(`balas gambar dengan caption *${config.prefix}sticker*`)
		}
        break

	case 'play':
		if (!query) return m.reply(`Use ${config.prefix}play <query>\ncontoh ${config.prefix}play 10000`)
	        try { 
		let result = await yts(query)
		let vid = result.all.find(video => video.seconds < 3800)
    		if (!vid) return m.reply('Video/Audio Tidak ditemukan')
		let caption =
    		`*• Title:* ${vid.title}\n` +
    		`*• Duration:* ${vid.timestamp}\n` +
    		`*• Uploaded:* ${vid.ago}\n` +
    		`*• Video ID:* ${vid.videoId}\n`+
    		`*• Url:* ${vid.url}\n`+
    		`pilih salah satu format dibawah ini!`;
		    await ws.send2ButtonLoc(m.chat, await (await fetch(vid.image)).buffer(), caption, '© Adii', 'Video', `.ytv ${vid.url}`, 'Audio', `.yta ${vid.url}`, m)
	    	} catch(e) {
		 _err(e)
		}
	break		  

    	case 'eval':
	    if (!isOwner) return
		 let _syntax = ''
		 let _return
		 let _text = `;(async () => {${(/^=/.test('/') ? 'return ' : '') + query}})()`
		 try {
	    	_return = await eval(_text)
		}catch(e) {
		let err = await syntaxErr(_text)
		if (err) _syntax = err + '\n\n'
		_return = e
		}finally {
		m.reply(_syntax + util.format(_return))
		}
	break
	}
	
	//Button response
	if (mtype === 'buttonsResponseMessage') {
	  let buttonId = m.msg.selectedButtonId
	  const buttonCmd = buttonId.replace('>', '').trim().split(/ +/).shift().toLowerCase()
	  switch (buttonCmd) {
		case 'yta':
     		    m.reply('Tunggu sedang di proses')
      		    var res = await yta(buttonId.slice(5))
     		    await cmd.sendFile(m.chat, res.dl_link, `${res.title}.mp3`, '', m, false, { asDocument: true})
     	        break
    		case 'ytv':
      		    m.reply('Tunggu sedang di proses')
      	            var res = await ytv(buttonId.slice(5))
      		    await cmd.sendFile(m.chat, res.dl_link, `${res.title}.mp4`, '', m, false, { asDocument: true})
               break
	  }
	}
	  
		
	function _err(e) {
      	if (typeof e == 'string')
        ws.reply(m.chat, e, m)
      	else
        ws.reply(m.chat, config.msg.error, m)
        console.log(chalk.red('Error'+ e)
    	}
		
	} catch (err) {
		console.log(err)
	}
}
