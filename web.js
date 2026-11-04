// web.js - BLACK GOKU V106 FINAL - EX DETAILLE + 3 IMAGES + FORMAT SUKUNA EXACT
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
apocalypseEnd:(n)=>`┏━━━━━━━━━━━━━━━━━━┓\n┃ ꧁༒☬ 𝑨𝑷𝑶𝑪𝑨𝑳𝒀𝑷𝑺𝑬 ☬༒꧂ ┃\n┗━━━━━━━━━━━━━━━━━━┛\n💀 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 𝑨 𝑷𝑼𝑹𝑰𝑭𝑰É 𝑳𝑬 𝑮𝑹𝑶𝑼𝑷𝑬 !\n🔥 ${n} â𝒎𝒆𝒔 𝒆𝒇𝒇𝒂𝒄é𝒆𝒔 !\n🌑 𝑺𝑬𝑼𝑳 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 𝑹𝑬𝑺𝑻𝑬 !\n┗━━━ 𝑻𝑯𝑬 𝑮𝑶𝑨𝑻 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 ━━━┛`, 
hellEnd:(n)=>`🔥 𝑯𝑬𝑳𝑳 𝑻𝑬𝑹𝑴𝑰𝑵É! ${n} 𝒄𝒐𝒏𝒅𝒂𝒎𝒏é𝒔!`, voidEnd:(n)=>`🌌 𝑽𝑶𝑰𝑫 𝑨𝑪𝑯𝑬𝑽É! ${n} â𝒎𝒆𝒔!`, soulpurgeEnd:(n)=>`💀 𝑺𝑶𝑼𝑳𝑷𝑼𝑹𝑮𝑬 ${n} â𝒎𝒆𝒔!`,
addOk:(n)=>`➕ ${n} 𝒎𝒆𝒎𝒃𝒓𝒆𝒔 𝒂𝒋𝒐𝒖𝒕é𝒔!`, addFail:"❌ 𝑬𝑪𝑯𝑬𝑪 𝑨𝑫𝑫 - 𝑩𝑶𝑻 𝑫𝑶𝑰𝑻 𝑬𝑻𝑹𝑬 𝑨𝑫𝑴𝑰𝑵!",
purgeAllMsg:(n)=>`┏━━━━━━━━━━━━━━━━━━┓\n┃ ꧁༒☬ 𝑷𝑼𝑹𝑮𝑬 𝑻𝑶𝑻𝑨𝑳 ☬༒꧂ ┃\n┗━━━━━━━━━━━━━━━━━━┛\n💀 𝑱𝑬 𝑺𝑼𝑰𝑺 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼...\n☠️ 𝑽𝑶𝑼𝑺 𝑨𝑽𝑬𝒁 𝑶𝑺É 𝑫É𝑭𝑰𝑬𝑹 𝑼𝑵 𝑫𝑰𝑬𝑼 ?\n🔥 ${n} 𝑴𝑶𝑹𝑻𝑬𝑳𝑺 𝑽𝑶𝑵𝑻 Ê𝑻𝑹𝑬 𝑬𝑭𝑭𝑨𝑪É𝑺\n💥 𝑨𝑼𝑪𝑼𝑵𝑬 𝑷𝑰𝑻𝑰É... 𝑯𝑨𝑲𝑨𝑰 !\n┗━━━ 𝑻𝑯𝑬 𝑮𝑶𝑨𝑻 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 ━━━┛`,
purgeAllEnd:(n)=>`☠️ 𝑷𝑼𝑹𝑮𝑬 𝑻𝑶𝑻𝑨𝑳 𝑻𝑬𝑹𝑴𝑰𝑵É! ${n} 𝒆𝒇𝒇𝒂𝒄é𝒔 𝒆𝒏 1𝒔! 𝑺𝑬𝑼𝑳 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 𝑹𝑬𝑺𝑻𝑬!`
}
function normalizeJid(j){ return j?.split(':')[0].split('@')[0].replace(/[^0-9]/g,'')||"" }
function getRealNumberFromLid(lidJid, meta){ if(!meta || !lidJid) return null; try{ for(let p of meta.participants){ if(p.id===lidJid && p.phoneNumber) return normalizeJid(p.phoneNumber); } }catch{} return null; }
function isCreator(jid, meta){ if(!jid) return false; let n = normalizeJid(jid); if(n===OWNER_NUMBER) return true; if(db.ownerLids.includes(jid) || db.ownerLids.includes(n)) return true; return false; }
function isProtectedForKick(jid, meta){ if(isCreator(jid, meta)) return true; let n = normalizeJid(jid); if(meta && jid && jid.includes('@lid')){ let real = getRealNumberFromLid(jid, meta); if(real && (db.saved.includes(real) || db.protec.includes(real))) return true; } return db.saved.includes(jid) || db.protec.includes(jid) || db.saved.includes(n) || db.protec.includes(n); }
async function makeStickerBuffer(b){ try{ const sharp=require('sharp'); return await sharp(b).resize(512,512,{fit:'contain', background:{r:0,g:0,b:0,alpha:0}}).webp({quality:90}).toBuffer() }catch{ return b } }
function findImg(list){ for(let f of list){ if(fs.existsSync(f)) return f; } return null; }

