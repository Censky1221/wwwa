require('./owner-dan-menu')
const { default: WADefault, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, generateForwardMessageContent, prepareWAMessageMedia, generateWAMessageFromContent, generateMessageID, downloadContentFromMessage, makeInMemoryStore, jidDecode, proto } = require("@adiwajshing/baileys")
const pino = require('pino')
const { Boom } = require('@hapi/boom')
const fs = require('fs')
const axios = require('axios')
const FileType = require('file-type')
const PhoneNumber = require('awesome-phonenumber')
const { smsg, getBuffer, fetchJson } = require('./lib/simple')
const fetch = require('node-fetch')
const {
   imageToWebp,
   videoToWebp,
   writeExifImg,
   writeExifVid,
   writeExif
} = require('./lib/exif')
const { isSetClose,
    addSetClose,
    removeSetClose,
    changeSetClose,
    getTextSetClose,
    isSetDone,
    addSetDone,
    removeSetDone,
    changeSetDone,
    getTextSetDone,
    isSetLeft,
    addSetLeft,
    removeSetLeft,
    changeSetLeft,
    getTextSetLeft,
    isSetOpen,
    addSetOpen,
    removeSetOpen,
    changeSetOpen,
    getTextSetOpen,
    isSetProses,
    addSetProses,
    removeSetProses,
    changeSetProses,
    getTextSetProses,
    isSetWelcome,
    addSetWelcome,
    removeSetWelcome,
    changeSetWelcome,
    getTextSetWelcome,
    addSewaGroup,
    getSewaExpired,
    getSewaPosition,
    expiredCheck,
    checkSewaGroup
} = require("./lib/store")

let set_welcome_db = JSON.parse(fs.readFileSync('./database/set_welcome.json'));
let set_left_db = JSON.parse(fs.readFileSync('./database/set_left.json'));
let _welcome = JSON.parse(fs.readFileSync('./database/welcome.json'));
let _left = JSON.parse(fs.readFileSync('./database/left.json'));
let set_proses = JSON.parse(fs.readFileSync('./database/set_proses.json'));
let set_done = JSON.parse(fs.readFileSync('./database/set_done.json'));
let set_open = JSON.parse(fs.readFileSync('./database/set_open.json'));
let set_close = JSON.parse(fs.readFileSync('./database/set_close.json'));
let sewa = JSON.parse(fs.readFileSync('./database/sewa.json'));
let setpay = JSON.parse(fs.readFileSync('./database/pay.json'));
let opengc = JSON.parse(fs.readFileSync('./database/opengc.json'));
let antilink = JSON.parse(fs.readFileSync('./database/antilink.json'));
let antiwame = JSON.parse(fs.readFileSync('./database/antiwame.json'));
let antilink2 = JSON.parse(fs.readFileSync('./database/antilink2.json'));
let antiwame2 = JSON.parse(fs.readFileSync('./database/antiwame2.json'));
let db_respon_list = JSON.parse(fs.readFileSync('./database/list.json'));
const {
   toBuffer,
   toDataURL
} = require('qrcode')
const express = require('express')
let app = express()
const {
   createServer
} = require('http')
let server = createServer(app)
let _qr = 'invalid'
let PORT = process.env.PORT
const path = require('path')

const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) })

