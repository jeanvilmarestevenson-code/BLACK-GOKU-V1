// web.js - BLACK GOKU V111 - WELCOME/BYE AVEC PP + IMAGE BLANCHE + H24 + APOCALYPSE SANS KICK + WEB STYLÉ
const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, downloadMediaMessage } = require('@whiskeysockets/baileys')
const P = require('pino')
const fs = require('fs')
const express = require('express')
const NodeCache = require('node-cache')
const https = require('https')
const http = require('http')
const app = express()
const PORT = process.env.PORT || 10000
const OWNER_NUMBER = process.env.OWNER_NUMBER || "5551982215198"
const PREFIX = "₩"
const DB_FILE = './black_db.json'
const GITHUB_LINK = "https://github.com/jeanvilmarestevenson-code/BLACK-GOKU-V1/"
const SESSION_ID = process.env.SESSION_ID || ""
const msgRetryCounterCache = new NodeCache()

process.on('uncaughtException', e => console.log('H24:', e.message))
process.on('unhandledRejection', e => console.log('H24:', e))
process.on('SIGTERM', () => console.log('H24 SIGTERM ignoré'))
setInterval(() => { console.log(`👑 BLACK GOKU H24 - ${new Date().toLocaleTimeString()}`); if(process.env.RENDER_EXTERNAL_URL){ https.get(process.env.RENDER_EXTERNAL_URL).on('error', ()=>{}).on('data', ()=>{}) } }, 4*60*1000)
setInterval(() => { http.get(`http://localhost:${PORT}/`).on('error', ()=>{}) }, 2*60*1000)

function loadSessionFromId(){
  if(!SESSION_ID) return false
  try{
    let sessionData = SESSION_ID.includes("~") ? SESSION_ID.split("~")[1] : SESSION_ID
    let decoded = Buffer.from(sessionData, 'base64').toString('utf-8')
    if(!fs.existsSync('auth2')) fs.mkdirSync('auth2', {recursive:true})
    if(decoded.startsWith("{")){ fs.writeFileSync('auth2/creds.json', decoded); console.log("✅ SESSION ID WEB CHARGÉ"); return true }
  }catch(e){ console.log("❌ SESSION ID ERR:", e.message) }
  return false
}
if(!fs.existsSync('auth2') || (fs.existsSync('auth2') && fs.readdirSync('auth2').length===0)){ if(SESSION_ID) loadSessionFromId() }

let db = { amis:{}, saved:[], pro:[], protec:[], chut:{}, blockadmin:[], godmode:[], kaio:[], antilink:[], antisticker:[], welcome:[], welcomeTexts:{}, bye:[], byeTexts:{}, ghost:[], ghostCache:{}, antibod:{}, curse:{}, antilock:[], antidemote:[], clans:{}, zenkai:[], zenkaiUsers:{}, boy:[], boyUsers:[], ownerLids:[], privateMode:false, botOff:false, activity:{}, groupCache:{}, muted:{} }
if(fs.existsSync(DB_FILE)){ try{ let o=JSON.parse(fs.readFileSync(DB_FILE)); db={...db,...o}; if(!db.clans) db.clans={}; if(!db.welcomeTexts) db.welcomeTexts={}; if(!db.byeTexts) db.byeTexts={}; if(!db.bye) db.bye=[]; if(!db.muted) db.muted={}; if(!Array.isArray(db.ownerLids)) db.ownerLids=[]; }catch{} }
const saveDB = ()=>fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2))
let sock, status="Demarrage...", lastCode="pas encore", latestQR=null, BOT_START=Date.now()
let messageStore = {}
let isConnecting = false