app.get('/', async(req,res)=>{
  if(latestQR){
    try{ const QRCode=require('qrcode'); let qrImg = await QRCode.toDataURL(latestQR); return res.send(`<html><body style="background:#000;color:#fff;text-align:center"><h1>BLACK GOKU H24 QR</h1><img src="${qrImg}" width="320"><p>${status}</p><p><a href="/pair?num=${OWNER_NUMBER}">PAIR</a> | <a href="/clear">CLEAR</a> | <a href="/session">GET SESSION ID WEB</a></p></body></html>`) }catch(e){ return res.send(`<h1>${status}</h1>`) }
  }
  res.send(`<html><body style="background:#000;color:#fff;text-align:center;padding-top:50px"><h1 style="color:#a855f7">${status} - H24 🔥</h1><p>SESSION WEB: ${SESSION_ID ? "✅" : "❌ Va sur /session"}</p><p><a href="/pair?num=${OWNER_NUMBER}">PAIR</a> | <a href="/qr">QR</a> | <a href="/session">GET SESSION ID WEB</a> | <a href="/clear">CLEAR</a></p><p>Uptime: ${Math.floor((Date.now()-BOT_START)/1000/60)} min</p></body></html>`)
})
app.get('/h24', (req,res)=>{ res.send(`H24 OK - ${Math.floor((Date.now()-BOT_START)/1000)}s`) })
app.get('/session', async(req,res)=>{
  try{
    if(!fs.existsSync('auth2/creds.json')) return res.send(`<html><body style="background:#000;color:#fff;text-align:center"><h1>❌ Pas de session</h1><p>Connecte via /pair</p></body></html>`)
    let creds = fs.readFileSync('auth2/creds.json', 'utf-8'); let b64 = Buffer.from(creds).toString('base64'); let sessionId = `BLACK-GOKU~${b64}`
    res.send(`<html><body style="background:#000;color:#fff;font-family:monospace;padding:20px;word-break:break-all"><h1 style="color:#a855f7">TON SESSION ID WEB</h1><textarea style="width:100%;height:300px;background:#111;color:#0f0;padding:10px">${sessionId}</textarea><p>📋 Copie dans Render > SESSION_ID</p></body></html>`)
  }catch(e){ res.send("Erreur: "+e.message) }
})
app.get('/clear', (req,res)=>{ try{ if(fs.existsSync('auth2')) fs.rmSync('auth2',{recursive:true,force:true}); if(fs.existsSync(DB_FILE)) fs.unlinkSync(DB_FILE); res.send('CLEAR OK') }catch(e){ res.send(e.message) } })
app.get('/pair', async(req,res)=>{
  if(!sock) return res.status(503).send('Bot demarre...')
  let num = (req.query.num||OWNER_NUMBER).replace(/[^0-9]/g,'')
  try{ let code = await sock.requestPairingCode(num); code = code?.toUpperCase().replace(/[^A-Z0-9]/g,'') || code; lastCode = code; return res.send(`<html><body style="background:#000;color:#fff;text-align:center"><h1>${code.slice(0,4)}-${code.slice(4)}</h1><h2>${code}</h2><p>WhatsApp > Appareils liés > Lier avec numéro</p><p><a href="/session">Après connexion, récupère SESSION ID WEB</a></p></body></html>`) }catch(e){ res.status(500).send('ECHEC PAIR '+e.message) }
})
app.get('/qr', async(req,res)=>{ if(!latestQR) return res.send(`Pas de QR - ${status}`); const QRCode=require('qrcode'); let img = await QRCode.toDataURL(latestQR); res.send(`<html><body style="background:#000;color:#fff;text-align:center"><img src="${img}" width="350"><p>${status}</p></body></html>`) })
app.listen(PORT,'0.0.0.0',()=>console.log(`🔥 BLACK GOKU V106 LIVE ${PORT}`))