async function Botstarted() {
    const { state, saveCreds } = await useMultiFileAuthState(`./${sessionName}`)

    const alpha = WADefault({
        logger: pino({ level: 'silent' }),
        printQRInTerminal: true,
        browser: ['BOT STORE','Safari','1.0.0'],
        patchMessageBeforeSending: (message) => {

                const requiresPatch = !!(
                  message.buttonsMessage
              	  || message.templateMessage
              		|| message.listMessage
                );
                if (requiresPatch) {
                    message = {
                        viewOnceMessage: {
                            message: {
                                messageContextInfo: {
                                    deviceListMetadataVersion: 2,
                                    deviceListMetadata: {},
                                },
                                ...message,
                            },
                        },
                    };
                }
                return message;
    },
        auth: state
    })

    store.bind(alpha.ev)

    alpha.ev.on('messages.upsert', async chatUpdate => {
        //console.log(JSON.stringify(chatUpdate, undefined, 2))
        try {
        mek = chatUpdate.messages[0]
        if (!mek.message) return
        mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
        if (mek.key && mek.key.remoteJid === 'status@broadcast') return
        if (!alpha.public && !mek.key.fromMe && chatUpdate.type === 'notify') return
        if (mek.key.id.startsWith('BAE5') && mek.key.id.length === 16) return
        m = smsg(alpha, mek, store)
        require("./store")(alpha, m, chatUpdate, store, opengc, setpay, antilink, antiwame, antilink2, antiwame2, set_welcome_db, set_left_db, set_proses, set_done, set_open, set_close, sewa, _welcome, _left, db_respon_list)
        } catch (err) {
            console.log(err)
        }
    })
    setInterval(() => {
        for (let i of Object.values(opengc)) {
            if (Date.now() >= i.time) {
                alpha.groupSettingUpdate(i.id, "not_announcement")
                .then((res) =>
                alpha.sendMessage(i.id, { text: `Sukses, group telah dibuka` }))
                .catch((err) =>
                alpha.sendMessage(i.id, { text: 'Error' }))
                delete opengc[i.id]
                fs.writeFileSync('./database/opengc.json', JSON.stringify(opengc))
            }
        }
    }, 1000)    

    alpha.ev.on('group-participants.update', async (anu) => {
        const isWelcome = _welcome.includes(anu.id)
        const isLeft = _left.includes(anu.id)
        try {
            let metadata = await alpha.groupMetadata(anu.id)
            let participants = anu.participants
            const groupName = metadata.subject
  		      const groupDesc = metadata.desc
            for (let num of participants) {
                try {
                    ppuser = await alpha.profilePictureUrl(num, 'image')
                } catch {
                    ppuser = 'https://telegra.ph/file/c3f3d2c2548cbefef1604.jpg'
                }

                try {
                    ppgroup = await alpha.profilePictureUrl(anu.id, 'image')
                } catch {
                    ppgroup = 'https://telegra.ph/file/c3f3d2c2548cbefef1604.jpg'
                }
                if (anu.action == 'add' && isWelcome) {
                  console.log(anu)
                    if (isSetWelcome(anu.id, set_welcome_db)) {               	
                        var get_teks_welcome = await getTextSetWelcome(anu.id, set_welcome_db)
                    var replace_pesan = (get_teks_welcome.replace(/@user/gi, `@${num.split('@')[0]}`))
                        var full_pesan = (replace_pesan.replace(/@group/gi, groupName).replace(/@desc/gi, groupDesc))
                        alpha.sendMessage(anu.id, { image: { url: ppuser }, mentions: [num], caption: `${full_pesan}` })
                       } else {
                       	alpha.sendMessage(anu.id, { image: { url: ppuser }, mentions: [num], caption: `Halo @${num.split("@")[0]}, Welcome To ${metadata.subject}` })
                      }
                } else if (anu.action == 'remove' && isLeft) {
                	console.log(anu)
                  if (isSetLeft(anu.id, set_left_db)) {            	
                        var get_teks_left = await getTextSetLeft(anu.id, set_left_db)
                        var replace_pesan = (get_teks_left.replace(/@user/gi, `@${num.split('@')[0]}`))
                        var full_pesan = (replace_pesan.replace(/@group/gi, groupName).replace(/@desc/gi, groupDesc))
                      alpha.sendMessage(anu.id, { image: { url: ppuser }, mentions: [num], caption: `${full_pesan}` })
                       } else {
                       	alpha.sendMessage(anu.id, { image: { url: ppuser }, mentions: [num], caption: `Sayonara @${num.split("@")[0]}` })
                        }
                        } else if (anu.action == 'promote') {
                    alpha.sendMessage(anu.id, { image: { url: ppuser }, mentions: [num], caption: `@${num.split('@')[0]} sekaran menjadi admin grup ${metadata.subject}` })
                } else if (anu.action == 'demote') {
                    alpha.sendMessage(anu.id, { image: { url: ppuser }, mentions: [num], caption: `@${num.split('@')[0]} bukan admin grup ${metadata.subject} lagi` })
              }
            }
        } catch (err) {
            console.log(err)
        }
    })
	
    // Setting
    alpha.decodeJid = (jid) => {
        if (!jid) return jid
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {}
            return decode.user && decode.server && decode.user + '@' + decode.server || jid
        } else return jid
    }
    
    alpha.ev.on('contacts.update', update => {
        for (let contact of update) {
            let id = alpha.decodeJid(contact.id)
            if (store && store.contacts) store.contacts[id] = { id, name: contact.notify }
        }
    })

    alpha.getName = (jid, withoutContact  = false) => {
        id = alpha.decodeJid(jid)
        withoutContact = alpha.withoutContact || withoutContact 
        let v
        if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
            v = store.contacts[id] || {}
            if (!(v.name || v.subject)) v = alpha.groupMetadata(id) || {}
            resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
        })
        else v = id === '0@s.whatsapp.net' ? {
            id,
            name: 'WhatsApp'
        } : id === alpha.decodeJid(alpha.user.id) ?
            alpha.user :
            (store.contacts[id] || {})
            return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
    }
    
    alpha.sendContact = async (jid, kon, quoted = '', opts = {}) => {
	let list = []
	for (let i of kon) {
	    list.push({
	    	displayName: await alpha.getName(i + '@s.whatsapp.net'),
	    	vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await alpha.getName(i + '@s.whatsapp.net')}\nFN:${await alpha.getName(i + '@s.whatsapp.net')}\nitem1.TEL;waid=${i}:${i}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
	    })
	}
	alpha.sendMessage(jid, { contacts: { displayName: `${list.length} Kontak`, contacts: list }, ...opts }, { quoted })
    }
    
    alpha.public = true

    alpha.serializeM = (m) => smsg(alpha, m, store)

    alpha.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update	  
              if (qr) {
         app.use(async (req, res) => {
            res.setHeader('content-type', 'image/png')
            res.end(await toBuffer(qr))
         })
         app.use(express.static(path.join(__dirname, 'views')))
         app.listen(PORT, () => {
            console.log('Silahkan scan qr di bagian webview')
         })
      }
        if (connection === 'close') {
        let reason = new Boom(lastDisconnect?.error)?.output.statusCode
            if (reason === DisconnectReason.badSession) { console.log(`Bad Session File, Please Delete Session and Scan Again`); alpha.logout(); }
            else if (reason === DisconnectReason.connectionClosed) { console.log("Connection closed, reconnecting...."); Botstarted(); }
            else if (reason === DisconnectReason.connectionLost) { console.log("Connection Lost from Server, reconnecting..."); Botstarted(); }
            else if (reason === DisconnectReason.connectionReplaced) { console.log("Connection Replaced, Another New Session Opened, reconnecting..."); Botstarted(); }
            else if (reason === DisconnectReason.loggedOut) { console.log(`Device Logged Out, Please Scan Again And Run.`); alpha.logout(); }
            else if (reason === DisconnectReason.restartRequired) { console.log("Restart Required, Restarting..."); Botstarted(); }
            else if (reason === DisconnectReason.timedOut) { console.log("Connection TimedOut, Reconnecting..."); Botstarted(); }
            else if (reason === DisconnectReason.Multidevicemismatch) { console.log("Multi device mismatch, please scan again"); alpha.logout(); }
            else alpha.end(`Unknown DisconnectReason: ${reason}|${connection}`)
        }
        if (update.connection == "open" || update.receivedPendingNotifications == "true") {
         await store.chats.all()
         console.log(`Connected to = ` + JSON.stringify(alpha.user, null, 2))
         //alpha.sendMessage("77777777777" + "@s.whatsapp.net", {text:"", "contextInfo":{"expiration": 86400}})
      }
    })

    alpha.ev.on('creds.update', saveCreds)

  alpha.sendText = (jid, text, quoted = '', options) => alpha.sendMessage(jid, { text: text, ...options }, { quoted, ...options })