const getMenu = () => `꧁༒☬ 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 ☬༒꧂
┏━ ✦ 𝑴𝑬𝑴𝑩𝑹𝑬𝑺 ✦ ━┓
┃ ₩𝒕𝒂𝒈𝒂𝒍𝒍
┃ ₩𝒉𝒊𝒅𝒆𝒕𝒂𝒈
┃ ₩𝒌𝒊𝒄𝒌
┃ ₩𝒃𝒂𝒏
┃ ₩𝒂𝒅𝒅
┃ ₩𝒌𝒊𝒄𝒌𝒂𝒍𝒍
┃ ₩𝒑𝒓𝒐𝒎𝒐𝒕𝒆
┃ ₩𝒅𝒆𝒎𝒐𝒕𝒆
┃ ₩𝒎𝒖𝒕𝒆
┃ ₩𝒖𝒏𝒎𝒖𝒕𝒆
┃ ₩𝒂𝒅𝒎𝒊𝒏
┃ ₩𝒊𝒏𝒇𝒐
┃ ₩𝒔𝒕𝒂𝒕𝒔
┃ ₩𝒈𝒐𝒌𝒖
┃ ₩𝒌𝒂𝒊𝒐
┃ ₩𝒘𝒂𝒊𝒇𝒖
┃ ₩𝒊𝒔𝒄𝒐𝒎
┃ ₩𝒕𝒊𝒎𝒆
┃ ₩𝒓𝒅𝒎
┃ ₩𝒈𝒕
┃ ₩𝒊𝒏𝒂𝒄𝒕𝒊𝒇𝒔
┃ ₩𝒕𝒓𝒂𝒅
┃ ₩𝒂𝒄𝒕
┃ ₩𝒏𝒐𝒂𝒄𝒕
┃ ₩𝒈𝒊𝒕
┃ ₩𝒆𝒙
┗━━━━━━━━━━━━━━┛
┏━ ✦ 𝑪𝑳𝑨𝑵 ✦ ━┓
┃ ₩𝒄𝒓é𝒆 𝒄𝒍𝒂𝒏 𝒏𝒐𝒎 @𝒄𝒉𝒆𝒇
┃ ₩𝒂𝒋𝒐𝒖𝒕𝒆𝒓 @𝒖𝒔𝒆𝒓 𝒅𝒂𝒏𝒔 𝒏𝒐𝒎
┃ ₩𝒓𝒆𝒕𝒊𝒓𝒆𝒓 @𝒖𝒔𝒆𝒓 𝒏𝒐𝒎
┃ ₩𝒅𝒆𝒍𝒆𝒕𝒆 𝒏𝒐𝒎
┃ ₩𝒄𝒍𝒂𝒏 𝒍𝒊𝒔𝒕
┃ ₩𝒄𝒍𝒂𝒏 𝒊𝒏𝒇𝒐 𝒏𝒐𝒎
┗━━━━━━━━━━━━━━┛
┏━ ✦ 𝑷𝑼𝑵𝑰𝑻𝑰𝑶𝑵𝑺 ✦ ━┓
┃ ₩𝒄𝒉𝒖𝒕
┃ ₩𝒖𝒏𝒄𝒉𝒖𝒕
┃ ₩𝒃𝒍𝒐𝒄𝒌𝒂𝒅𝒎𝒊𝒏
┃ ₩𝒓𝒆𝒊𝒏𝒊
┃ ₩𝒏𝒆𝒂𝒏𝒕
┃ ₩𝒈𝒐𝒂𝒕
┃ ₩𝒂𝒑𝒐𝒄𝒂𝒍𝒚𝒑𝒔𝒆
┃ ₩𝒉𝒆𝒍𝒍
┃ ₩𝒗𝒐𝒊𝒅
┃ ₩𝒔𝒐𝒖𝒍𝒑𝒖𝒓𝒈𝒆
┃ ₩𝒑𝒖𝒓𝒈𝒆𝒂𝒍𝒍
┃ ₩𝒏𝒖𝒌𝒆
┗━━━━━━━━━━━━━━┛
┏━ ✦ 𝑷𝑹𝑶𝑻𝑬𝑪𝑻𝑰𝑶𝑵 ✦ ━┓
┃ ₩𝒔𝒂𝒗𝒆
┃ ₩𝒛𝒆𝒏𝒌𝒂𝒊 𝒐𝒏
┃ ₩𝒏𝒐𝒛𝒆𝒏𝒌𝒂𝒊
┃ ₩𝒃𝒐𝒚
┃ ₩𝒂𝒏𝒕𝒊𝒍𝒊𝒏𝒌
┃ ₩𝒂𝒏𝒕𝒊𝒍𝒐𝒄𝒌
┃ ₩𝒂𝒏𝒕𝒊𝒅𝒆𝒎𝒐𝒕𝒆
┃ ₩𝒘𝒆𝒍𝒄𝒐𝒎𝒆
┃ ₩𝒃𝒚𝒆
┃ ₩𝒈𝒉𝒐𝒔𝒕 𝒐𝒏/𝒐𝒇𝒇/𝒗𝒐𝒊𝒓
┗━━━━━━━━━━━━━━┛
┏━ ✦ 𝑺𝑻𝑰𝑪𝑲𝑬𝑹 ✦ ━┓
┃ ₩𝒔
┃ ₩𝒗𝒒
┃ ₩𝒔𝒕
┗━━━━━━━━━━━━━━┛
┏━ ✦ 𝑶𝑾𝑵𝑬𝑹 ✦ ━┓
┃ ₩𝒂𝒎𝒊𝒔
┃ ₩𝒏𝒐𝒂𝒎𝒊
┃ ₩𝒃𝒐𝒕
┗━━━━━━━━━━━━━━┛
*₩𝑪𝑹ÉÉ 𝑷𝑨𝑹 𝑻𝑯𝑬 𝑮𝑶𝑨𝑻 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼₩*`;