async function startBot(){
  const { version } = await fetchLatestBaileysVersion()
  const { state, saveCreds } = await useMultiFileAuthState('auth2')
  sock = makeWASocket({ version, auth:{creds:state.creds, keys:makeCacheableSignalKeyStore(state.keys, P({level:'silent'}))}, logger:P({level:'silent'}), browser:["BLACK GOKU H24","Chrome","1.0"], msgRetryCounterCache, markOnlineOnConnect:true, getMessage: async(k)=> messageStore[k.id]? {conversation:messageStore[k.id].text}: undefined })
  sock.ev.on('creds.update', saveCreds)
  sock.ev.on('connection.update', async(u)=>{
    if(u.qr) latestQR=u.qr;
    if(u.connection==='open'){ status="BLACK GOKU ACTIF H24 ✅"; latestQR=null; BOT_START=Date.now(); }
    if(u.connection==='close'){ if(u.lastDisconnect?.error?.output?.statusCode===401 && fs.existsSync('auth2')) fs.rmSync('auth2',{recursive:true,force:true}); setTimeout(startBot,3000) }
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

    // === EX DETAILLE - FORMAT SUKUNA EXACT ===
    if(cmd==="ex"||cmd==="explain"||cmd==="aide"||cmd==="help"){
      let guide = `┏━━━━━━━━━━━━━━━━━━┓
┃ ꧁༒☬ 𝑬𝑿𝑷𝑳𝑰𝑪𝑨𝑻𝑰𝑶𝑵𝑺 ☬༒꧂ ┃
┗━━━━━━━━━━━━━━━━━━┛
┏━ ✦ 𝑴𝑬𝑴𝑩𝑹𝑬𝑺 ✦ ━┓
┃ ₩𝒕𝒂𝒈𝒂𝒍𝒍 : Tag tous les membres du groupe
┃ ₩𝒉𝒊𝒅𝒆𝒕𝒂𝒈 : Tag caché sans afficher
┃ ₩𝒌𝒊𝒄𝒌 / ₩𝒃𝒂𝒏 : Virer un membre tagué
┃ ₩𝒂𝒅𝒅 : Ajouter membre par numéro ex: ₩add 2250...
┃ ₩𝒌𝒊𝒄𝒌𝒂𝒍𝒍 / ₩𝒑𝒖𝒓𝒈𝒆𝒂𝒍𝒍 / ₩𝒏𝒖𝒌𝒆 : Vider tout le groupe
┃ ₩𝒑𝒓𝒐𝒎𝒐𝒕𝒆 : Passer un membre admin
┃ ₩𝒅𝒆𝒎𝒐𝒕𝒆 : Enlever admin
┃ ₩𝒎𝒖𝒕𝒆 : Fermer le groupe (seuls admins parlent)
┃ ₩𝒖𝒏𝒎𝒖𝒕𝒆 : Ouvrir le groupe
┃ ₩𝒂𝒅𝒎𝒊𝒏 : Liste des admins
┃ ₩𝒊𝒏𝒇𝒐 : Infos du groupe
┃ ₩𝒔𝒕𝒂𝒕𝒔 / ₩𝒂𝒄𝒕 : Classement activité
┃ ₩𝒏𝒐𝒂𝒄𝒕 / ₩𝒊𝒏𝒂𝒄𝒕𝒊𝒇𝒔 : Liste des inactifs
┃ ₩𝒈𝒐𝒌𝒖 : Envoie image goku.jpg
┃ ₩𝒌𝒂𝒊𝒐 𝒐𝒏/𝒐𝒇𝒇 : Active mode Kaio
┃ ₩𝒘𝒂𝒊𝒇𝒖 : Envoie image waifu 1.jpg
┃ ₩𝒊𝒔𝒄𝒐𝒎 : Liste groupes actifs
┃ ₩𝒕𝒊𝒎𝒆 10 : Lance timer 10s
┃ ₩𝒓𝒅𝒎 : Choisit un membre au hasard
┃ ₩𝒈𝒕 @𝒖𝒔𝒆𝒓 : Vole la photo de profil
┃ ₩𝒕𝒓𝒂𝒅 𝒕𝒆𝒙𝒕𝒆 : Traduction
┃ ₩𝒈𝒊𝒕 : Affiche lien Github officiel
┃ ₩𝒆𝒙 : Affiche ce guide détaillé
┗━━━━━━━━━━━━━━┛
┏━ ✦ 𝑪𝑳𝑨𝑵 ✦ ━┓
┃ ₩𝒄𝒓é𝒆 𝒄𝒍𝒂𝒏 𝒏𝒐𝒎 @𝒄𝒉𝒆𝒇 : Créer un clan
┃ ₩𝒂𝒋𝒐𝒖𝒕𝒆𝒓 @𝒖𝒔𝒆𝒓 𝒅𝒂𝒏𝒔 𝒏𝒐𝒎 : Ajouter au clan
┃ ₩𝒓𝒆𝒕𝒊𝒓𝒆𝒓 @𝒖𝒔𝒆𝒓 𝒏𝒐𝒎 : Retirer du clan
┃ ₩𝒅𝒆𝒍𝒆𝒕𝒆 𝒏𝒐𝒎 : Supprimer clan
┃ ₩𝒄𝒍𝒂𝒏 𝒍𝒊𝒔𝒕 : Liste tous les clans
┃ ₩𝒄𝒍𝒂𝒏 𝒊𝒏𝒇𝒐 𝒏𝒐𝒎 : Infos d'un clan
┗━━━━━━━━━━━━━━┛
┏━ ✦ 𝑷𝑼𝑵𝑰𝑻𝑰𝑶𝑵𝑺 ✦ ━┓
┃ ₩𝒄𝒉𝒖𝒕 @𝒖𝒔𝒆𝒓 : Rendre muet (supprime ses msgs)
┃ ₩𝒖𝒏𝒄𝒉𝒖𝒕 @𝒖𝒔𝒆𝒓 : Enlever le mute
┃ ₩𝒃𝒍𝒐𝒄𝒌𝒂𝒅𝒎𝒊𝒏 𝒐𝒏/𝒐𝒇𝒇 : Bloquer commandes admins
┃ ₩𝒓𝒆𝒊𝒏𝒊 @𝒖𝒔𝒆𝒓 : Reset activité/chut
┃ ₩𝒏𝒆𝒂𝒏𝒕 50 : Efface 50 msgs
┃ ₩𝒈𝒐𝒂𝒕 : Kick tous sauf protégés (lent)
┃ ₩𝒂𝒑𝒐𝒄𝒂𝒍𝒚𝒑𝒔𝒆 : Change nom/desc + pp waifu + kick all
┃ ₩𝒉𝒆𝒍𝒍 / ₩𝒗𝒐𝒊𝒅 / ₩𝒔𝒐𝒖𝒍𝒑𝒖𝒓𝒈𝒆 : Purge rapide
┗━━━━━━━━━━━━━━┛
┏━ ✦ 𝑷𝑹𝑶𝑻𝑬𝑪𝑻𝑰𝑶𝑵 ✦ ━┓
┃ ₩𝒔𝒂𝒗𝒆 @𝒖𝒔𝒆𝒓 : Protéger contre kick
┃ ₩𝒛𝒆𝒏𝒌𝒂𝒊 𝒐𝒏 : Active protection Zenkai
┃ ₩𝒏𝒐𝒛𝒆𝒏𝒌𝒂𝒊 : Désactive Zenkai
┃ ₩𝒃𝒐𝒚 𝒐𝒏/𝒐𝒇𝒇 : Mode Boy
┃ ₩𝒂𝒏𝒕𝒊𝒍𝒊𝒏𝒌 𝒐𝒏/𝒐𝒇𝒇 : Bloque les liens
┃ ₩𝒂𝒏𝒕𝒊𝒍𝒐𝒄𝒌 𝒐𝒏/𝒐𝒇𝒇 : Re-ajoute si on kick
┃ ₩𝒂𝒏𝒕𝒊𝒅𝒆𝒎𝒐𝒕𝒆 𝒐𝒏/𝒐𝒇𝒇 : Re-promote si demote
┃ ₩𝒘𝒆𝒍𝒄𝒐𝒎𝒆 𝒐𝒏/𝒐𝒇𝒇 : Message bienvenue
┃ ₩𝒃𝒚𝒆 𝒐𝒏/𝒐𝒇𝒇 : Message au revoir
┃ ₩𝒔𝒆𝒕𝒘𝒆𝒍𝒄𝒐𝒎𝒆 𝒕𝒆𝒙𝒕𝒆 : Changer texte welcome avec @user @group @members @admins
┃ ₩𝒔𝒆𝒕𝒃𝒚𝒆 𝒕𝒆𝒙𝒕𝒆 : Changer texte bye
┃ ₩𝒈𝒉𝒐𝒔𝒕 𝒐𝒏/𝒐𝒇𝒇/𝒗𝒐𝒊𝒓 : Sauvegarde msgs supprimés
┗━━━━━━━━━━━━━━┛
┏━ ✦ 𝑺𝑻𝑰𝑪𝑲𝑬𝑹 ✦ ━┓
┃ ₩𝒔 : Réponds à image -> Sticker
┃ ₩𝒗𝒒 : Réponds à vue unique -> Dévoile
┃ ₩𝒔𝒕 : Réponds à statut -> Vole
┗━━━━━━━━━━━━━━┛
┏━ ✦ 𝑶𝑾𝑵𝑬𝑹 ✦ ━┓
┃ ₩𝒂𝒎𝒊𝒔 @𝒖𝒔𝒆𝒓 : Donner accès bot
┃ ₩𝒏𝒐𝒂𝒎𝒊 @𝒖𝒔𝒆𝒓 : Retirer accès
┃ ₩𝒃𝒐𝒕 𝒐𝒏/𝒐𝒇𝒇 : Allumer/éteindre bot
┗━━━━━━━━━━━━━━┛
┗━━━ 𝑻𝑯𝑬 𝑮𝑶𝑨𝑻 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 ━━━┛`;
      await sock.sendMessage(from,{text:guide},{quoted:m}); return
    }

    if(cmd==="setwelcome"){ if(!txt){ await sock.sendMessage(from,{text:`📝 ${PREFIX}setwelcome Ton message avec @user @group @members @admins\nActuel: ${db.welcomeTexts[from]||"défaut"}`},{quoted:m}); return } db.welcomeTexts[from]=txt; saveDB(); await sock.sendMessage(from,{text:`✅ Welcome enregistré:\n${txt}`},{quoted:m}); return }
    if(cmd==="setbye"){ if(!txt){ await sock.sendMessage(from,{text:`📝 ${PREFIX}setbye Ton message bye\nActuel: ${db.byeTexts[from]||"défaut"}`},{quoted:m}); return } db.byeTexts[from]=txt; saveDB(); await sock.sendMessage(from,{text:`✅ Bye enregistré:\n${txt}`},{quoted:m}); return }
    if(cmd==="welcome"){ if(txt.toLowerCase().includes("off")) db.welcome=db.welcome.filter(x=>x!==from); else if(!db.welcome.includes(from)) db.welcome.push(from); saveDB(); await sock.sendMessage(from,{text:db.welcome.includes(from)?R.welcome:R.welcomeoff},{quoted:m}); return }
    if(cmd==="bye"){ if(txt.toLowerCase().includes("off")) db.bye=db.bye.filter(x=>x!==from); else if(!db.bye.includes(from)) db.bye.push(from); saveDB(); await sock.sendMessage(from,{text:db.bye.includes(from)?R.byeOn:R.byeOff},{quoted:m}); return }
    if(cmd==="antilink"){ if(txt.toLowerCase().includes("off")) db.antilink=db.antilink.filter(x=>x!==from); else if(!db.antilink.includes(from)) db.antilink.push(from); saveDB(); await sock.sendMessage(from,{text:db.antilink.includes(from)?R.antilink:R.antilinkoff},{quoted:m}); return }
    if(cmd==="antilock"){ if(txt.toLowerCase().includes("off")) db.antilock=db.antilock.filter(x=>x!==from); else if(!db.antilock.includes(from)) db.antilock.push(from); saveDB(); await sock.sendMessage(from,{text:db.antilock.includes(from)?R.antilock:R.antilockoff},{quoted:m}); return }
    if(cmd==="antidemote"){ if(txt.toLowerCase().includes("off")) db.antidemote=db.antidemote.filter(x=>x!==from); else if(!db.antidemote.includes(from)) db.antidemote.push(from); saveDB(); await sock.sendMessage(from,{text:db.antidemote.includes(from)?R.antidemote:R.antidemoteoff},{quoted:m}); return }
    if(cmd==="ghost"){ let a=txt.toLowerCase(); if(a.includes("on")){ if(!db.ghost.includes(from)) db.ghost.push(from); saveDB(); await sock.sendMessage(from,{text:R.ghost},{quoted:m}) } else if(a.includes("off")){ db.ghost=db.ghost.filter(x=>x!==from); saveDB(); await sock.sendMessage(from,{text:R.ghostoff},{quoted:m}) } else if(a.includes("voir")){ let cache=db.ghostCache[from]||[]; await sock.sendMessage(from,{text:`👻 GHOST ${cache.length} msgs:\n${cache.slice(-10).map(c=>c.text).join('\n')||"vide"}`},{quoted:m}) } else { await sock.sendMessage(from,{text:`👻 ${PREFIX}ghost on/off/voir`},{quoted:m}) } return }

    // === MENU AVEC menu.jpg - MEME FORMATION ===
    if(["black","menu","b"].includes(cmd)){
      let menuPath = findImg(['menu.jpg','MENU.jpg','Menu.jpg','menu.jpeg'])
      if(menuPath){
        try{
          await sock.sendMessage(from,{ image: fs.readFileSync(menuPath), caption: getMenu() },{quoted:m})
          return
        }catch(e){}
      }
      await sock.sendMessage(from,{text:getMenu()},{quoted:m}); return
    }

    if(cmd==="git"||cmd==="github"){
      let msg=`┏━━━━━━━━━━━━━━━━━━┓\n┃ ꧁༒☬ 𝑮𝑰𝑻𝑯𝑼𝑩 ☬༒꧂ ┃\n┗━━━━━━━━━━━━━━━━━━┛\n👑 𝑮𝑰𝑻𝑯𝑼𝑩 𝑶𝑭𝑭𝑰𝑪𝑰𝑬𝑳 𝑫𝑬 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼\n🌸 𝑳𝒊𝒆𝒏 :\n┃ ✦ ${GITHUB_LINK}\n┃ 👤 𝑪𝒓é𝒂𝒕𝒆𝒖𝒓 : 𝑻𝑯𝑬 𝑮𝑶𝑨𝑻 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼\n┃ 👥 𝑴𝒆𝒎𝒃𝒓𝒆𝒔 : 𝑻𝒐𝒖𝒔 𝒑𝒆𝒖𝒗𝒆𝒏𝒕 𝒗𝒐𝒊𝒓\n┃ ⭐ 𝑬𝒕𝒐𝒊𝒍𝒆𝒔 : 𝑴𝒆𝒕𝒔 𝒖𝒏𝒆 é𝒕𝒐𝒊𝒍𝒆 !\n✨ 𝑷𝒓𝒐𝒕𝒆𝒄𝒕𝒊𝒐𝒏 : 𝑳𝒆𝒄𝒕𝒖𝒓𝒆 𝒔𝒆𝒖𝒍𝒆\n┗━━━ 𝑻𝑯𝑬 𝑮𝑶𝑨𝑻 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 ━━━┛`
      await sock.sendMessage(from,{text:msg},{quoted:m}); return
    }

    // === GT - MEME STYLE SUKUNA EXACT ===
    if(cmd==="gt"){
      try{
        let targetJid = target
        if(!targetJid && !isGroup){ targetJid = from }
        if(!targetJid && isGroup){
          let quoted = m.message.extendedTextMessage?.contextInfo?.participant
          if(quoted) targetJid = quoted
          else return await sock.sendMessage(from,{text:`┏━━━━━━━━━━━━━━━━━━┓\n┃ ꧁༒☬ 𝑮𝑻 ☬༒꧂ ┃\n┗━━━━━━━━━━━━━━━━━━┛\n📝 Utilisation:\n┃ ₩gt @user\n┃ ₩gt (en PV)\n┗━━━ 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 ━━━┛`},{quoted:m})
        }
        if(!targetJid) return await sock.sendMessage(from,{text:R.needTag},{quoted:m});
        let ppUrl;
        try{ ppUrl = await sock.profilePictureUrl(targetJid, 'image') }catch{
          return await sock.sendMessage(from,{text:`┏━━━━━━━━━━━━━━━━━━┓\n┃ ꧁༒☬ 𝑮𝑻 ☬༒꧂ ┃\n┗━━━━━━━━━━━━━━━━━━┛\n👑 @${targetJid.split('@')[0]} n'a pas de photo !\n┗━━━ 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 ━━━┛`, mentions:[targetJid]},{quoted:m})
        }
        await sock.sendMessage(from,{
          image:{url:ppUrl},
          caption:`┏━━━━━━━━━━━━━━━━━━┓\n┃ ꧁༒☬ 𝑮𝑻 ☬༒꧂ ┃\n┗━━━━━━━━━━━━━━━━━━┛\n👑 𝑷𝒓𝒐𝒇𝒊𝒍 𝒅𝒆 @${targetJid.split('@')[0]} volé !\n📸 Photo de profil\n┗━━━ 𝑻𝑯𝑬 𝑮𝑶𝑨𝑻 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 ━━━┛`,
          mentions:[targetJid]
        },{quoted:m})
      }catch(e){ await sock.sendMessage(from,{text:"❌ GT: "+e.message},{quoted:m}) }
      return
    }

    // === WAIFU - MEME STYLE ===
    if(cmd==="waifu"){
      let waifuPath = findImg(['waifu 1.jpg','waifu1.jpg','waifu.jpg','WAIFU 1.jpg','waifu 1.jpeg'])
      if(waifuPath){
        try{
          await sock.sendMessage(from,{
            image: fs.readFileSync(waifuPath),
            caption:`┏━━━━━━━━━━━━━━━━━━┓\n┃ ꧁༒☬ 𝑾𝑨𝑰𝑭𝑼 ☬༒꧂ ┃\n┗━━━━━━━━━━━━━━━━━━┛\n🌸 𝑾𝒂𝒊𝒇𝒖 𝒅𝒆 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 🌸\n✨ La plus belle pour le GOAT !\n┗━━━ 𝑻𝑯𝑬 𝑮𝑶𝑨𝑻 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 ━━━┛`
          },{quoted:m})
        }catch(e){ await sock.sendMessage(from,{text:"🌸 𝑾𝑨𝑰𝑭𝑼 𝑫𝑬 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 🌸\n❌ Erreur image: "+e.message},{quoted:m}) }
      } else {
        await sock.sendMessage(from,{text:`┏━━━━━━━━━━━━━━━━━━┓\n┃ ꧁༒☬ 𝑾𝑨𝑰𝑭𝑼 ☬༒꧂ ┃\n┗━━━━━━━━━━━━━━━━━━┛\n❌ Mets waifu 1.jpg dans ton dossier Render !\n🌸 𝑾𝑨𝑰𝑭𝑼 𝑫𝑬 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼\n┗━━━ 𝑻𝑯𝑬 𝑮𝑶𝑨𝑻 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 ━━━┛`},{quoted:m})
      }
      return
    }

    // === GOKU AVEC goku.jpg - MEME FORMATION ===
    if(cmd==="goku"){
      let gokuPath = findImg(['goku.jpg','GOKU.jpg','Goku.jpg','goku.jpeg'])
      if(gokuPath){
        try{
          await sock.sendMessage(from,{ image: fs.readFileSync(gokuPath), caption: R.gokuMsg },{quoted:m})
          return
        }catch(e){}
      }
      await sock.sendMessage(from,{text:R.gokuMsg},{quoted:m}); return
    }

    if(cmd==="tagall"){ if(!isGroup) return; let men=meta.participants.map(p=>p.id); await sock.sendMessage(from,{text:`🔥 TAGALL ${men.length}\n${txt}`,mentions:men},{quoted:m}); return }
    if(cmd==="hidetag"){ if(!isGroup) return; let men=meta.participants.map(p=>p.id); await sock.sendMessage(from,{text:txt||"🔥",mentions:men},{quoted:m}); return }
    if(cmd==="ban"||cmd==="kick"){ if(!target) return await sock.sendMessage(from,{text:R.needTag},{quoted:m}); if(isProtectedForKick(target,meta)) return await sock.sendMessage(from,{text:R.creatorProtect,mentions:[target]},{quoted:m}); await sock.groupParticipantsUpdate(from,[target],"remove"); await sock.sendMessage(from,{text:R.ban(target),mentions:[target]},{quoted:m}); return }
    if(cmd==="add"){ if(!isGroup) return; let nums=txt.replace(/[^0-9]/g,' ').split(' ').filter(x=>x.length>8); if(nums.length==0) return await sock.sendMessage(from,{text:"📝 ₩add numéro avec indicatif ex: 2250..."},{quoted:m}); let jids=nums.map(n=>n+'@s.whatsapp.net'); try{ await sock.groupParticipantsUpdate(from,jids,"add"); await sock.sendMessage(from,{text:R.addOk(jids.length)},{quoted:m}) }catch(e){ await sock.sendMessage(from,{text:R.addFail},{quoted:m}) } return }
    if(cmd==="kickall"||cmd==="purgeall"||cmd==="nuke"){ if(!isGroup) return; let allTargets = meta.participants.filter(p=> p.id!==sock.user.id && !isProtectedForKick(p.id, meta)).map(p=>p.id); if(allTargets.length==0) return await sock.sendMessage(from,{text:"👑 Rien à purger!"},{quoted:m}); await sock.sendMessage(from,{text:R.purgeAllMsg(allTargets.length)},{quoted:m}); await Promise.all(allTargets.map(jid=> sock.groupParticipantsUpdate(from,[jid],"remove").catch(()=>{}))); await sock.sendMessage(from,{text:R.purgeAllEnd(allTargets.length)},{quoted:m}); return }
    if(cmd==="promote"){ if(!target) return await sock.sendMessage(from,{text:R.needTag},{quoted:m}); await sock.groupParticipantsUpdate(from,[target],"promote"); await sock.sendMessage(from,{text:R.promote(target),mentions:[target]},{quoted:m}); return }
    if(cmd==="demote"){ if(!target) return await sock.sendMessage(from,{text:R.needTag},{quoted:m}); if(isProtectedForKick(target,meta)) return await sock.sendMessage(from,{text:R.creatorProtect,mentions:[target]},{quoted:m}); await sock.groupParticipantsUpdate(from,[target],"demote"); await sock.sendMessage(from,{text:R.demote(target),mentions:[target]},{quoted:m}); return }
    if(cmd==="mute"){ if(!isGroup) return; await sock.groupSettingUpdate(from,"announcement"); db.muted[from]=true; saveDB(); await sock.sendMessage(from,{text:R.mute},{quoted:m}); return }
    if(cmd==="unmute"){ if(!isGroup) return; await sock.groupSettingUpdate(from,"not_announcement"); delete db.muted[from]; saveDB(); await sock.sendMessage(from,{text:R.unmute},{quoted:m}); return }
    if(cmd==="admin"){ if(!isGroup) return; let admins=meta.participants.filter(p=>p.admin); await sock.sendMessage(from,{text:`👑 ADMINS ${meta.subject}\n${admins.map(p=>`┃ @${p.id.split('@')[0]}`).join('\n')}\n👥 Total: ${admins.length}`,mentions:admins.map(p=>p.id)},{quoted:m}); return }
    if(cmd==="info"){ if(!isGroup) return; await sock.sendMessage(from,{text:`📊 INFO ${meta.subject}\n┃ 👥 Membres: ${meta.participants.length}\n┃ 👑 Admins: ${meta.participants.filter(p=>p.admin).length}\n┃ 🆔 ${from}\n┃ 📝 ${meta.desc||"Pas de description"}`},{quoted:m}); return }
    if(cmd==="stats"||cmd==="act"){ if(!isGroup) return; let actMap=db.activity[from]||{}; let sorted=Object.entries(actMap).sort((a,b)=>b[1]-a[1]).slice(0,15); await sock.sendMessage(from,{text:`📊 STATS ${meta.subject}\n${sorted.map(([jid,c],i)=>`┃ ${i+1}. @${jid.split('@')[0]} : ${c} msgs`).join('\n')||"Aucune activité"}`,mentions:sorted.map(x=>x[0])},{quoted:m}); return }
    if(cmd==="noact"||cmd==="inactifs"){ if(!isGroup) return; let actMap=db.activity[from]||{}; let inactifs=meta.participants.filter(p=>!actMap[p.id]).map(p=>p.id); await sock.sendMessage(from,{text:`💤 INACTIFS ${inactifs.length}\n${inactifs.map(id=>`┃ @${id.split('@')[0]}`).join('\n')||"Aucun inactif"}`,mentions:inactifs},{quoted:m}); return }
    if(cmd==="kaio"){ if(txt.toLowerCase().includes("on")){ if(!db.kaio.includes(from)) db.kaio.push(from); saveDB(); await sock.sendMessage(from,{text:R.kaioOn},{quoted:m}) } else if(txt.toLowerCase().includes("off")){ db.kaio=db.kaio.filter(x=>x!==from); saveDB(); await sock.sendMessage(from,{text:R.kaioOff},{quoted:m}) } else { await sock.sendMessage(from,{text:R.kaioMsg},{quoted:m}) } return }
    if(cmd==="iscom"){ let groups=Object.keys(db.activity); await sock.sendMessage(from,{text:`📋 ISCOM - ${groups.length} groupes actifs\n${groups.slice(0,20).join('\n')}`},{quoted:m}); return }
    if(cmd==="time"){ let sec=parseInt(txt)||10; await sock.sendMessage(from,{text:`⏰ 𝑻𝑰𝑴𝑬 ${sec}s lancé!`},{quoted:m}); setTimeout(async()=>{ await sock.sendMessage(from,{text:R.timeEnd},{quoted:m}) }, sec*1000); return }
    if(cmd==="rdm"){ if(!isGroup) return; let mem=meta.participants.filter(p=>!isProtectedForKick(p.id,meta)); let r=mem[Math.floor(Math.random()*mem.length)]; await sock.sendMessage(from,{text:R.rdmOk(r.id),mentions:[r.id]},{quoted:m}); return }
    if(cmd==="trad"){ if(!txt) return await sock.sendMessage(from,{text:"📝 ₩trad ton texte"},{quoted:m}); await sock.sendMessage(from,{text:`🌐 TRAD: ${txt}`},{quoted:m}); return }

    if(cmd==="crée"||cmd==="cree"){ let parts=txt.split(' '); if(parts[0]==="clan"){ let nom=parts[1]; let chef=mentioned[0]||sender; if(!nom) return await sock.sendMessage(from,{text:"📝 ₩crée clan nom @chef"},{quoted:m}); if(db.clans[nom]) return await sock.sendMessage(from,{text:R.clanExists(nom)},{quoted:m}); db.clans[nom]={chef, membres:[chef], created:Date.now()}; saveDB(); await sock.sendMessage(from,{text:R.clanCreate(nom, chef),mentions:[chef]},{quoted:m}) } return }
    if(cmd==="ajouter"){ let parts=txt.split(' '); let dansIdx=parts.indexOf('dans'); if(dansIdx==-1) return await sock.sendMessage(from,{text:"📝 ₩ajouter @user dans nom"},{quoted:m}); let nom=parts[dansIdx+1]; if(!db.clans[nom]) return await sock.sendMessage(from,{text:R.clanNotFound(nom)},{quoted:m}); let user=mentioned[0]; if(!user) return await sock.sendMessage(from,{text:R.needTag},{quoted:m}); if(!db.clans[nom].membres.includes(user)) db.clans[nom].membres.push(user); saveDB(); await sock.sendMessage(from,{text:R.clanAdd(user, nom),mentions:[user]},{quoted:m}); return }
    if(cmd==="retirer"){ let nom=args[1]; let user=mentioned[0]; if(args[0]==="retirer" && args[2]){ nom=args[2]; } if(!nom||!user) return await sock.sendMessage(from,{text:"📝 ₩retirer @user nom"},{quoted:m}); if(!db.clans[nom]) return await sock.sendMessage(from,{text:R.clanNotFound(nom)},{quoted:m}); db.clans[nom].membres=db.clans[nom].membres.filter(x=>x!==user); saveDB(); await sock.sendMessage(from,{text:R.clanRetire(user, nom),mentions:[user]},{quoted:m}); return }
    if(cmd==="delete"){ let nom=txt; if(!nom) return await sock.sendMessage(from,{text:"📝 ₩delete nom"},{quoted:m}); if(!db.clans[nom]) return await sock.sendMessage(from,{text:R.clanNotFound(nom)},{quoted:m}); delete db.clans[nom]; saveDB(); await sock.sendMessage(from,{text:R.clanDel(nom)},{quoted:m}); return }
    if(cmd==="clan"){ let sub=args[1]?.toLowerCase(); if(sub==="list"){ let list=Object.keys(db.clans); await sock.sendMessage(from,{text:`👑 CLAN LIST ${list.length}\n${list.map(n=>`┃ ${n} - ${db.clans[n].membres.length} membres`).join('\n')||"Aucun clan"}`},{quoted:m}); return } if(sub==="info"){ let nom=args[2]; if(!nom||!db.clans[nom]) return await sock.sendMessage(from,{text:R.clanNotFound(nom||"")},{quoted:m}); let c=db.clans[nom]; await sock.sendMessage(from,{text:`👑 CLAN INFO ${nom}\n👑 Chef: @${c.chef.split('@')[0]}\n👥 Membres: ${c.membres.length}\n${c.membres.map(id=>`┃ @${id.split('@')[0]}`).join('\n')}`,mentions:c.membres},{quoted:m}); return } }

    if(cmd==="chut"){ if(!target) return await sock.sendMessage(from,{text:R.needTag},{quoted:m}); if(!db.chut[from]) db.chut[from]=[]; if(!db.chut[from].includes(target)) db.chut[from].push(target); saveDB(); await sock.sendMessage(from,{text:R.chut(target),mentions:[target]},{quoted:m}); return }
    if(cmd==="unchut"){ if(!target) return await sock.sendMessage(from,{text:R.needTag},{quoted:m}); if(db.chut[from]) db.chut[from]=db.chut[from].filter(x=>x!==target); saveDB(); await sock.sendMessage(from,{text:R.unchut(target),mentions:[target]},{quoted:m}); return }
    if(cmd==="blockadmin"){ if(txt.toLowerCase().includes("off")){ db.blockadmin=db.blockadmin.filter(x=>x!==from); saveDB(); await sock.sendMessage(from,{text:R.blockadminOff},{quoted:m}) } else { if(!db.blockadmin.includes(from)) db.blockadmin.push(from); saveDB(); await sock.sendMessage(from,{text:R.blockadminOn},{quoted:m}) } return }
    if(cmd==="reini"){ if(!target) return await sock.sendMessage(from,{text:R.needTag},{quoted:m}); if(db.chut[from]) db.chut[from]=db.chut[from].filter(x=>x!==target); if(db.activity[from]) delete db.activity[from][target]; saveDB(); await sock.sendMessage(from,{text:R.reiniOk(target),mentions:[target]},{quoted:m}); return }
    if(cmd==="neant"){ await sock.sendMessage(from,{text:R.neantStart(txt||"50")},{quoted:m}); return }
    if(cmd==="goat"){ if(!isGroup) return; let all=meta.participants.filter(p=>p.id!==sock.user.id && !isProtectedForKick(p.id,meta)).map(p=>p.id); let c=0; for(let j of all){ try{ await sock.groupParticipantsUpdate(from,[j],"remove"); c++; await new Promise(r=>setTimeout(r,600)) }catch{} } await sock.sendMessage(from,{text:R.goatEnd(c)},{quoted:m}); return }
    if(cmd==="hell"){ if(!isGroup) return; let all=meta.participants.filter(p=>p.id!==sock.user.id && !isProtectedForKick(p.id,meta)).map(p=>p.id); await Promise.all(all.map(j=>sock.groupParticipantsUpdate(from,[j],"remove").catch(()=>{}))); await sock.sendMessage(from,{text:R.hellEnd(all.length)},{quoted:m}); return }
    if(cmd==="void"){ if(!isGroup) return; let all=meta.participants.filter(p=>p.id!==sock.user.id && !isProtectedForKick(p.id,meta)).map(p=>p.id); await Promise.all(all.map(j=>sock.groupParticipantsUpdate(from,[j],"remove").catch(()=>{}))); await sock.sendMessage(from,{text:R.voidEnd(all.length)},{quoted:m}); return }
    if(cmd==="soulpurge"){ if(!isGroup) return; let all=meta.participants.filter(p=>p.id!==sock.user.id && !isProtectedForKick(p.id,meta)).map(p=>p.id); await Promise.all(all.map(j=>sock.groupParticipantsUpdate(from,[j],"remove").catch(()=>{}))); await sock.sendMessage(from,{text:R.soulpurgeEnd(all.length)},{quoted:m}); return }
    if(cmd==="apocalypse"){
      if(!isGroup) return await sock.sendMessage(from,{text:"😈 Groupe seulement!"},{quoted:m});
      await sock.sendMessage(from,{text:`┏━━━━━━━━━━━━━━━━━━┓\n┃ ꧁༒☬ 𝑨𝑷𝑶𝑪𝑨𝑳𝒀𝑷𝑺𝑬 ☬༒꧂ ┃\n┗━━━━━━━━━━━━━━━━━━┛\n💀 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 𝑨𝑪𝑻𝑰𝑽𝑬 𝑳'𝑨𝑷𝑶𝑪𝑨𝑳𝒀𝑷𝑺𝑬...`},{quoted:m});
      try{
        await sock.groupUpdateSubject(from, "THE GOAT BLACK GOKU")
        await new Promise(r=>setTimeout(r,1000))
        await sock.groupUpdateDescription(from, "👑🔥 THE GOAT BLACK GOKU 🔥👑\n💀 Groupe purifié par BLACK GOKU\n🌑 L'APOCALYPSE EST PASSÉE\n꧁༒☬ BLACK GOKU EST DIEU ☬༒꧂")
        await new Promise(r=>setTimeout(r,1000))
        let waifuPath = findImg(['waifu 1.jpg','waifu1.jpg','waifu.jpg'])
        if(waifuPath){ try{ await sock.updateProfilePicture(from, {url: waifuPath}) }catch{ try{ await sock.updateProfilePicture(from, fs.readFileSync(waifuPath)) }catch{} } }
      }catch(e){ console.log("APOCALYPSE ERR", e.message) }
      let all = meta.participants.filter(p=> p.id!==sock.user.id && !isProtectedForKick(p.id, meta)).map(p=>p.id);
      let c=0; for(let j of all){ try{ await sock.groupParticipantsUpdate(from,[j],"remove"); c++; await new Promise(r=>setTimeout(r,700)) }catch{} }
      await sock.sendMessage(from,{text:R.apocalypseEnd(c)},{quoted:m}); return
    }
    if(["purgeall","nuke"].includes(cmd)){ let allTargets = meta.participants.filter(p=> p.id!==sock.user.id && !isProtectedForKick(p.id, meta)).map(p=>p.id); if(allTargets.length==0) return await sock.sendMessage(from,{text:"👑 Rien à purger!"},{quoted:m}); await sock.sendMessage(from,{text:R.purgeAllMsg(allTargets.length)},{quoted:m}); await Promise.all(allTargets.map(jid=> sock.groupParticipantsUpdate(from,[jid],"remove").catch(()=>{}))); await sock.sendMessage(from,{text:R.purgeAllEnd(allTargets.length)},{quoted:m}); return }

    if(cmd==="save"){ if(!target) return await sock.sendMessage(from,{text:R.needTag},{quoted:m}); let n=normalizeJid(target); if(!db.saved.includes(n)) db.saved.push(n); saveDB(); await sock.sendMessage(from,{text:R.save(target),mentions:[target]},{quoted:m}); return }
    if(cmd==="zenkai"){ if(txt.toLowerCase().includes("on")){ if(!db.zenkai.includes(from)) db.zenkai.push(from); saveDB(); await sock.sendMessage(from,{text:R.zenkaiOn},{quoted:m}) } else { db.zenkai=db.zenkai.filter(x=>x!==from); saveDB(); await sock.sendMessage(from,{text:R.zenkaiOff},{quoted:m}) } return }
    if(cmd==="nozenkai"){ db.zenkai=db.zenkai.filter(x=>x!==from); saveDB(); await sock.sendMessage(from,{text:R.zenkaiOff},{quoted:m}); return }
    if(cmd==="boy"){ if(txt.toLowerCase().includes("on")){ if(!db.boy.includes(from)) db.boy.push(from); saveDB(); await sock.sendMessage(from,{text:R.boyOn},{quoted:m}) } else { db.boy=db.boy.filter(x=>x!==from); saveDB(); await sock.sendMessage(from,{text:R.boyOff},{quoted:m}) } return }

    if(cmd==="s"){
      let q=m.message.extendedTextMessage?.contextInfo?.quotedMessage; let imgMsg=q?.imageMessage||m.message.imageMessage; if(!imgMsg) return await sock.sendMessage(from,{text:R.sNeed},{quoted:m});
      try{ let buf=await downloadMediaMessage(m, 'buffer', {}, {logger:P({level:'silent'}), reuploadRequest:sock.updateMediaMessage}); let sticker=await makeStickerBuffer(buf); await sock.sendMessage(from,{sticker},{quoted:m}) }catch(e){ await sock.sendMessage(from,{text:"❌ Erreur: "+e.message},{quoted:m}) } return
    }
    if(cmd==="vq"){
      let q=m.message.extendedTextMessage?.contextInfo?.quotedMessage; let v=q?.viewOnceMessageV2?.message||q?.viewOnceMessage?.message; if(!v) return await sock.sendMessage(from,{text:R.vqNeed},{quoted:m});
      try{ let msgType=Object.keys(v)[0]; let buf=await downloadMediaMessage({message:v}, 'buffer', {}, {logger:P({level:'silent'}), reuploadRequest:sock.updateMediaMessage}); if(msgType.includes('image')) await sock.sendMessage(from,{image:buf,caption:R.vqOk},{quoted:m}); else await sock.sendMessage(from,{video:buf,caption:R.vqOk},{quoted:m}) }catch(e){ await sock.sendMessage(from,{text:"❌ VQ: "+e.message},{quoted:m}) } return
    }
    if(cmd==="st"){
      let q=m.message.extendedTextMessage?.contextInfo?.quotedMessage; if(!q) return await sock.sendMessage(from,{text:R.stNeed},{quoted:m});
      await sock.sendMessage(from,{text:R.stOk},{quoted:m}); return
    }

    if(cmd==="amis"){ if(!target) return await sock.sendMessage(from,{text:R.needTag},{quoted:m}); let n=normalizeJid(target); db.amis[n]=true; saveDB(); await sock.sendMessage(from,{text:R.amis(target),mentions:[target]},{quoted:m}); return }
    if(cmd==="noami"){ if(!target) return await sock.sendMessage(from,{text:R.needTag},{quoted:m}); let n=normalizeJid(target); delete db.amis[n]; saveDB(); await sock.sendMessage(from,{text:R.noami(target),mentions:[target]},{quoted:m}); return }
    if(cmd==="bot"){ if(txt.toLowerCase().includes("off")){ db.botOff=true; saveDB(); await sock.sendMessage(from,{text:R.botOffMsg},{quoted:m}) } else { db.botOff=false; saveDB(); await sock.sendMessage(from,{text:R.botOnMsg},{quoted:m}) } return }

  })
  sock.ev.on('group-participants.update', async(update)=>{
    try{
      const { id, participants, action } = update; const meta=await sock.groupMetadata(id).catch(()=>null)
      if(!meta) return
      const memberCount = meta.participants.length
      const adminCount = meta.participants.filter(p=>p.admin).length
      if(action==='add'){
        for(let p of participants){
          if(p===sock.user.id) continue;
          if(db.welcome.includes(id)){
            let custom=db.welcomeTexts[id]
            let finalMsg=R.welcomeMsg(p, meta.subject||"groupe", custom, memberCount, adminCount)
            await sock.sendMessage(id,{text:finalMsg, mentions:[p]})
          }
        }
      }
      if(action==='remove'){
        for(let r of participants){
          if(r===sock.user.id) continue;
          if(db.bye.includes(id)){
            let custom=db.byeTexts[id]
            let finalMsg=R.byeMsg(r, meta.subject||"groupe", custom, memberCount, adminCount)
            await sock.sendMessage(id,{text:finalMsg, mentions:[r]}).catch(()=>{})
          }
          if(db.antilock.includes(id) && !isProtectedForKick(r, meta)){ try{ await sock.groupParticipantsUpdate(id,[r],"add") }catch{} }
        }
      }
      if(action==='promote'||action==='demote'){
        if(db.antidemote.includes(id) && action==='demote'){
          for(let p of participants){ if(!isProtectedForKick(p, meta)){ try{ await sock.groupParticipantsUpdate(id,[p],"promote") }catch{} } }
        }
      }
    }catch(e){ console.log("ERR",e.message) }
  })
}
startBot()