alpha.downloadMediaMessage = async (message) => {
      let mime = (message.msg || message).mimetype || ''
      let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
      const stream = await downloadContentFromMessage(message, messageType)
      let buffer = Buffer.from([])
      for await (const chunk of stream) {
         buffer = Buffer.concat([buffer, chunk])
      }

      return buffer
   }
   
alpha.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {

        let quoted = message.msg ? message.msg : message

        let mime = (message.msg || message).mimetype || ''
        let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
        const stream = await downloadContentFromMessage(quoted, messageType)
        let buffer = Buffer.from([])
        for await(const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }
	let type = await FileType.fromBuffer(buffer)
        trueFileName = attachExtension ? (filename + '.' + type.ext) : filename
        // save to file
        await fs.writeFileSync(trueFileName, buffer)
        return trueFileName
    }
alpha.sendTextWithMentions = async (jid, text, quoted, options = {}) => alpha.sendMessage(jid, {
      text: text,
      mentions: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net'),
      ...options
   }, {
      quoted
   })

   alpha.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
      let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,` [1], 'base64') : /^https?:\/\//.test(path) ? await (await fetch(path)).buffer() : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
      let buffer
      if (options && (options.packname || options.author)) {
         buffer = await writeExifImg(buff, options)
      } else {
         buffer = await imageToWebp(buff)
      }

      await alpha.sendMessage(jid, {
         sticker: {
            url: buffer
         },
         ...options
      }, {
         quoted
      })
      return buffer
   }

   /**
    * 
    * @param {*} jid 
    * @param {*} path 
    * @param {*} quoted 
    * @param {*} options 
    * @returns 
    */
   alpha.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
      let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,` [1], 'base64') : /^https?:\/\//.test(path) ? await getBuffer(path) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
      let buffer
      if (options && (options.packname || options.author)) {
         buffer = await writeExifVid(buff, options)
      } else {
         buffer = await videoToWebp(buff)
      }

      await alpha.sendMessage(jid, {
         sticker: {
            url: buffer
         },
         ...options
      }, {
         quoted
      })
      return buffer
   }

    return alpha
}


Botstarted()