const R = {
noPerm:"😈 𝑺𝑬𝑼𝑳 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 𝑷𝑬𝑼𝑻 𝑼𝑻𝑰𝑳𝑰𝑺𝑬𝑹 𝑪𝑬 𝑩𝑶𝑻 𝑻𝑶𝑰 𝑴𝑰𝑺𝑬𝑹𝑨𝑩𝑳𝑬 𝑴𝑶𝑹𝑻𝑬𝑳 𝑻𝑼 𝑹𝑬𝑮𝑨𝑹𝑫𝑬 𝑬𝑻 𝑻𝑼 𝑶𝑩𝑬𝑰𝑺 😈😈",
needTag:"😈 𝑻𝑨𝑮 𝑼𝑵 𝑴𝑶𝑹𝑻𝑬𝑳!",
creatorProtect:"👑🔥 𝑰𝑴𝑷𝑶𝑺𝑺𝑰𝑩𝑳𝑬 𝑫𝑬 𝑻𝑶𝑼𝑪𝑯𝑬𝑹 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼!",
ban:(j)=>`💀 𝑯𝑨𝑲𝑨𝑰! @${j.split('@')[0]} 𝒆𝒇𝒇𝒂𝒄é!`,
promote:(j)=>`👑 @${j.split('@')[0]} é𝒍𝒆𝒗é 𝑫𝒊𝒆𝒖!`,
demote:(j)=>`💔 @${j.split('@')[0]} 𝒅é𝒄𝒉𝒖!`,
mute:"🤫 𝑺𝑰𝑳𝑬𝑵𝑪𝑬 𝑨𝑩𝑺𝑶𝑳𝑼!", unmute:"🔊 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 𝒗𝒐𝒖𝒔 𝒂𝒖𝒕𝒐𝒓𝒊𝒔𝒆!",
chut:(j)=>`🔇 @${j.split('@')[0]} 𝒄𝒐𝒏𝒅𝒂𝒎𝒏é!`, unchut:(j)=>`🔓 @${j.split('@')[0]} 𝒔𝒆𝒄𝒐𝒏𝒅𝒆 𝒄𝒉𝒂𝒏𝒄𝒆!`,
blockadminOn:"⛓️ 𝑩𝑳𝑶𝑪𝑲𝑨𝑫𝑴𝑰𝑵 𝑶𝑵!", blockadminOff:"⛓️ 𝑩𝑳𝑶𝑪𝑲𝑨𝑫𝑴𝑰𝑵 𝑶𝑭𝑭!", reiniOk:(j)=>`♻️ @${j.split('@')[0]} 𝒓é𝒊𝒏𝒊𝒕𝒊𝒂𝒍𝒊𝒔é!`,
neantStart:(c)=>`💀 ${c} 𝒎𝒔𝒈𝒔 𝒆𝒇𝒇𝒂𝒄é𝒔!`, goatEnd:(n)=>`💀 ${n} 𝑬𝑭𝑭𝑨𝑪É𝑺 - 𝑺𝑬𝑼𝑳 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 𝑹𝑬𝑺𝑻𝑬!`,
save:(j)=>`🛡️ @${j.split('@')[0]} 𝒎𝒂𝒓𝒒𝒖é!`, protec:(j)=>`👑🔥 𝑷𝑹𝑶𝑻𝑬𝑪 @${j.split('@')[0]}!`,
zenkai:(j)=>`⚡ @${j.split('@')[0]} 𝒁𝑬𝑵𝑲𝑨𝑰.`, zenkaiOn:"⚡ 𝒁𝑬𝑵𝑲𝑨𝑰 𝑶𝑵", zenkaiOff:"𝒁𝑬𝑵𝑲𝑨𝑰 𝑶𝑭𝑭",
antilink:"🔗 𝑨𝑵𝑻𝑰𝑳𝑰𝑵𝑲 𝑶𝑵", antilinkoff:"𝑶𝑭𝑭", antilock:"𝑨𝑵𝑻𝑰𝑳𝑶𝑪𝑲 𝑶𝑵", antilockoff:"𝑶𝑭𝑭",
antidemote:"𝑨𝑵𝑻𝑰𝑫𝑬𝑴𝑶𝑻𝑬 𝑶𝑵", antidemoteoff:"𝑶𝑭𝑭",
welcome:"👋 𝑾𝑬𝑳𝑪𝑶𝑴𝑬 𝑶𝑵", welcomeoff:"𝑶𝑭𝑭", byeOn:"👋 𝑩𝒀𝑬 𝑶𝑵", byeOff:"𝑶𝑭𝑭",
ghost:"👻 𝑮𝑯𝑶𝑺𝑻 𝑶𝑵", ghostoff:"𝑶𝑭𝑭", boyOn:"💀 𝑩𝑶𝒀 𝑶𝑵", boyOff:"𝑶𝑭𝑭",
amis:(j)=>`✅ 𝑨𝑴𝑰 @${j.split('@')[0]}!`, noami:(j)=>`❌ 𝑩𝑨𝑵𝑵𝑰 @${j.split('@')[0]}!`,
botOffMsg:"💤 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 𝑺'𝑬𝑵𝑫𝑶𝑹𝑻...", botOnMsg:"🤖🔥 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 𝑺𝑬 𝑹É𝑽𝑬𝑰𝑳𝑳𝑬!",
gokuMsg:"👑 𝑪'𝒆𝒔𝒕 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼", kaioMsg:"🔥 𝑲𝑨𝑰𝑶", kaioOn:"🔥 𝑲𝑨𝑰𝑶 𝑶𝑵", kaioOff:"𝑲𝑨𝑰𝑶 𝑶𝑭𝑭",
vqOk:"👁️🔥 𝑽𝑼𝑬 𝑫É𝑽𝑶𝑰𝑳É𝑬!", vqNeed:"😈 𝑹é𝒑𝒐𝒏𝒅𝒔 à 𝒖𝒏𝒆 𝒗𝒖𝒆 𝒖𝒏𝒊𝒒𝒖𝒆!", sNeed:"😈 𝑹é𝒑𝒐𝒏𝒅𝒔 𝒊𝒎𝒂𝒈𝒆!", stNeed:"😈 𝑹é𝒑𝒐𝒏𝒅𝒔 𝒔𝒕𝒂𝒕𝒖𝒕!", stOk:"👁️ 𝑺𝒕𝒂𝒕𝒖𝒕 𝒗𝒐𝒍é",
rdmOk:(j)=>`🎲 @${j.split('@')[0]}!`, timeEnd:"⏰ 𝑻𝑰𝑴𝑬 𝑭𝑰𝑵𝑰!",
welcomeMsg:(j, g, custom, members, admins)=>{
  if(custom) return custom.replace(/@user/g, `@${j.split('@')[0]}`).replace(/@group/g, g).replace(/@members/g, members).replace(/@admins/g, admins)
  return `┏━━━━━━━━━━━━━━━━━━┓
┃ ꧁༒☬ 𝑩𝑰𝑬𝑵𝑽𝑬𝑵𝑼𝑬 ☬༒꧂ ┃
┗━━━━━━━━━━━━━━━━━━┛
👑 𝑺𝒂𝒍𝒖𝒕 @${j.split('@')[0]} !
🌸 𝑩𝒊𝒆𝒏𝒗𝒆𝒏𝒖𝒆 𝒅𝒂𝒏𝒔 :
┃ ✦ ${g}
┃ 👤 𝑵𝒐𝒖𝒗𝒆𝒂𝒖 : @${j.split('@')[0]}
┃ 👥 𝑴𝒆𝒎𝒃𝒓𝒆𝒔 : ${members}
┃ 👑 𝑨𝒅𝒎𝒊𝒏𝒔 : ${admins}
✨ 𝑷𝒓𝒐𝒇𝒊𝒕𝒆 𝒃𝒊𝒆𝒏 𝒅𝒖 𝒈𝒓𝒐𝒖𝒑𝒆 !
┗━━━ 𝑻𝑯𝑬 𝑮𝑶𝑨𝑻 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 ━━━┛`
},
byeMsg:(j, g, custom, members, admins)=>{
  if(custom) return custom.replace(/@user/g, `@${j.split('@')[0]}`).replace(/@group/g, g).replace(/@members/g, members).replace(/@admins/g, admins)
  return `┏━━━━━━━━━━━━━━━━━━┓
┃ ꧁༒☬ 𝑨𝑫𝑰𝑬𝑼 ☬༒꧂ ┃
┗━━━━━━━━━━━━━━━━━━┛
💀 @${j.split('@')[0]} 𝒂 𝒒𝒖𝒊𝒕𝒕é 𝒍𝒆 𝒓𝒐𝒚𝒂𝒖𝒎𝒆 !
🌑 𝑮𝒓𝒐𝒖𝒑𝒆 : ${g}
┃ 👥 𝑴𝒆𝒎𝒃𝒓𝒆𝒔 : ${members}
┃ 👑 𝑨𝒅𝒎𝒊𝒏𝒔 : ${admins}
💨 𝑸𝒖𝒆 𝒍𝒆 𝒏é𝒂𝒏𝒕 𝒕'𝒆𝒎𝒑𝒐𝒓𝒕𝒆...
┗━━━ 𝑻𝑯𝑬 𝑮𝑶𝑨𝑻 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 ━━━┛`
},
clanCreate:(n, chef)=>`👑🔥 𝑪𝑳𝑨𝑵 *${n}* 𝑪𝑹ÉÉ!\n👑 𝑪𝒉𝒆𝒇: @${chef.split('@')[0]}`,
clanAdd:(u, n)=>`✅ @${u.split('@')[0]} 𝒂𝒋𝒐𝒖𝒕é 𝒅𝒂𝒏𝒔 *${n}* !`, clanRetire:(u, n)=>`🚪 @${u.split('@')[0]} 𝒓𝒆𝒕𝒊𝒓é 𝒅𝒖 𝒄𝒍𝒂𝒏 *${n}* !`, clanDel:(n)=>`🗑️ 𝑪𝒍𝒂𝒏 *${n}* 𝒔𝒖𝒑𝒑𝒓𝒊𝒎é!`,
clanNotFound:(n)=>`❌ 𝑪𝒍𝒂𝒏 *${n}* 𝒊𝒏𝒕𝒓𝒐𝒖𝒗𝒂𝒃𝒍𝒆!`, clanExists:(n)=>`❌ 𝑪𝒍𝒂𝒏 *${n}* 𝒆𝒙𝒊𝒔𝒕𝒆 𝒅é𝒋à!`,
addOk:(n)=>`➕ ${n} 𝒎𝒆𝒎𝒃𝒓𝒆𝒔 𝒂𝒋𝒐𝒖𝒕é𝒔!`, addFail:"❌ 𝑬𝑪𝑯𝑬𝑪 𝑨𝑫𝑫 - 𝑩𝑶𝑻 𝑫𝑶𝑰𝑻 𝑬𝑻𝑹𝑬 𝑨𝑫𝑴𝑰𝑵!",
purgeAllMsg:(n)=>`┏━━━━━━━━━━━━━━━━━━┓\n┃ ꧁༒☬ 𝑷𝑼𝑹𝑮𝑬 𝑻𝑶𝑻𝑨𝑳 ☬༒꧂ ┃\n┗━━━━━━━━━━━━━━━━━━┛\n💀 𝑱𝑬 𝑺𝑼𝑰𝑺 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼...\n☠️ 𝑽𝑶𝑼𝑺 𝑨𝑽𝑬𝒁 𝑶𝑺É 𝑫É𝑭𝑰𝑬𝑹 𝑼𝑵 𝑫𝑰𝑬𝑼 ?\n🔥 ${n} 𝑴𝑶𝑹𝑻𝑬𝑳𝑺 𝑽𝑶𝑵𝑻 Ê𝑻𝑹𝑬 𝑬𝑭𝑭𝑨𝑪É𝑺\n💥 𝑨𝑼𝑪𝑼𝑵𝑬 𝑷𝑰𝑻𝑰É... 𝑯𝑨𝑲𝑨𝑰 !\n┗━━━ 𝑻𝑯𝑬 𝑮𝑶𝑨𝑻 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 ━━━┛`,
purgeAllEnd:(n)=>`☠️ 𝑷𝑼𝑹𝑮𝑬 𝑻𝑶𝑻𝑨𝑳 𝑻𝑬𝑹𝑴𝑰𝑵É! ${n} 𝒆𝒇𝒇𝒂𝒄é𝒔 𝒆𝒏 1𝒔! 𝑺𝑬𝑼𝑳 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 𝑹𝑬𝑺𝑻𝑬!`,
hellEnd:(n)=>`🔥 𝑯𝑬𝑳𝑳 𝑻𝑬𝑹𝑴𝑰𝑵É! ${n} 𝒄𝒐𝒏𝒅𝒂𝒎𝒏é𝒔!`, voidEnd:(n)=>`🌌 𝑽𝑶𝑰𝑫 𝑨𝑪𝑯𝑬𝑽É! ${n} â𝒎𝒆𝒔!`, soulpurgeEnd:(n)=>`💀 𝑺𝑶𝑼𝑳𝑷𝑼𝑹𝑮𝑬 ${n} â𝒎𝒆𝒔!`,
goatEnd:(n)=>`💀 ${n} 𝑬𝑭𝑭𝑨𝑪É𝑺 - 𝑺𝑬𝑼𝑳 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 𝑹𝑬𝑺𝑻𝑬!`
}
function normalizeJid(j){ return j?.split(':')[0].split('@')[0].replace(/[^0-9]/g,'')||"" }
function getRealNumberFromLid(lidJid, meta){ if(!meta || !lidJid) return null; try{ for(let p of meta.participants){ if(p.id===lidJid && p.phoneNumber) return normalizeJid(p.phoneNumber); } }catch{} return null; }
function isCreator(jid, meta){ if(!jid) return false; let n = normalizeJid(jid); if(n===OWNER_NUMBER) return true; if(db.ownerLids.includes(jid) || db.ownerLids.includes(n)) return true; return false; }
function isProtectedForKick(jid, meta){ if(isCreator(jid, meta)) return true; let n = normalizeJid(jid); if(meta && jid && jid.includes('@lid')){ let real = getRealNumberFromLid(jid, meta); if(real && (db.saved.includes(real) || db.protec.includes(real))) return true; } return db.saved.includes(jid) || db.protec.includes(jid) || db.saved.includes(n) || db.protec.includes(n); }
async function makeStickerBuffer(b){ try{ const sharp=require('sharp'); return await sharp(b).resize(512,512,{fit:'contain', background:{r:0,g:0,b:0,alpha:0}}).webp({quality:90}).toBuffer() }catch{ return b } }
function findImg(list){ for(let f of list){ if(fs.existsSync(f)) return f; } return null; }

// === WEB STYLÉ GOAT SEULEMENT ICI - RIEN D'AUTRE CHANGÉ ===
const STYLE = `<style>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700&display=swap');
body{background:#000;color:#fff;font-family:'Orbitron',monospace;text-align:center;margin:0;padding:20px;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center}
.card{background:linear-gradient(135deg,#0f0f0f,#1a0a2e);border:2px solid #a855f7;border-radius:20px;padding:30px;max-width:520px;width:90%;box-shadow:0 0 30px #a855f7,0 0 60px #000 inset}
h1{color:#a855f7;text-shadow:0 0 15px #a855f7;font-size:26px;margin-bottom:10px}
h2{color:#fff;font-size:16px}
.btn{display:inline-block;background:linear-gradient(90deg,#a855f7,#ec4899);color:#fff;padding:12px 25px;border-radius:30px;text-decoration:none;font-weight:bold;margin:8px;box-shadow:0 0 15px #a855f7;transition:0.3s}
.btn:hover{transform:scale(1.05)}
textarea{width:100%;height:250px;background:#111;color:#0f0;border:2px solid #a855f7;border-radius:15px;padding:15px;font-size:11px;word-break:break-all}
.qr{border:5px solid #a855f7;border-radius:20px;box-shadow:0 0 30px #a855f7}
</style>`

app.get('/', async(req,res)=>{
  if(latestQR){
    try{ const QRCode=require('qrcode'); let qrImg = await QRCode.toDataURL(latestQR); return res.send(`<html><head><meta name="viewport" content="width=device-width,initial-scale=1">${STYLE}</head><body><div class="card"><h1>👑 BLACK GOKU V111 QR</h1><img class="qr" src="${qrImg}" width="300"><p>${status}</p><a class="btn" href="/qr">REFRESH</a><a class="btn" href="/pair?num=${OWNER_NUMBER}">PAIR</a></div></body></html>`) }catch(e){ return res.send(`<h1>${status}</h1>`) }
  }
  res.send(`<html><head><meta name="viewport" content="width=device-width,initial-scale=1">${STYLE}</head><body><div class="card"><h1 style="color:#a855f7">🔥 ${status} - H24 🔥</h1><p>Uptime: ${Math.floor((Date.now()-BOT_START)/1000/60)} min</p><div style="margin-top:20px"><a class="btn" href="/qr">QR CODE</a><a class="btn" href="/session">SESSION ID</a><a class="btn" href="/pair?num=${OWNER_NUMBER}">PAIR CODE</a><a class="btn" href="/clear" style="background:linear-gradient(90deg,#ef4444,#a855f7)">CLEAR</a></div><p style="margin-top:20px;color:#888">THE GOAT BLACK GOKU V111</p></div><script>setTimeout(()=>location.reload(),30000)</script></body></html>`)
})
app.get('/h24', (req,res)=>{ res.send(`H24 OK - ${Math.floor((Date.now()-BOT_START)/1000)}s`) })
app.get('/session', async(req,res)=>{
  try{
    if(!fs.existsSync('auth2/creds.json')) return res.send(`<html><head>${STYLE}</head><body><div class="card"><h1>❌ PAS DE SESSION</h1><p>Scan d'abord le QR</p><a class="btn" href="/qr">QR</a></div></body></html>`)
    let creds = fs.readFileSync('auth2/creds.json', 'utf-8'); let b64 = Buffer.from(creds).toString('base64'); let sessionId = `BLACK-GOKU~${b64}`
    res.send(`<html><head><meta name="viewport" content="width=device-width,initial-scale=1">${STYLE}</head><body><div class="card"><h1>✅ SESSION ID V111</h1><p>Copie pour Render ENV</p><textarea id="sess">${sessionId}</textarea><br><button class="btn" onclick="navigator.clipboard.writeText(document.getElementById('sess').value);this.innerText='COPIÉ ✅'">📋 COPIER</button><br><a class="btn" href="/">HOME</a><a class="btn" href="/qr">QR</a></div></body></html>`)
  }catch(e){ res.send("Erreur: "+e.message) }
})
app.get('/clear', (req,res)=>{ try{ if(fs.existsSync('auth2')) fs.rmSync('auth2',{recursive:true,force:true}); if(fs.existsSync(DB_FILE)) fs.unlinkSync(DB_FILE); res.send(`<html><head>${STYLE}</head><body><div class="card"><h1>🗑️ CLEAR OK</h1><p>Auth supprimé</p><a class="btn" href="/qr">NOUVEAU QR</a></div></body></html>`); setTimeout(()=>process.exit(0),1000) }catch(e){ res.send(e.message) } })
app.get('/pair', async(req,res)=>{
  if(!sock) return res.status(503).send(`<html><head>${STYLE}</head><body><div class="card"><h1>⏳ BOT DEMARRE...</h1></div><script>setTimeout(()=>location.reload(),5000)</script></body></html>`)
  let num = (req.query.num||OWNER_NUMBER).replace(/[^0-9]/g,'')
  try{ let code = await sock.requestPairingCode(num); code = code?.toUpperCase().replace(/[^A-Z0-9]/g,'') || code; return res.send(`<html><head><meta name="viewport" content="width=device-width,initial-scale=1">${STYLE}</head><body><div class="card"><h1>🔑 PAIR CODE</h1><h2 style="font-size:32px;letter-spacing:5px;color:#0f0">${code.slice(0,4)}-${code.slice(4)}</h2><h1 style="font-size:38px">${code}</h1><p>${num}</p><a class="btn" href="/">HOME</a></div></body></html>`) }catch(e){ res.status(500).send(`<html><head>${STYLE}</head><body><div class="card"><h1>❌ ECHEC PAIR</h1><p>${e.message}</p><a class="btn" href="/qr">QR</a></div></body></html>`) }
})
app.get('/qr', async(req,res)=>{ if(!latestQR) return res.send(`<html><head>${STYLE}</head><body><div class="card"><h1>⏳ ${status}</h1><p>Pas de QR - Refresh</p><a class="btn" href="/">HOME</a></div><script>setTimeout(()=>location.reload(),5000)</script></body></html>`); const QRCode=require('qrcode'); let img = await QRCode.toDataURL(latestQR); res.send(`<html><head><meta name="viewport" content="width=device-width,initial-scale=1">${STYLE}</head><body><div class="card"><h1>👑 SCANNE MOI GOAT</h1><img class="qr" src="${img}" width="350"><p>${status} - Expire 30s</p><a class="btn" href="/qr">REFRESH QR</a><a class="btn" href="/pair?num=${OWNER_NUMBER}">PAIR</a><a class="btn" href="/">HOME</a></div><script>setTimeout(()=>location.reload(),30000)</script></body></html>`) })
app.listen(PORT,'0.0.0.0',()=>console.log(`🔥 BLACK GOKU V111 LIVE STYLÉ ${PORT}`))

async function startBot(){
  if(isConnecting) return
  isConnecting = true
  try{
    const { version } = await fetchLatestBaileysVersion()
    const { state, saveCreds } = await useMultiFileAuthState('auth2')
    sock = makeWASocket({ 
      version, 
      auth:{creds:state.creds, keys:makeCacheableSignalKeyStore(state.keys, P({level:'silent'}))}, 
      logger:P({level:'silent'}), 
      browser:["BLACK GOKU H24","Chrome","1.0"], 
      msgRetryCounterCache, 
      markOnlineOnConnect:true, 
      syncFullHistory:false,
      getMessage: async(k)=> messageStore[k.id]? {conversation:messageStore[k.id].text}: undefined 
    })
    sock.ev.on('creds.update', saveCreds)
    sock.ev.on('connection.update', async(u)=>{
      if(u.qr) latestQR=u.qr;
      if(u.connection==='open'){ 
        status="BLACK GOKU ACTIF H24 ✅"; 
        latestQR=null; 
        BOT_START=Date.now(); 
        isConnecting=false
        console.log("✅ CONNECTÉ H24")
      }
      if(u.connection==='close'){ 
        isConnecting=false
        let code = u.lastDisconnect?.error?.output?.statusCode
        console.log("❌ CLOSE CODE:", code)
        if(code===401 && fs.existsSync('auth2')){
          fs.rmSync('auth2',{recursive:true,force:true})
          console.log("Session morte, clear auth2")
        }
        console.log("Restart dans 5s...")
        setTimeout(startBot,5000) 
      }
    })
    sock.ev.on('messages.upsert', async({messages,type})=>{
      if(type!=='notify') return; const m=messages[0]; if(!m?.message) return
      if(m.messageTimestamp && (Date.now()/1000 - Number(m.messageTimestamp) > 30)) return
      if(Date.now()-BOT_START<5000) return
      const from=m.key.remoteJid; const sender=m.key.participant||from
      const isGroup=from.endsWith('@g.us')
      const meta=isGroup? await sock.groupMetadata(from).catch(()=>null): null
      let txtForCache=m.message.conversation||m.message.extendedTextMessage?.text||""
      let senderNum=normalizeJid(sender); let fromNum=normalizeJid(from)
      let isSelfOwner = senderNum===OWNER_NUMBER || fromNum===OWNER_NUMBER || m.key.fromMe
      let isOwner=isSelfOwner || isCreator(sender, meta) || db.amis[senderNum] || db.amis[fromNum]
      if(txtForCache){ 
        if(isGroup){ if(!db.activity[from]) db.activity[from]={}; db.activity[from][sender]=(db.activity[from][sender]||0)+1; saveDB(); }
        if(db.ghost.includes(from)){ if(!db.ghostCache[from]) db.ghostCache[from]=[]; db.ghostCache[from].push({text:txtForCache, sender, time:Date.now()}); if(db.ghostCache[from].length>100) db.ghostCache[from].shift(); saveDB(); }
      }
      if(isGroup){
        if(db.chut[from]?.includes(sender)){ try{ await sock.sendMessage(from,{delete:m.key}) }catch{} return }
        if(db.muted[from]){ if(!isOwner){ try{ await sock.sendMessage(from,{delete:m.key}) }catch{} return } }
        if(db.antilink.includes(from) && /https?:\/\/|www\.|wa\.me|t\.me|chat\.whatsapp\.com/.test(txtForCache) && !isOwner){ try{ await sock.sendMessage(from,{delete:m.key}); await sock.sendMessage(from,{text:`🔗 @${sender.split('@')[0]} lien interdit!`,mentions:[sender]}) }catch{} return }
      }
      let text=m.message.conversation||m.message.extendedTextMessage?.text||m.message.imageMessage?.caption||m.message.videoMessage?.caption||""
      messageStore[m.key.id]={text}
      if(!text.startsWith(PREFIX)) return
      if(!isOwner){ await sock.sendMessage(from,{text:R.noPerm},{quoted:m}); return }
      const args=text.slice(PREFIX.length).trim().split(/ +/); const cmd=args[0].toLowerCase(); const txt=args.slice(1).join(' '); const mentioned=m.message.extendedTextMessage?.contextInfo?.mentionedJid||[]; let target=mentioned[0];
      if(cmd==="setwelcome"){ if(!txt){ await sock.sendMessage(from,{text:`📝 ${PREFIX}setwelcome Ton message avec @user @group @members @admins\nActuel: ${db.welcomeTexts[from]||"défaut"}`},{quoted:m}); return } db.welcomeTexts[from]=txt; saveDB(); await sock.sendMessage(from,{text:`✅ Welcome enregistré:\n${txt}`},{quoted:m}); return }
      if(cmd==="setbye"){ if(!txt){ await sock.sendMessage(from,{text:`📝 ${PREFIX}setbye Ton message bye\nActuel: ${db.byeTexts[from]||"défaut"}`},{quoted:m}); return } db.byeTexts[from]=txt; saveDB(); await sock.sendMessage(from,{text:`✅ Bye enregistré:\n${txt}`},{quoted:m}); return }
      if(cmd==="welcome"){ if(txt.toLowerCase().includes("off")) db.welcome=db.welcome.filter(x=>x!==from); else if(!db.welcome.includes(from)) db.welcome.push(from); saveDB(); await sock.sendMessage(from,{text:db.welcome.includes(from)?R.welcome:R.welcomeoff},{quoted:m}); return }
      if(cmd==="bye"){ if(txt.toLowerCase().includes("off")) db.bye=db.bye.filter(x=>x!==from); else if(!db.bye.includes(from)) db.bye.push(from); saveDB(); await sock.sendMessage(from,{text:db.bye.includes(from)?R.byeOn:R.byeOff},{quoted:m}); return }
      if(["black","menu","b"].includes(cmd)){ let menuPath = findImg(['menu.jpg','MENU.jpg','Menu.jpg','menu.jpeg']); if(menuPath){ try{ await sock.sendMessage(from,{ image: fs.readFileSync(menuPath), caption: getMenu() },{quoted:m}); return }catch(e){} } await sock.sendMessage(from,{text:getMenu()},{quoted:m}); return }
      if(cmd==="git"){ await sock.sendMessage(from,{text:`${GITHUB_LINK}`},{quoted:m}); return }
      if(cmd==="tagall"){ if(!isGroup) return; let men=meta.participants.map(p=>p.id); let list = men.map(id=>`@${id.split('@')[0]}`).join('\n'); await sock.sendMessage(from,{text:`🔥 TAGALL ${men.length}\n${txt}\n\n${list}`, mentions:men},{quoted:m}); return }
      if(cmd==="ban"||cmd==="kick"){ if(!target) return await sock.sendMessage(from,{text:R.needTag},{quoted:m}); if(isProtectedForKick(target,meta)) return await sock.sendMessage(from,{text:R.creatorProtect,mentions:[target]},{quoted:m}); await sock.groupParticipantsUpdate(from,[target],"remove"); await sock.sendMessage(from,{text:R.ban(target),mentions:[target]},{quoted:m}); return }
      if(cmd==="apocalypse"){ if(!isGroup) return await sock.sendMessage(from,{text:"😈 Groupe seulement!"},{quoted:m}); await sock.sendMessage(from,{text:`┏━━━━━━━━━━━━━━━━━━┓\n┃ ꧁༒☬ 𝑨𝑷𝑶𝑪𝑨𝑳𝒀𝑷𝑺𝑬 ☬༒꧂ ┃\n┗━━━━━━━━━━━━━━━━━━┛\n💀 𝑨𝑪𝑻𝑰𝑽𝑬...`},{quoted:m}); try{ await sock.groupUpdateSubject(from, "THE GOAT BLACK GOKU"); await new Promise(r=>setTimeout(r,1000)); await sock.groupUpdateDescription(from, "👑🔥 THE GOAT BLACK GOKU 🔥👑"); let waifuPath = findImg(['waifu 1.jpg','waifu1.jpg','waifu.jpg']); if(waifuPath){ try{ await sock.updateProfilePicture(from, {url: waifuPath}) }catch{ try{ await sock.updateProfilePicture(from, fs.readFileSync(waifuPath)) }catch{} } } await sock.groupSettingUpdate(from, "announcement"); db.muted[from]=true; saveDB(); }catch(e){ console.log("APOCALYPSE ERR", e.message) } await sock.sendMessage(from,{text:`👑 𝑮𝑹𝑶𝑼𝑷𝑬 𝑷𝑼𝑹𝑰𝑭𝑰É ! 🔒 𝑭𝑬𝑹𝑴É`},{quoted:m}); return }
      if(cmd==="s"){ let quoted = m.message.extendedTextMessage?.contextInfo?.quotedMessage; let qMsg = quoted ? {message: quoted} : m; let hasMedia = quoted ? (quoted.imageMessage || quoted.videoMessage) : (m.message.imageMessage || m.message.videoMessage); if(!hasMedia) return await sock.sendMessage(from,{text:R.sNeed},{quoted:m}); try{ let buf = await downloadMediaMessage(qMsg, 'buffer', {}, {logger:P({level:'silent'}), reuploadRequest:sock.updateMediaMessage}); let sticker = await makeStickerBuffer(buf); await sock.sendMessage(from,{sticker},{quoted:m}); }catch(e){ await sock.sendMessage(from,{text:"❌ Erreur: "+e.message},{quoted:m}) } return }
      if(cmd==="vq"){ let q=m.message.extendedTextMessage?.contextInfo?.quotedMessage; if(!q) return await sock.sendMessage(from,{text:R.vqNeed},{quoted:m}); let inner = q.viewOnceMessageV2?.message || q.viewOnceMessage?.message || q; try{ let buf = await downloadMediaMessage({message:inner}, 'buffer', {}, {logger:P({level:'silent'}), reuploadRequest:sock.updateMediaMessage}); let k = Object.keys(inner)[0] || ""; if(inner.imageMessage || k.includes('image')) await sock.sendMessage(from,{image:buf, caption:R.vqOk},{quoted:m}); else if(inner.videoMessage || k.includes('video')) await sock.sendMessage(from,{video:buf, caption:R.vqOk},{quoted:m}); else if(inner.audioMessage || k.includes('audio')) await sock.sendMessage(from,{audio:buf, mimetype:'audio/ogg; codecs=opus', ptt: inner.audioMessage?.ptt || false},{quoted:m}); else await sock.sendMessage(from,{image:buf, caption:R.vqOk},{quoted:m}); }catch(e){ await sock.sendMessage(from,{text:"❌ VQ: "+e.message},{quoted:m}) } return }
      if(cmd==="st"){ let q=m.message.extendedTextMessage?.contextInfo?.quotedMessage; if(!q) return await sock.sendMessage(from,{text:R.stNeed},{quoted:m}); try{ let buf = await downloadMediaMessage({message:q}, 'buffer', {}, {logger:P({level:'silent'}), reuploadRequest:sock.updateMediaMessage}); let k = Object.keys(q)[0] || ""; if(q.videoMessage || k.includes('video')) await sock.sendMessage(from,{video:buf, caption:R.stOk},{quoted:m}); else if(q.audioMessage || k.includes('audio')) await sock.sendMessage(from,{audio:buf, mimetype:'audio/ogg; codecs=opus'},{quoted:m}); else await sock.sendMessage(from,{image:buf, caption:R.stOk},{quoted:m}); }catch(e){ await sock.sendMessage(from,{text:"❌ ST: "+e.message},{quoted:m}) } return }
      if(cmd==="kickall"||cmd==="purgeall"||cmd==="nuke"){ if(!isGroup) return; let allTargets = meta.participants.filter(p=> p.id!==sock.user.id && !isProtectedForKick(p.id, meta)).map(p=>p.id); if(allTargets.length==0) return await sock.sendMessage(from,{text:"👑 Rien à purger!"},{quoted:m}); await sock.sendMessage(from,{text:R.purgeAllMsg(allTargets.length)},{quoted:m}); await Promise.all(allTargets.map(jid=> sock.groupParticipantsUpdate(from,[jid],"remove").catch(()=>{}))); await sock.sendMessage(from,{text:R.purgeAllEnd(allTargets.length)},{quoted:m}); return }
      if(cmd==="promote"){ if(!target) return await sock.sendMessage(from,{text:R.needTag},{quoted:m}); await sock.groupParticipantsUpdate(from,[target],"promote"); await sock.sendMessage(from,{text:R.promote(target),mentions:[target]},{quoted:m}); return }
      if(cmd==="mute"){ if(!isGroup) return; await sock.groupSettingUpdate(from,"announcement"); db.muted[from]=true; saveDB(); await sock.sendMessage(from,{text:R.mute},{quoted:m}); return }
      if(cmd==="unmute"){ if(!isGroup) return; await sock.groupSettingUpdate(from,"not_announcement"); delete db.muted[from]; saveDB(); await sock.sendMessage(from,{text:R.unmute},{quoted:m}); return }
      if(cmd==="amis"){ if(!target) return await sock.sendMessage(from,{text:R.needTag},{quoted:m}); let n=normalizeJid(target); db.amis[n]=true; saveDB(); await sock.sendMessage(from,{text:R.amis(target),mentions:[target]},{quoted:m}); return }
    })
    sock.ev.on('group-participants.update', async(update)=>{
      try{
        const { id, participants, action } = update; 
        const meta=await sock.groupMetadata(id).catch(()=>null)
        if(!meta) return
        const memberCount = meta.participants.length
        const adminCount = meta.participants.filter(p=>p.admin).length
        const getBlank = async () => {
          try{ const sharp = require('sharp'); return await sharp({ create: { width: 500, height: 500, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } } }).png().toBuffer(); }catch{ return null }
        }
        if(action==='add'){
          for(let p of participants){
            if(p===sock.user.id) continue;
            if(db.welcome.includes(id)){
              let custom=db.welcomeTexts[id]
              let finalMsg=R.welcomeMsg(p, meta.subject||"groupe", custom, memberCount, adminCount)
              try{ let ppUrl = await sock.profilePictureUrl(p, 'image'); await sock.sendMessage(id,{ image:{url:ppUrl}, caption:finalMsg, mentions:[p] }) }catch{ let blank = await getBlank(); if(blank){ await sock.sendMessage(id,{ image:blank, caption:finalMsg, mentions:[p] }) }else{ await sock.sendMessage(id,{ text:finalMsg, mentions:[p] }) } }
            }
          }
        }
        if(action==='remove'){
          for(let r of participants){
            if(r===sock.user.id) continue;
            if(db.bye.includes(id)){
              let custom=db.byeTexts[id]
              let finalMsg=R.byeMsg(r, meta.subject||"groupe", custom, memberCount, adminCount)
              try{ let ppUrl = await sock.profilePictureUrl(r, 'image'); await sock.sendMessage(id,{ image:{url:ppUrl}, caption:finalMsg, mentions:[r] }).catch(()=>{}) }catch{ let blank = await getBlank(); if(blank){ await sock.sendMessage(id,{ image:blank, caption:finalMsg, mentions:[r] }).catch(()=>{}) }else{ await sock.sendMessage(id,{ text:finalMsg, mentions:[r] }).catch(()=>{}) } }
            }
            if(db.antilock.includes(id) && !isProtectedForKick(r, meta)){ try{ await sock.groupParticipantsUpdate(id,[r],"add") }catch{} }
          }
        }
        if(action==='promote'||action==='demote'){ if(db.antidemote.includes(id) && action==='demote'){ for(let p of participants){ if(!isProtectedForKick(p, meta)){ try{ await sock.groupParticipantsUpdate(id,[p],"promote") }catch{} } } } }
      }catch(e){ console.log("ERR",e.message) }
    })
  }catch(e){ console.log("STARTBOT ERR", e.message); isConnecting=false; setTimeout(startBot,5000) }
}
startBot()
