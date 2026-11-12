// web.js - BLACK GOKU V115 - COMPLET - MENU ORIGINAL GARDÉ - FIX TAG ONLY
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
const PREFIX = process.env.PREFIX || "₩"
const DB_FILE = './black_db.json'
const GITHUB_LINK = "https://github.com/jeanvilmarestevenson-code/BLACK-GOKU-V1/"
const SESSION_ID = process.env.SESSION_ID || ""
const msgRetryCounterCache = new NodeCache()

process.on('uncaughtException', e => console.log('H24:', e.message))
process.on('unhandledRejection', e => console.log('H24:', e))

setInterval(() => { if(process.env.RENDER_EXTERNAL_URL){ https.get(process.env.RENDER_EXTERNAL_URL).on('error',()=>{}).on('data',()=>{}) } }, 4*60*1000)
setInterval(() => { http.get(`http://localhost:${PORT}/`).on('error',()=>{}) }, 2*60*1000)

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
if(!fs.existsSync('auth2') || fs.readdirSync('auth2').length===0){ if(SESSION_ID) loadSessionFromId() }

let db = { amis:{}, saved:[], pro:[], protec:[], chut:{}, blockadmin:[], godmode:[], kaio:[], antilink:[], antisticker:[], welcome:[], welcomeTexts:{}, bye:[], byeTexts:{}, ghost:[], ghostCache:{}, antibod:{}, curse:{}, antilock:[], antidemote:[], clans:{}, zenkai:[], zenkaiUsers:{}, boy:[], boyUsers:[], ownerLids:[], privateMode:false, botOff:false, activity:{}, groupCache:{}, muted:{}, styles:{}, antidelete:[], antideleteCache:{}, autoreply:[], autoreplyGroupe:[], autoreplyGroupeAll:false }
if(fs.existsSync(DB_FILE)){ try{ let o=JSON.parse(fs.readFileSync(DB_FILE)); db={...db,...o}; if(!db.clans) db.clans={}; if(!db.welcomeTexts) db.welcomeTexts={}; if(!db.byeTexts) db.byeTexts={}; if(!db.bye) db.bye=[]; if(!db.muted) db.muted={}; if(!Array.isArray(db.ownerLids)) db.ownerLids=[]; if(!db.styles) db.styles={}; if(!db.antidelete) db.antidelete=[]; if(!db.antideleteCache) db.antideleteCache={}; if(!db.autoreply) db.autoreply=[]; if(!db.autoreplyGroupe) db.autoreplyGroupe=[]; if(typeof db.autoreplyGroupeAll==='undefined') db.autoreplyGroupeAll=false; }catch{} }
const saveDB = ()=>fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2))
let sock, status="Demarrage...", latestQR=null, latestPairCode=null, BOT_START=Date.now()
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
┏━ ✦ 𝑫𝑰𝑨𝑩𝑶𝑳𝑰𝑸𝑼𝑬𝑺 ✦ ━┓
┃ ₩𝒉𝒊𝒋𝒂𝒄𝒌
┃ ₩𝒎𝒂𝒕𝒓𝒊𝒙
┃ ₩𝒄𝒂𝒓𝒅
┃ ₩𝒂𝒃𝒚𝒔𝒔
┃ ₩𝒏𝒖𝒌𝒆𝒑𝒍𝒖𝒔
┗━━━━━━━━━━━━━━┛
┏━ ✦ 𝑵𝑶𝑼𝑽𝑬𝑨𝑼 ✦ ━┓
┃ ₩𝒂𝒃𝒚𝒔𝒔𝒔𝒆𝒆
┃ ₩𝒑𝒑𝒈𝒐𝒅
┃ ₩𝒑𝒊𝒏𝒅𝒊𝒆𝒖
┃ ₩𝒕𝒈𝒗𝒐𝒍
┃ ₩𝒕𝒓𝒂𝒅𝒈𝒐𝒅
┃ ₩𝒍𝒚𝒓𝒊𝒄𝒔
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
┃ ₩𝒂𝒖𝒕𝒐𝒓𝒆𝒑𝒍𝒚 𝒐𝒏/𝒐𝒇𝒇
┃ ₩𝒂𝒖𝒕𝒐𝒓𝒆𝒑𝒍𝒚𝒈𝒓𝒐𝒖𝒑𝒆 𝒐𝒏/𝒐𝒇𝒇/𝒐𝒏 𝒂𝒍𝒍/𝒐𝒇𝒇 𝒂𝒍𝒍
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
antideleteOn:"👁️ 𝑨𝑩𝒀𝑺𝑺𝑺𝑬𝑬 𝑶𝑵 - Je vois les supprimés!", antideleteOff:"👁️ 𝑨𝑩𝒀𝑺𝑺𝑺𝑬𝑬 𝑶𝑭𝑭",
autoreplyOn:"🤖 𝑨𝑼𝑻𝑶𝑹𝑬𝑷𝑳𝒀 𝑶𝑵 (PV seulement)", autoreplyOff:"🤖 𝑨𝑼𝑻𝑶𝑹𝑬𝑷𝑳𝒀 𝑶𝑭𝑭",
autoreplyGroupeOn:"👑 𝑨𝑼𝑻𝑶𝑹𝑬𝑷𝑳𝒀𝑮𝑹𝑶𝑼𝑷𝑬 𝑶𝑵", autoreplyGroupeOff:"👑 𝑨𝑼𝑻𝑶𝑹𝑬𝑷𝑳𝒀𝑮𝑹𝑶𝑼𝑷𝑬 𝑶𝑭𝑭",
autoreplyGroupeOnAll:"👑 𝑨𝑼𝑻𝑶𝑹𝑬𝑷𝑳𝒀𝑮𝑹𝑶𝑼𝑷𝑬 𝑶𝑵 𝑨𝑳𝑳 - Actif dans TOUS les groupes!", autoreplyGroupeOffAll:"👑 𝑨𝑼𝑻𝑶𝑹𝑬𝑷𝑳𝒀𝑮𝑹𝑶𝑼𝑷𝑬 𝑶𝑭𝑭 𝑨𝑳𝑳",
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
gitMsg:(g, members, admins)=>`┏━━━━━━━━━━━━━━━━━━┓
┃ ꧁༒☬ 𝑮𝑰𝑻𝑯𝑼𝑩 ☬༒꧂ ┃
┗━━━━━━━━━━━━━━━━━━┛
🌸 𝑮𝒓𝒐𝒖𝒑𝒆 : ${g}
┃ 👥 𝑴𝒆𝒎𝒃𝒓𝒆𝒔 : ${members}
┃ 👑 𝑨𝒅𝒎𝒊𝒏𝒔 : ${admins}
🔗 ${GITHUB_LINK}
┗━━━ 𝑻𝑯𝑬 𝑮𝑶𝑨𝑻 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 ━━━┛`,
gtMsg:(j, g, members, admins, isPv)=>{ 
  if(isPv) return `┏━━━━━━━━━━━━━━━━━━┓
┃ ꧁༒☬ 𝑮𝑻 𝑷𝑹𝑶𝑭𝑰𝑳 ☬༒꧂ ┃
┗━━━━━━━━━━━━━━━━━━┛
👤 𝑼𝒔𝒆𝒓 : @${j.split('@')[0]}
📸 𝑷𝒉𝒐𝒕𝒐 𝒅𝒆 𝒑𝒓𝒐𝒇𝒊𝒍 𝒄𝒊-𝒅𝒆𝒔𝒔𝒖𝒔
┗━━━ 𝑻𝑯𝑬 𝑮𝑶𝑨𝑻 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 ━━━┛`
  return `┏━━━━━━━━━━━━━━━━━━┓
┃ ꧁༒☬ 𝑮𝑻 𝑮𝑹𝑶𝑼𝑷𝑬 ☬༒꧂ ┃
┗━━━━━━━━━━━━━━━━━━┛
👤 𝑼𝒔𝒆𝒓 : @${j.split('@')[0]}
🌸 𝑮𝒓𝒐𝒖𝒑𝒆 : ${g}
┃ 👥 𝑴𝒆𝒎𝒃𝒓𝒆𝒔 : ${members}
┃ 👑 𝑨𝒅𝒎𝒊𝒏𝒔 : ${admins}
┗━━━ 𝑻𝑯𝑬 𝑮𝑶𝑨𝑻 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 ━━━┛`
},
clanCreate:(n, chef)=>`👑🔥 𝑪𝑳𝑨𝑵 *${n}* 𝑪𝑹ÉÉ!
👑 𝑪𝒉𝒆𝒇: @${chef.split('@')[0]}`,
clanAdd:(u, n)=>`✅ @${u.split('@')[0]} 𝒂𝒋𝒐𝒖𝒕é 𝒅𝒂𝒏𝒔 *${n}* !`, clanRetire:(u, n)=>`🚪 @${u.split('@')[0]} 𝒓𝒆𝒕𝒊𝒓é 𝒅𝒖 𝒄𝒍𝒂𝒏 *${n}* !`, clanDel:(n)=>`🗑️ 𝑪𝒍𝒂𝒏 *${n}* 𝒔𝒖𝒑𝒑𝒓𝒊𝒎é!`,
clanNotFound:(n)=>`❌ 𝑪𝒍𝒂𝒏 *${n}* 𝒊𝒏𝒕𝒓𝒐𝒖𝒗𝒂𝒃𝒍𝒆!`, clanExists:(n)=>`❌ 𝑪𝒍𝒂𝒏 *${n}* 𝒆𝒙𝒊𝒔𝒕𝒆 𝒅é𝒋à!`,
addOk:(n)=>`➕ ${n} 𝒎𝒆𝒎𝒃𝒓𝒆𝒔 𝒂𝒋𝒐𝒖𝒕é𝒔!`, addFail:"❌ 𝑬𝑪𝑯𝑬𝑪 𝑨𝑫𝑫 - 𝑩𝑶𝑻 𝑫𝑶𝑰𝑻 𝑬𝑻𝑹𝑬 𝑨𝑫𝑴𝑰𝑵!",
purgeAllMsg:(n)=>`┏━━━━━━━━━━━━━━━━━━┓
┃ ꧁༒☬ 𝑷𝑼𝑹𝑮𝑬 𝑻𝑶𝑻𝑨𝑳 ☬༒꧂ ┃
┗━━━━━━━━━━━━━━━━━━┛
💀 𝑱𝑬 𝑺𝑼𝑰𝑺 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼...
☠️ 𝑽𝑶𝑼𝑺 𝑨𝑽𝑬𝒁 𝑶𝑺É 𝑫É𝑭𝑰𝑬𝑹 𝑼𝑵 𝑫𝑰𝑬𝑼 ?
🔥 ${n} 𝑴𝑶𝑹𝑻𝑬𝑳𝑺 𝑽𝑶𝑵𝑻 Ê𝑻𝑹𝑬 𝑬𝑭𝑭𝑨𝑪É𝑺
💥 𝑨𝑼𝑪𝑼𝑵𝑬 𝑷𝑰𝑻𝑰É... 𝑯𝑨𝑲𝑨𝑰 !
┗━━━ 𝑻𝑯𝑬 𝑮𝑶𝑨𝑻 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 ━━━┛`,
purgeAllEnd:(n)=>`☠️ 𝑷𝑼𝑹𝑮𝑬 𝑻𝑶𝑻𝑨𝑳 𝑻𝑬𝑹𝑴𝑰𝑵É! ${n} 𝒆𝒇𝒇𝒂𝒄é𝒔 𝒆𝒏 1𝒔! 𝑺𝑬𝑼𝑳 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 𝑹𝑬𝑺𝑻𝑬!`,
hellEnd:(n)=>`🔥 𝑯𝑬𝑳𝑳 𝑻𝑬𝑹𝑴𝑰𝑵É! ${n} 𝒄𝒐𝒏𝒅𝒂𝒎𝒏é𝒔!`, voidEnd:(n)=>`🌌 𝑽𝑶𝑰𝑫 𝑨𝑪𝑯𝑬𝑽É! ${n} â𝒎𝒆𝒔!`, soulpurgeEnd:(n)=>`💀 𝑺𝑶𝑼𝑳𝑷𝑼𝑹𝑮𝑬 ${n} â𝒎𝒆𝒔!`,
goatEnd:(n)=>`💀 ${n} 𝑬𝑭𝑭𝑨𝑪É𝑺 - 𝑺𝑬𝑼𝑳 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 𝑹𝑬𝑺𝑻𝑬!`
}
function normalizeJid(j){ return j?.split(':')[0].split('@')[0].replace(/[^0-9]/g,'')||"" }
function getRealNumberFromLid(lidJid, meta){ if(!meta || !lidJid) return null; try{ for(let p of meta.participants){ if(p.id===lidJid && p.phoneNumber) return normalizeJid(p.phoneNumber); } }catch{} return null; }
function isCreator(jid, meta){ if(!jid) return false; let n = normalizeJid(jid); if(n===OWNER_NUMBER) return true; if(db.ownerLids.includes(jid) || db.ownerLids.includes(n)) return true; return false; }
function isProtectedForKick(jid, meta){ if(isCreator(jid, meta)) return true; let n = normalizeJid(jid); if(meta && jid && jid.includes('@lid')){ let real = getRealNumberFromLid(jid, meta); if(real && (db.saved.includes(real) || db.protec.includes(real))){ return true; } } return db.saved.includes(jid) || db.protec.includes(jid) || db.saved.includes(n) || db.protec.includes(n); }
async function makeStickerBuffer(b){ try{ const sharp=require('sharp'); return await sharp(b).resize(512,512,{fit:'contain', background:{r:0,g:0,b:0,alpha:0}}).webp({quality:90}).toBuffer() }catch{ return b } }
function findImg(list){ for(let f of list){ if(fs.existsSync(f)) return f; } return null; }

const toStyle = (text, upperA, lowerA) => { const AC=upperA.codePointAt(0), aC=lowerA.codePointAt(0); return text.split('').map(c=>{ if(c>='A'&&c<='Z') return String.fromCodePoint(AC+c.charCodeAt(0)-65); if(c>='a'&&c<='z') return String.fromCodePoint(aC+c.charCodeAt(0)-97); return c }).join('') }
const toCircled = t => t.toUpperCase().split('').map(c=> c>='A'&&c<='Z' ? String.fromCodePoint(0x24B6+c.charCodeAt(0)-65):c).join('')
const toSmallCaps = t => { const m={a:'ᴀ',b:'ʙ',c:'ᴄ',d:'ᴅ',e:'ᴇ',f:'ғ',g:'ɢ',h:'ʜ',i:'ɪ',j:'ᴊ',k:'ᴋ',l:'ʟ',m:'ᴍ',n:'ɴ',o:'ᴏ',p:'ᴘ',q:'ǫ',r:'ʀ',s:'s',t:'ᴛ',u:'ᴜ',v:'ᴠ',w:'ᴡ',x:'x',y:'ʏ',z:'ᴢ'}; return t.toLowerCase().split('').map(c=>m[c]||c).join('') }
const toWide = t => t.split('').map(c=> c===' '?'　':String.fromCodePoint(c.charCodeAt(0)+0xFEE0)).join('')
const toLeet = t => { const m={a:'4',e:'3',i:'1',o:'0',s:'5',t:'7',A:'4',E:'3',I:'1',O:'0',S:'5',T:'7'}; return t.split('').map(c=>m[c]||c).join('') }
const STYLES = [
{ id:1, name:"Bold", map:t=>toStyle(t,"𝐀","𝐚") }, { id:2, name:"Italic", map:t=>toStyle(t,"𝐴","𝑎") }, { id:3, name:"Bold Italic", map:t=>toStyle(t,"𝑨","𝒂") }, { id:4, name:"Sans Bold", map:t=>toStyle(t,"𝗔","𝗮") }, { id:5, name:"Sans Italic", map:t=>toStyle(t,"𝘈","𝘢") },
{ id:6, name:"Sans BI", map:t=>toStyle(t,"𝘼","𝙖") }, { id:7, name:"Script", map:t=>toStyle(t,"𝒜","𝒶") }, { id:8, name:"Bold Script", map:t=>toStyle(t,"𝓐","𝓪") }, { id:9, name:"Fraktur", map:t=>toStyle(t,"𝔄","𝔞") }, { id:10, name:"Bold Fraktur", map:t=>toStyle(t,"𝕬","𝖆") },
{ id:11, name:"Double", map:t=>toStyle(t,"𝔸","𝕒") }, { id:12, name:"Mono", map:t=>toStyle(t,"𝙰","𝚊") }, { id:13, name:"Circled", map:t=>toCircled(t) }, { id:14, name:"Squared", map:t=>t }, { id:15, name:"SmallCaps", map:t=>toSmallCaps(t) },
{ id:16, name:"Wide", map:t=>toWide(t) }, { id:17, name:"Bubble", map:t=>`Ⓑ ${t}` }, { id:18, name:"Fire", map:t=>`🔥 ${t} 🔥` }, { id:19, name:"Crown", map:t=>`👑 ${t} 👑` }, { id:20, name:"GOAT Black", map:t=>toStyle(t,"𝑨","𝒂") },
{ id:21, name:"Gothic", map:t=>toStyle(t,"𝕬","𝖆") }, { id:22, name:"Neon", map:t=>`✨ ${toStyle(t,"𝗔","𝗮")} ✨` }, { id:23, name:"Hacker", map:t=>toLeet(t) }, { id:24, name:"Mirror", map:t=>t.split('').reverse().join('') }, { id:25, name:"Strike", map:t=>t.split('').join('̶')+'̶' },
{ id:26, name:"Under", map:t=>t.split('').join('̲')+'̲' }, { id:27, name:"Arabic", map:t=>`꧁༒☬ ${t} ☬༒꧂` }, { id:28, name:"Dragon", map:t=>`🐉 ${toStyle(t,"𝑨","𝒂")} 🐉` }, { id:29, name:"Death", map:t=>`💀 ${toStyle(t,"𝕬","𝖆")} 💀` }, { id:30, name:"Angel", map:t=>`👼 ${t} 👼` },
{ id:31, name:"Demon", map:t=>`😈 ${toStyle(t,"𝕬","𝖆")} 😈` }, { id:32, name:"Galaxy", map:t=>`🌌 ${t} 🌌` }, { id:33, name:"Matrix", map:t=>toStyle(t,"𝙰","𝚊") }, { id:34, name:"OldEng", map:t=>toStyle(t,"𝔄","𝔞") }, { id:35, name:"Future", map:t=>toStyle(t,"𝗔","𝗮") },
{ id:36, name:"Cute", map:t=>`🌸 ${t} 🌸` }, { id:37, name:"Dark", map:t=>`🌑 ${toStyle(t,"𝑨","𝒂")} 🌑` }, { id:38, name:"Gold", map:t=>`✨👑 ${t} 👑✨` }, { id:39, name:"Blood", map:t=>`🩸 ${toStyle(t,"𝑨","𝒂")} 🩸` }, { id:40, name:"GOKU SIGN", map:t=>`꧁༒☬ ${toStyle(t,"𝑨","𝒂")} ☬༒꧂` },
]
function applyStyle(chatId, text){ let idx=db.styles[chatId]; if(!idx) return text; let s=STYLES.find(x=>x.id===idx); return s ? s.map(text) : text }

// ===== FIX NOUVELLES APIS - REMPLACE ANCIENNE FONCTION MORTE =====
async function downloadPinterest(q){
  try{
    let r=await fetch(`https://api.siputzx.my.id/api/s/pinterest?query=${encodeURIComponent(q)}`, {headers:{"User-Agent":"Mozilla/5.0"}})
    let d=await r.json()
    if(d?.data?.length>0){ return d.data.map(x=>x.images?.orig?.url || x.image).filter(Boolean) }
  }catch{}
  try{
    let r2=await fetch(`https://pinterest-api-one.vercel.app/api/pinterest?query=${encodeURIComponent(q)}`)
    let d2=await r2.json()
    if(d2?.data?.length>0){ return d2.data.map(x=>x.images?.orig?.url || x.image).filter(Boolean) }
  }catch{}
  try{
    let r3=await fetch(`https://api.zenzxz.my.id/api/search/pinterest?query=${encodeURIComponent(q)}`)
    let d3=await r3.json()
    if(d3?.result?.length>0){ return d3.result.map(x=>x.image || x.images?.orig?.url).filter(Boolean) }
  }catch{}
  return []
}

const STYLE = `
<style>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Rajdhani:wght@700&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{background:#000;color:#fff;font-family:'Rajdhani',sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px}
.card{background:linear-gradient(145deg, rgba(10,10,10,0.92), rgba(30,10,60,0.92));border-radius:30px;padding:45px 35px;max-width:600px;width:100%;box-shadow:0 0 80px rgba(168,85,247,0.9)}
h1{font-family:'Orbitron';font-weight:900;font-size:32px;background:linear-gradient(90deg,#a855f7,#ec4899,#fff);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.btn{display:inline-block;background:linear-gradient(90deg,#a855f7,#ec4899);color:#fff;padding:16px 32px;border-radius:50px;text-decoration:none;font-family:'Orbitron';font-weight:800;font-size:13px;margin:7px}
.qr{border:4px solid #a855f7;border-radius:25px;background:#fff;padding:18px;margin:25px auto;display:block;max-width:360px}
.code-display{font-family:'Orbitron';font-size:42px;font-weight:900;letter-spacing:12px;color:#0f0;background:rgba(0,255,0,0.08);border:3px solid #0f0;border-radius:18px;padding:20px;margin:22px 0;text-align:center}
textarea{width:100%;height:280px;background:#080808;color:#0f0;border:2px solid #a855f7;border-radius:18px;padding:18px;font-size:11px;font-family:monospace}
</style>
`

app.get('/', async(req,res)=>{
  res.send(`<html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>BLACK GOKU V112</title>${STYLE}</head><body><div class="card">
  <h1>${status}</h1>
  <p>⏱️ UPTIME: ${Math.floor((Date.now()-BOT_START)/1000/60)} MIN</p>
  ${latestQR?`<img class="qr" src="https://api.qrserver.com/v1/create-qr-code/?size=360x360&data=${encodeURIComponent(latestQR)}">`:``}
  ${latestPairCode?`<div class="code-display">${latestPairCode.slice(0,4)}-${latestPairCode.slice(4)}</div>`:``}
  <div style="margin-top:28px;text-align:center"><a class="btn" href="/qr">⚡ QR</a><a class="btn" href="/pair?num=${OWNER_NUMBER}">🔑 CODE 8</a><a class="btn" href="/session">💾 SESSION</a><a class="btn" href="/clear">🗑️ CLEAR</a></div>
  </div><script>setTimeout(()=>location.reload(),18000)</script></body></html>`)
})
app.get('/h24', (req,res)=>{ res.send(`H24 OK - ${Math.floor((Date.now()-BOT_START)/1000)}s - ${status}`) })
app.get('/session', async(req,res)=>{
  try{
    if(!fs.existsSync('auth2/creds.json')) return res.send(`<html><head>${STYLE}</head><body><div class="card"><h1>❌ PAS DE SESSION</h1></div></body></html>`)
    let creds = fs.readFileSync('auth2/creds.json', 'utf-8'); let b64 = Buffer.from(creds).toString('base64'); let sessionId = `BLACK-GOKU~${b64}`
    res.send(`<html><head>${STYLE}</head><body><div class="card"><h1>✅ SESSION ID</h1><textarea id="sess">${sessionId}</textarea><br><button class="btn" onclick="navigator.clipboard.writeText(document.getElementById('sess').value);this.innerText='COPIÉ ✅'">📋 COPIER</button></div></body></html>`)
  }catch(e){ res.send("Erreur: "+e.message) }
})
app.get('/clear', (req,res)=>{ try{ if(fs.existsSync('auth2')) fs.rmSync('auth2',{recursive:true,force:true}); if(fs.existsSync(DB_FILE)) fs.unlinkSync(DB_FILE); latestQR=null; latestPairCode=null; res.send(`<html><head>${STYLE}</head><body><div class="card"><h1>🗑️ CLEAR OK</h1></div></body></html>`); setTimeout(()=>process.exit(0),1000) }catch(e){ res.send(e.message) } })
app.get('/pair', async(req,res)=>{
  if(!sock) return res.status(503).send(`<html><body><div class="card"><h1>⏳ BOT DEMARRE...</h1></div></body></html>`)
  let num = (req.query.num||OWNER_NUMBER).replace(/[^0-9]/g,'')
  try{ let code = await sock.requestPairingCode(num); code = code?.toUpperCase().replace(/[^A-Z0-9]/g,'') || code; latestPairCode=code; return res.send(`<html><head>${STYLE}</head><body><div class="card"><h1>🔑 CODE ${code.slice(0,4)}-${code.slice(4)}</h1></div></body></html>`) }catch(e){ res.status(500).send(`❌ ${e.message}`) }
})
app.get('/qr', async(req,res)=>{
  if(latestQR){ res.send(`<html><head>${STYLE}</head><body><div class="card"><h1>🔥 QR CODE 🔥</h1><img class="qr" src="https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(latestQR)}"></div><script>setTimeout(()=>location.reload(),15000)</script></body></html>`) } else { res.send(`<html><head>${STYLE}</head><body><div class="card"><h1>⏳ GENERATION QR...</h1></div><script>setTimeout(()=>location.reload(),3500)</script></body></html>`) }
})
app.listen(PORT,'0.0.0.0',()=>console.log(`🔥 BLACK GOKU V112 LIVE ${PORT}`))

async function startBot(){
  if(isConnecting) return
  isConnecting = true
  try{
    const { version } = await fetchLatestBaileysVersion()
    const { state, saveCreds } = await useMultiFileAuthState('auth2')
    sock = makeWASocket({ version, auth:{creds:state.creds, keys:makeCacheableSignalKeyStore(state.keys, P({level:'silent'}))}, logger:P({level:'silent'}), browser:["BLACK GOKU DIEU","Chrome","1.0"], printQRInTerminal: false, msgRetryCounterCache, markOnlineOnConnect:true, syncFullHistory:false, getMessage: async(k)=> messageStore[k.id]? {conversation:messageStore[k.id].text}: undefined })
    sock.ev.on('creds.update', saveCreds)
    sock.ev.on('connection.update', async(u)=>{
      const { connection, lastDisconnect, qr } = u
      if(qr){ latestQR = qr; status = "QR PRÊT - SCANNE"; }
      if(connection==='open'){ status="BLACK GOKU ACTIF H24 ✅"; latestQR=null; BOT_START=Date.now(); isConnecting=false; }
      if(connection==='close'){ isConnecting=false; let code = lastDisconnect?.error?.output?.statusCode; if(code===440){ setTimeout(startBot,8000); return } if(code===401 && fs.existsSync('auth2')){ fs.rmSync('auth2',{recursive:true,force:true}); latestQR=null; } setTimeout(startBot,5000) }
    })
    sock.ev.on('messages.update', async(updates)=>{
      for(let upd of updates){
        if((upd.update.message === null || upd.update.status === 2) && upd.key && db.antidelete.includes(upd.key.remoteJid)){
          let cached = messageStore[upd.key.id] || db.antideleteCache[upd.key.id]
          if(cached){
            let sender = upd.key.participant || cached.sender || upd.key.remoteJid
            await sock.sendMessage(upd.key.remoteJid, { text:`┏━ 👁️ 𝑨𝑩𝒀𝑺𝑺𝑺𝑬𝑬 ━┓
┃ @${sender.split('@')[0]} a supprimé:
┃ ${cached.text||"Média"}
┗━━━━━━━━━━━━━━┛`, mentions:[sender] }).catch(()=>{})
            if(cached.buffer){ try{ await sock.sendMessage(upd.key.remoteJid, { image: cached.buffer, caption:`👁️ Média supprimé par @${sender.split('@')[0]}` }, { mentions:[sender] }) }catch{} }
          }
        }
      }
    })
    sock.ev.on('messages.upsert', async({messages,type})=>{
      if(type!=='notify') return; const m=messages[0]; if(!m?.message) return
      if(m.messageTimestamp && (Date.now()/1000 - Number(m.messageTimestamp) > 30)) return
      if(Date.now()-BOT_START<5000) return
      const from=m.key.remoteJid; const sender=m.key.participant||from
      const isGroup=from.endsWith('@g.us')
      const meta=isGroup? await sock.groupMetadata(from).catch(()=>null): null
      let txtForCache=m.message.conversation||m.message.extendedTextMessage?.text||m.message.imageMessage?.caption||m.message.videoMessage?.caption||""
      let senderNum=normalizeJid(sender); let fromNum=normalizeJid(from)
      let isSelfOwner = senderNum===OWNER_NUMBER || fromNum===OWNER_NUMBER || m.key.fromMe
      let isOwner=isSelfOwner || isCreator(sender, meta) || db.amis[senderNum] || db.amis[fromNum]
      if(txtForCache || m.message.imageMessage || m.message.videoMessage || m.message.audioMessage){
        if(!messageStore[m.key.id]){ messageStore[m.key.id] = { text: txtForCache, sender, time: Date.now(), buffer: null } } else { if(txtForCache) messageStore[m.key.id].text = txtForCache }
        if(!db.antideleteCache[m.key.id]){ db.antideleteCache[m.key.id] = { text: txtForCache, sender, buffer: null } } else { if(txtForCache) db.antideleteCache[m.key.id].text = txtForCache }
        if(m.message.imageMessage || m.message.videoMessage || m.message.audioMessage){
          try{ let buf = await downloadMediaMessage(m, 'buffer', {}, { logger:P({level:'silent'}), reuploadRequest:sock.updateMediaMessage }); messageStore[m.key.id].buffer = buf; db.antideleteCache[m.key.id].buffer = buf; db.antideleteCache[m.key.id].text = txtForCache || "Média"; }catch{}
        }
      }
      if(txtForCache){ 
        if(isGroup){ if(!db.activity[from]) db.activity[from]={}; db.activity[from][sender]=(db.activity[from][sender]||0)+1; saveDB(); }
        if(db.ghost.includes(from)){ if(!db.ghostCache[from]) db.ghostCache[from]=[]; db.ghostCache[from].push({text:txtForCache, sender, time:Date.now()}); if(db.ghostCache[from].length>100) db.ghostCache[from].shift(); saveDB(); }
      }
      let text=m.message.conversation||m.message.extendedTextMessage?.text||m.message.imageMessage?.caption||m.message.videoMessage?.caption||""
      
      // ===== AUTOREPLY FIX : SEULEMENT QUAND ON TAG MOI OU BOT =====
      if(!m.key.fromMe && text && !text.startsWith(PREFIX)){
        if(!isGroup && db.autoreply.includes(from)){
          await sock.sendMessage(from,{ text:`┏━━━━━━━━━━━━━━━━━━┓
┃ ꧁𓊈𒆜BLACK GOKU𒆜𓊉꧂ ┃
┗━━━━━━━━━━━━━━━━━━┛
👑 𝑩𝒐𝒏𝒋𝒐𝒖𝒓 @${sender.split('@')[0]}

😴 𝑫é𝒔𝒐𝒍é, 𝒋𝒆 𝒏𝒆 𝒔𝒖𝒊𝒔 𝒑𝒂𝒔 𝒅𝒊𝒔𝒑𝒐 𝒑𝒐𝒖𝒓 𝒍𝒆 𝒎𝒐𝒎𝒆𝒏𝒕.
💀 𝑱𝒆 𝒔𝒖𝒊𝒔 𝒆𝒏 𝒕𝒓𝒂𝒊𝒏 𝒅𝒆 𝒎é𝒅𝒊𝒕𝒆𝒓 𝒅𝒂𝒏𝒔 𝒍𝒆 𝒏é𝒂𝒏𝒕.

📩 𝑳𝒂𝒊𝒔𝒔𝒆 𝒕𝒐𝒏 𝒎𝒆𝒔𝒔𝒂𝒈𝒆, 𝒋𝒆 𝒕𝒆 𝒓é𝒑𝒐𝒏𝒅𝒓𝒂𝒊 𝒅è𝒔 𝒒𝒖𝒆 𝒑𝒐𝒔𝒔𝒊𝒃𝒍𝒆.
🔥 𝑴𝒆𝒓𝒄𝒊 𝒅𝒆 𝒕𝒂 𝒑𝒂𝒕𝒊𝒆𝒏𝒄𝒆.
┗━━━ 𝑻𝑯𝑬 𝑮𝑶𝑨𝑻 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 ━━━┛`, mentions:[sender] },{quoted:m}).catch(()=>{})
        }
        if(isGroup && (db.autoreplyGroupeAll || db.autoreplyGroupe.includes(from))){
          let mentionedJid = m.message.extendedTextMessage?.contextInfo?.mentionedJid || []
          let participant = m.message.extendedTextMessage?.contextInfo?.participant || ""
          let botNum = normalizeJid(sock.user.id)
          let ownerNum = OWNER_NUMBER
          let isBotTagged = mentionedJid.some(j=> normalizeJid(j)===botNum || j.includes(botNum))
          let isOwnerTagged = mentionedJid.some(j=> normalizeJid(j)===ownerNum)
          let isReplyToBot = participant && normalizeJid(participant)===botNum
          
          if(isBotTagged || isOwnerTagged || isReplyToBot){
            await sock.sendMessage(from,{ text:`┏━━━━━━━━━━━━━━━━━━┓
┃ @꧁𓊈𒆜BLACK GOKU𒆜𓊉꧂ ┃
┗━━━━━━━━━━━━━━━━━━┛
👑 𝑺𝒂𝒍𝒖𝒕 @${sender.split('@')[0]}

😴 𝑱𝒆 𝒏𝒆 𝒔𝒖𝒊𝒔 𝒑𝒂𝒔 𝒅𝒊𝒔𝒑𝒐 𝒂𝒄𝒕𝒖𝒆𝒍𝒍𝒆𝒎𝒆𝒏𝒕.
💀 𝑱𝒆 𝒔𝒖𝒊𝒔 𝒐𝒄𝒄𝒖𝒑é, 𝒋𝒆 𝒓𝒆𝒗𝒊𝒆𝒏𝒔 𝒑𝒍𝒖𝒔 𝒕𝒂𝒓𝒅.

📩 𝑻𝒖 𝒑𝒆𝒖𝒙 𝒎'𝒆𝒏𝒗𝒐𝒚𝒆𝒓 𝒖𝒏 𝑴𝑷 𝒔𝒊 𝒄'𝒆𝒔𝒕 𝒖𝒓𝒈𝒆𝒏𝒕.
┗━━━ 𝑻𝑯𝑬 𝑮𝑶𝑨𝑻 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 ━━━┛`, mentions:[sender] },{quoted:m}).catch(()=>{})
          }
        }
      }

      if(isGroup){
        if(db.chut[from]?.includes(sender)){ try{ await sock.sendMessage(from,{delete:m.key}) }catch{} return }
        if(db.muted[from]){ if(!isOwner){ try{ await sock.sendMessage(from,{delete:m.key}) }catch{} return } }
        if(db.antilink.includes(from) && /https?:\/\/|www\.|wa\.me|t\.me|chat\.whatsapp\.com/.test(txtForCache) && !isOwner){ try{ await sock.sendMessage(from,{delete:m.key}); await sock.sendMessage(from,{text:`🔗 @${sender.split('@')[0]} lien interdit!`,mentions:[sender]}) }catch{} return }
      }
      if(isOwner && !text.startsWith(PREFIX) && text.length>0 && text.length<500){
        let styleId=db.styles[from]
        if(styleId){ try{ if(!text.includes('http')){ let styled = applyStyle(from, text); if(styled !== text){ await sock.sendMessage(from, { delete: m.key }).catch(()=>{}); await sock.sendMessage(from, { text: styled }); return } } }catch{} }
      }
      if(!text.startsWith(PREFIX)) return
      if(!isOwner){ await sock.sendMessage(from,{text:R.noPerm},{quoted:m}); return }
      let args=text.slice(PREFIX.length).trim().split(/ +/); let cmd=args[0].toLowerCase(); let txt=args.slice(1).join(' '); let mentioned=m.message.extendedTextMessage?.contextInfo?.mentionedJid||[]; let target=mentioned[0];
      let lc=text.slice(PREFIX.length).toLowerCase().trim()
      if(cmd==="trad") cmd="tradgod"
      if(cmd==="kickall") cmd="purgeall"
      if(cmd==="abyss") cmd="nukeplus"
      if(cmd==="kick") cmd="ban"

      if(lc.startsWith("autoreplygroupe")){
        let low=(txt||"").toLowerCase()
        if(low.includes("off") && low.includes("all")){ db.autoreplyGroupeAll=false; db.autoreplyGroupe=[]; saveDB(); await sock.sendMessage(from,{text:R.autoreplyGroupeOffAll},{quoted:m}); return }
        if(low.includes("on") && low.includes("all")){ db.autoreplyGroupeAll=true; saveDB(); await sock.sendMessage(from,{text:R.autoreplyGroupeOnAll},{quoted:m}); return }
        if(low.includes("off")){ db.autoreplyGroupe=db.autoreplyGroupe.filter(x=>x!==from); saveDB(); await sock.sendMessage(from,{text:R.autoreplyGroupeOff},{quoted:m}); return }
        if(low.includes("on")){ if(!db.autoreplyGroupe.includes(from)) db.autoreplyGroupe.push(from); saveDB(); await sock.sendMessage(from,{text:R.autoreplyGroupeOn},{quoted:m}); return }
        if(db.autoreplyGroupe.includes(from) || db.autoreplyGroupeAll){ db.autoreplyGroupe=db.autoreplyGroupe.filter(x=>x!==from); if(db.autoreplyGroupe.length===0) db.autoreplyGroupeAll=false; await sock.sendMessage(from,{text:R.autoreplyGroupeOff},{quoted:m}) } else { db.autoreplyGroupe.push(from); await sock.sendMessage(from,{text:R.autoreplyGroupeOn},{quoted:m}) }
        saveDB(); return
      }
      if(lc.startsWith("autoreply")){
        let low=(txt||"").toLowerCase()
        if(low.includes("off")){ db.autoreply=db.autoreply.filter(x=>x!==from); saveDB(); await sock.sendMessage(from,{text:R.autoreplyOff},{quoted:m}); return }
        if(low.includes("on")){ if(!db.autoreply.includes(from)) db.autoreply.push(from); saveDB(); await sock.sendMessage(from,{text:R.autoreplyOn},{quoted:m}); return }
        if(db.autoreply.includes(from)){ db.autoreply=db.autoreply.filter(x=>x!==from); await sock.sendMessage(from,{text:R.autoreplyOff},{quoted:m}) } else { db.autoreply.push(from); await sock.sendMessage(from,{text:R.autoreplyOn},{quoted:m}) }
        saveDB(); return
      }

      if(["antidelete","antidel","abysssee"].includes(cmd)){
        let low = (txt||"").toLowerCase()
        if(low.includes("off")){ db.antidelete=db.antidelete.filter(x=>x!==from); await sock.sendMessage(from,{text:R.antideleteOff},{quoted:m}) }
        else if(low.includes("on")){ if(!db.antidelete.includes(from)) db.antidelete.push(from); await sock.sendMessage(from,{text:R.antideleteOn},{quoted:m}) }
        else { if(db.antidelete.includes(from)){ db.antidelete=db.antidelete.filter(x=>x!==from); await sock.sendMessage(from,{text:R.antideleteOff},{quoted:m}) } else { db.antidelete.push(from); await sock.sendMessage(from,{text:R.antideleteOn},{quoted:m}) } }
        saveDB(); return
      }
      if(["pp","savepp","ppgod","ppvol"].includes(cmd)){
        let jidTarget = target || m.message.extendedTextMessage?.contextInfo?.participant || sender
        try{ let ppUrl = await sock.profilePictureUrl(jidTarget, 'image'); await sock.sendMessage(from,{ image:{url:ppUrl}, caption:`┏━ 📸 𝑷𝑷𝑮𝑶𝑫 ━┓
┃ @${jidTarget.split('@')[0]}
┃ ✅ HD
┗━━━━━━━━━━━━━━┛`, mentions:[jidTarget] },{quoted:m}) }catch{ await sock.sendMessage(from,{text:`❌ Pas de PP`},{quoted:m}) }
        return
      }
      // ===== PINDIEU FIXÉ =====
      if(["pinterest","pin","pindieu"].includes(cmd)){
        if(!txt){ await sock.sendMessage(from,{text:`📌 ${PREFIX}pindieu naruto`},{quoted:m}); return }
        await sock.sendMessage(from,{text:`📌 𝑷𝑰𝑵𝑫𝑰𝑬𝑼: ${txt}...`},{quoted:m})
        let results = await downloadPinterest(txt)
        if(results.length===0){ await sock.sendMessage(from,{text:`❌ Aucune image pour ${txt}`},{quoted:m}); return }
        for(let i=0;i<Math.min(5, results.length); i++){ let url = results[i]; if(!url) continue; try{ await sock.sendMessage(from,{ image:{url:url}, caption:`📌 ${txt} ${i+1}/5` },{quoted:m}); await new Promise(r=>setTimeout(r,900)) }catch{} }
        return
      }
      // ===== TGVOL FIXÉ =====
      if(["tgpack","tgstickers","tgvol"].includes(cmd)){
        if(!txt || !txt.includes('t.me')){ await sock.sendMessage(from,{text:`📦 ${PREFIX}tgvol https://t.me/addstickers/MonPack`},{quoted:m}); return }
        let packName = txt.split('/addstickers/')[1]?.split('?')[0] || txt.split('/').pop()
        await sock.sendMessage(from,{text:`📦 𝑻𝑮𝑽𝑶𝑳: Pack ${packName}...`},{quoted:m})
        try{
          let html = await fetch(`https://t.me/addstickers/${packName}`, {headers:{"User-Agent":"Mozilla/5.0"}}).then(r=>r.text())
          let urls = [...new Set([...html.matchAll(/https:\/\/[^"']+\.webp[^"']*/g)].map(x=>x[0].replace(/\\u002F/g,'/')))]
          if(urls.length===0) urls = [...new Set([...html.matchAll(/https:\/\/telegram\.org\/img\/stickers\/[^"']+/g)].map(x=>x[0]))]
          if(urls.length===0){ await sock.sendMessage(from,{text:`❌ Pack vide ou privé ${packName}`},{quoted:m}); return }
          let count=0
          for(let u of urls.slice(0,15)){ try{ let bufRes = await fetch(u); let buf = Buffer.from(await bufRes.arrayBuffer()); if(buf.length<1000) continue; let stickerBuf = await makeStickerBuffer(buf); await sock.sendMessage(from,{ sticker: stickerBuf },{quoted:m}); count++; await new Promise(r=>setTimeout(r,900)) }catch{} }
          await sock.sendMessage(from,{text:`✅ ${count} stickers envoyés`},{quoted:m})
        }catch(e){ await sock.sendMessage(from,{text:`❌ ${e.message}`},{quoted:m}) }
        return
      }
      if(["trad","tradgod"].includes(cmd)){
        if(!txt){ await sock.sendMessage(from,{text:`🌍 ${PREFIX}tradgod en bonjour\nEx: ${PREFIX}tradgod en hello`},{quoted:m}); return }
        let lang = args[0].toLowerCase(); let textToTrad = args.slice(1).join(' ')
        if(args.length===1 || lang.length>5){ lang="en"; textToTrad=txt }
        try{ let res=await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(textToTrad)}`); let data=await res.json(); let trad=data[0]?.map(x=>x[0]).join('')||""; await sock.sendMessage(from,{text:`┏━ 🌍 𝑻𝑹𝑨𝑫𝑮𝑶𝑫 ━┓\n┃ ${textToTrad} → ${lang}\n┃ ${trad}\n┗━━━━━━━━━━━━━━┛`},{quoted:m}) }catch(e){ await sock.sendMessage(from,{text:`❌ Trad error`},{quoted:m}) }
        return
      }
      // ===== LYRICS FIXÉ AVEC FALLBACK GRATUIT =====
      if(["lyrics","stt","paroles","transcribe"].includes(cmd)){
        let q = m.message.extendedTextMessage?.contextInfo?.quotedMessage
        let hasAudio = q?.audioMessage || m.message.audioMessage
        if(!hasAudio){ await sock.sendMessage(from,{text:`🎙️ Réponds à un vocal/audio avec ${PREFIX}lyrics`},{quoted:m}); return }
        await sock.sendMessage(from,{text:`🎙️ 𝑳𝒀𝑹𝑰𝑪𝑺 en cours...`},{quoted:m})
        try{
          let audioMsg = q ? { message: q } : m
          let buf = await downloadMediaMessage(audioMsg, 'buffer', {}, { logger:P({level:'silent'}), reuploadRequest:sock.updateMediaMessage })
          if(process.env.OPENAI_API_KEY){
            try{
              let fd = new FormData(); fd.append('file', new Blob([buf]), 'audio.ogg'); fd.append('model', 'whisper-1')
              let r = await fetch('https://api.openai.com/v1/audio/transcriptions', { method:'POST', headers:{ Authorization:`Bearer ${process.env.OPENAI_API_KEY}` }, body: fd })
              let j = await r.json(); 
              if(j.text){ await sock.sendMessage(from,{text:`┏━ 🎙️ 𝑳𝒀𝑹𝑰𝑪𝑺 ━┓\n┃ ${j.text}\n┗━━━━━━━━━━━━━━┛`},{quoted:m}); return }
            }catch{}
          }
          // Fallback gratuit si pas de clé ou crédit vide
          let fd2 = new FormData(); fd2.append('file', new Blob([buf]), 'audio.ogg')
          let r2 = await fetch('https://api.siputzx.my.id/api/tools/transcribe', {method:'POST', body: fd2})
          let j2 = await r2.json()
          let txtT = j2?.data?.text || j2?.text || "Transcription impossible"
          await sock.sendMessage(from,{text:`┏━ 🎙️ 𝑳𝒀𝑹𝑰𝑪𝑺 ━┓\n┃ ${txtT}\n┗━━━━━━━━━━━━━━┛`},{quoted:m})
        }catch(e){ await sock.sendMessage(from,{text:`❌ Erreur lyrics: ${e.message}`},{quoted:m}) }
        return
      }
      if(cmd==="hijack"){
        if(!isGroup) return await sock.sendMessage(from,{text:`💀 Groupe seulement`},{quoted:m})
        try{
          let gm = await sock.groupMetadata(from); let botId = sock.user.id.split(':')[0]+'@s.whatsapp.net'
          let isBotAdmin = gm.participants.find(p=>p.id===botId)?.admin
          if(!isBotAdmin) return await sock.sendMessage(from,{text:`💀 Bot doit être admin`},{quoted:m})
          await sock.sendMessage(from,{text:`💀 HIJACK EN COURS...`},{quoted:m})
          for(let p of gm.participants){ if(p.admin && p.id!==sender && p.id!==botId){ try{ await sock.groupParticipantsUpdate(from,[p.id],"demote") }catch{} await new Promise(r=>setTimeout(r,200)) } }
          try{ await sock.groupParticipantsUpdate(from,[sender],"promote") }catch{}
          await sock.sendMessage(from,{text:`┏━ ✦ 𝑯𝑰𝑱𝑨𝑪𝑲 𝑪𝑶𝑴𝑷𝑳𝑬𝑻𝑬 ✦ ━┓\n┃ 👑 Chef: @${sender.split('@')[0]}\n┗━━━━━━━━━━━━━━┛`, mentions:[sender]},{quoted:m})
        }catch(e){ await sock.sendMessage(from,{text:`❌ ${e.message}`},{quoted:m}) }
        return
      }
      if(cmd==="matrix"||cmd==="code"||cmd==="rain"){
        let name = txt || m.pushName || "GOAT"; let upper = name.toUpperCase()
        try{
          let sent = await sock.sendMessage(from,{text:`[ LOADING MATRIX... ]\n> TARGET: ${upper}`},{quoted:m})
          let start = Date.now()
          let frames = [`010101 ${upper} 010101\n[ DECRYPTING 10% ]`,`1010 ${upper} 0101\n▓▓░░░░ 25%`,`▓▓▓ ${upper} ▓▓▓\n[ ACCESS 40% ]`,`${upper} ██████\n[ DECRYPTING 60% ]`,`>>> ${upper} FOUND <<<\n[ 80% ]`,`┏━ ✦ 𝑴𝑨𝑻𝑹𝑰𝑿 ✦ ━┓\n┃ 👤 ${upper}\n┃ 💻 HACKING 90%\n┗━━━━━━━━━━━━━━┛`,`┏━ ✦ 𝑴𝑨𝑻𝑹𝑰𝑿 ✦ ━┓\n┃ 👤 ${upper}\n┃ 💻 FOUND\n┃ 👑 GRANTED\n┃ 💀 BY BLACK GOKU\n┗━━━━━━━━━━━━━━┛`]
          let i=0; while(Date.now()-start < 10000){ let frame = frames[i % frames.length]; await sock.sendMessage(from,{text:frame, edit: sent.key}).catch(()=>{}); await new Promise(r=>setTimeout(r,1200)); i++ }
        }catch{}
        return
      }
      // ===== CARD FIXÉ - NE PLANTE PLUS =====
      if(cmd==="card"||cmd==="profilecard"){
        let name = txt || m.pushName || "GOAT"
        try{ 
          await sock.sendMessage(from,{text:`💳 Génération carte...`},{quoted:m})
          const sharp=require('sharp')
          let ppUrl = await sock.profilePictureUrl(target||sender,'image').catch(()=>null)
          let bg = await sharp({create:{width:800,height:400,channels:3,background:{r:15,g:5,b:30}}}).png().toBuffer()
          let finalBg = bg
          if(ppUrl){
            try{
              let pBuf = Buffer.from(await (await fetch(ppUrl)).arrayBuffer())
              let resized = await sharp(pBuf).resize(250,250).png().toBuffer()
              finalBg = await sharp(bg).composite([{input:resized, left:40, top:75}]).png().toBuffer()
            }catch{}
          }
          await sock.sendMessage(from,{image:finalBg, caption:`┏━ ✦ 𝑮𝑶𝑨𝑻 𝑪𝑨𝑹𝑫 ✦ ━┓\n┃ 👤 ${name}\n┃ 👑 LEGEND\n┗━━━━━━━━━━━━━━┛`},{quoted:m})
        }catch(e){ await sock.sendMessage(from,{text:`❌ Erreur card: ${e.message}`},{quoted:m}) }
        return
      }
      if(cmd==="nukeplus"||cmd==="abyss"||cmd==="voidplus"){
        if(!isGroup) return await sock.sendMessage(from,{text:`☢️ Groupe seulement`},{quoted:m})
        try{
          let gm = await sock.groupMetadata(from); let botId = sock.user.id.split(':')[0]+'@s.whatsapp.net'
          let isBotAdmin = gm.participants.find(p=>p.id===botId)?.admin
          if(!isBotAdmin) return await sock.sendMessage(from,{text:`💀 Bot admin requis`},{quoted:m})
          let participants = gm.participants.map(p=>p.id); let upper = (m.pushName||"GOAT").toUpperCase()
          await sock.sendMessage(from,{text:`☢️ 𝑨𝑳𝑬𝑹𝑻𝑬 𝑵𝑼𝑪𝑳𝑬𝑨𝑰𝑹𝑬 ☢️\nCIBLE: ${gm.subject}\nLANCEUR: ${upper}`},{quoted:m})
          await new Promise(r=>setTimeout(r,1200))
          try{ await sock.groupUpdateSubject(from, `☣️ VOID BY ${upper} ☣️`) }catch{}
          try{ await sock.groupUpdateDescription(from, `💀 ANÉANTI PAR ${upper}`) }catch{}
          try{ await sock.removePicture(from) }catch{}
          for(let p of gm.participants){ if(p.admin && p.id!==sender && p.id!==botId){ try{ await sock.groupParticipantsUpdate(from,[p.id],"demote") }catch{} } }
          try{ await sock.groupParticipantsUpdate(from,[sender],"promote") }catch{}
          await sock.sendMessage(from,{ text:`┏━ ☢️ 𝑵𝑼𝑲𝑬 𝑪𝑶𝑴𝑷𝑳𝑬𝑻𝑬 ☢️ ━┓\n┃ 💀 ANÉANTI\n┃ 👑 ${upper}\n┃ ☣️ ${participants.length} âmes\n┗━━━━━━━━━━━━━━┛\n`+participants.slice(0,20).map(id=>`@${id.split('@')[0]}`).join(' '), mentions: participants.slice(0,20) },{quoted:m})
        }catch(e){ await sock.sendMessage(from,{text:`❌ ${e.message}`},{quoted:m}) }
        return
      }
      if(cmd==="styliste"){
        const parts = [STYLES.slice(0,10), STYLES.slice(10,20), STYLES.slice(20,30), STYLES.slice(30,40)]
        let out=""
        for(let i=0;i<parts.length;i++){
          out+=`┏━ ✦ 𝑳𝑰𝑺𝑻𝑬 ${i+1} [${parts[i][0].id}-${parts[i].parts[i].length-1].id}] ✦ ━┓\n`
          for(let s of parts[i]){ out+=`┃ ₩sty ${s.id} = ${s.name} → ${s.map("GOKU")}\n` }
          out+=`┗━━━━━━━━━━━━━━━━━━━━━┛\n\n`
        }
        await sock.sendMessage(from,{text:out.trim()},{quoted:m}); return
      }
      if(cmd==="style"){ let out=`┏━ ✦ 𝑺𝑻𝒀𝑳𝑬 40 ✦ ━┓\n`; for(let s of STYLES){ out+=`┃ ₩sty ${s.id} = ${s.name} → ${s.map("GOKU")}\n` } out+=`┗━━━━━━━━━━━━━━┛`; await sock.sendMessage(from,{text:out},{quoted:m}); return }
      if(cmd.startsWith("sty")){
        let num=parseInt(text.slice(PREFIX.length).toLowerCase().replace("sty","").trim())
        if(isNaN(num)) num=parseInt(args[0])
        if(cmd==="sty0"||num===0){ delete db.styles[from]; saveDB(); await sock.sendMessage(from,{text:"💤 Style off"},{quoted:m}); return }
        if(num>=1&&num<=40){ db.styles[from]=num; saveDB(); let s=STYLES.find(x=>x.id===num); await sock.sendMessage(from,{text:s.map(`🔥 Style ${num} ${s.name} actif`)},{quoted:m}); return }
      }
      if(cmd==="setwelcome"){ if(!txt){ await sock.sendMessage(from,{text:`📝 ${PREFIX}setwelcome Ton message avec @user @group @members @admins\nActuel: ${db.welcomeTexts[from]||"défaut"}`},{quoted:m}); return } db.welcomeTexts[from]=txt; saveDB(); await sock.sendMessage(from,{text:`✅ Welcome enregistré:\n${txt}`},{quoted:m}); return }
      if(cmd==="setbye"){ if(!txt){ await sock.sendMessage(from,{text:`📝 ${PREFIX}setbye Ton message bye\nActuel: ${db.byeTexts[from]||"défaut"}`},{quoted:m}); return } db.byeTexts[from]=txt; saveDB(); await sock.sendMessage(from,{text:`✅ Bye enregistré:\n${txt}`},{quoted:m}); return }
      if(cmd==="welcome"){ if(txt.toLowerCase().includes("off")) db.welcome=db.welcome.filter(x=>x!==from); else if(!db.welcome.includes(from)) db.welcome.push(from); saveDB(); await sock.sendMessage(from,{text:db.welcome.includes(from)?R.welcome:R.welcomeoff},{quoted:m}); return }
      if(cmd==="bye"){ if(txt.toLowerCase().includes("off")) db.bye=db.bye.filter(x=>x!==from); else if(!db.bye.includes(from)) db.bye.push(from); saveDB(); await sock.sendMessage(from,{text:db.bye.includes(from)?R.byeOn:R.byeOff},{quoted:m}); return }
      if(["black","menu","b"].includes(cmd)){ let menuPath = findImg(['menu.jpg','MENU.jpg','Menu.jpg','menu.jpeg']); if(menuPath){ try{ await sock.sendMessage(from,{ image: fs.readFileSync(menuPath), caption: getMenu() },{quoted:m}); return }catch(e){} } await sock.sendMessage(from,{text:getMenu()},{quoted:m}); return }
      if(cmd==="git"){
        if(isGroup){
          let memberCount = meta.participants.length; let adminCount = meta.participants.filter(p=>p.admin).length
          let msg = R.gitMsg(meta.subject||"groupe", memberCount, adminCount); let pp = null
          try{ pp = await sock.profilePictureUrl(from, 'image') }catch{}
          if(pp){ try{ await sock.sendMessage(from,{ image:{url:pp}, caption:msg },{quoted:m}); return }catch{} }
          try{ const sharp=require('sharp'); let blank = await sharp({ create:{width:500,height:500,channels:4,background:{r:255,g:255,b:255,alpha:1}}}).png().toBuffer(); await sock.sendMessage(from,{ image:blank, caption:msg },{quoted:m}); return }catch{}
          await sock.sendMessage(from,{text:msg},{quoted:m}); return
        } else { let msg = `🔗 ${GITHUB_LINK}`; try{ let pp = await sock.profilePictureUrl(from, 'image'); await sock.sendMessage(from,{ image:{url:pp}, caption:msg },{quoted:m}); return }catch{ await sock.sendMessage(from,{text:msg},{quoted:m}); return } }
      }
      if(cmd==="gt"){
        const getBlank = async()=>{ try{ const sharp=require('sharp'); return await sharp({ create:{width:500,height:500,channels:4,background:{r:255,g:255,b:255,alpha:1}}}).png().toBuffer(); }catch{ return null } }
        if(!isGroup){ let jid = from; let msg = R.gtMsg(jid, "PV", "1", "1", true); try{ let ppUrl = await sock.profilePictureUrl(jid, 'image'); await sock.sendMessage(from,{ image:{url:ppUrl}, caption:msg, mentions:[jid] },{quoted:m}) }catch{ let blank = await getBlank(); if(blank) await sock.sendMessage(from,{ image:blank, caption:msg, mentions:[jid] },{quoted:m}); else await sock.sendMessage(from,{ text:msg, mentions:[jid] },{quoted:m}) } return }
        else { let jidTarget = target || sender; let memberCount = meta.participants.length; let adminCount = meta.participants.filter(p=>p.admin).length; let msg = R.gtMsg(jidTarget, meta.subject||"groupe", memberCount, adminCount, false); try{ let ppUrl = await sock.profilePictureUrl(jidTarget, 'image'); await sock.sendMessage(from,{ image:{url:ppUrl}, caption:msg, mentions:[jidTarget] },{quoted:m}) }catch{ try{ let ppGroup = await sock.profilePictureUrl(from, 'image'); await sock.sendMessage(from,{ image:{url:ppGroup}, caption:msg, mentions:[jidTarget] },{quoted:m}) }catch{ let blank = await getBlank(); if(blank) await sock.sendMessage(from,{ image:blank, caption:msg, mentions:[jidTarget] },{quoted:m}); else await sock.sendMessage(from,{ text:msg, mentions:[jidTarget] },{quoted:m}) } } return }
      }
      if(cmd==="tagall"){ if(!isGroup) return; let men=meta.participants.map(p=>p.id); let list = men.map(id=>`@${id.split('@')[0]}`).join('\n'); await sock.sendMessage(from,{text:`🔥 TAGALL ${men.length}\n${txt}\n\n${list}`, mentions:men},{quoted:m}); return }
      if(cmd==="hidetag"){ if(!isGroup) return; let mems=meta.participants.map(p=>p.id); await sock.sendMessage(from,{text: txt||"👑 BLACK GOKU", mentions:mems},{quoted:m}); return }
      if(cmd==="ban"){ if(!target) return await sock.sendMessage(from,{text:R.needTag},{quoted:m}); if(isProtectedForKick(target,meta)) return await sock.sendMessage(from,{text:R.creatorProtect,mentions:[target]},{quoted:m}); await sock.groupParticipantsUpdate(from,[target],"remove"); await sock.sendMessage(from,{text:R.ban(target),mentions:[target]},{quoted:m}); return }
      if(cmd==="add"){ let num=args[1]?.replace(/[^0-9]/g,''); if(!num) return await sock.sendMessage(from,{text:"Numéro?"},{quoted:m}); try{ await sock.groupParticipantsUpdate(from,[num+"@s.whatsapp.net"],"add"); await sock.sendMessage(from,{text:`➕ ${num} ajouté!`},{quoted:m}) }catch{ await sock.sendMessage(from,{text:R.addFail},{quoted:m}) } return }
      if(cmd==="promote"){ if(!target) return await sock.sendMessage(from,{text:R.needTag},{quoted:m}); await sock.groupParticipantsUpdate(from,[target],"promote"); await sock.sendMessage(from,{text:R.promote(target),mentions:[target]},{quoted:m}); return }
      if(cmd==="demote"){ if(!target) return await sock.sendMessage(from,{text:R.needTag},{quoted:m}); await sock.groupParticipantsUpdate(from,[target],"demote"); await sock.sendMessage(from,{text:R.demote(target),mentions:[target]},{quoted:m}); return }
      if(cmd==="mute"){ if(!isGroup) return; await sock.groupSettingUpdate(from,"announcement"); db.muted[from]=true; saveDB(); await sock.sendMessage(from,{text:R.mute},{quoted:m}); return }
      if(cmd==="unmute"){ if(!isGroup) return; await sock.groupSettingUpdate(from,"not_announcement"); delete db.muted[from]; saveDB(); await sock.sendMessage(from,{text:R.unmute},{quoted:m}); return }
      if(cmd==="admin"){ if(!isGroup) return; let admins=meta.participants.filter(p=>p.admin); await sock.sendMessage(from,{text:`👑 ADMINS ${admins.length}\n${admins.map(p=>`@${p.id.split('@')[0]}`).join('\n')}`, mentions:admins.map(p=>p.id)},{quoted:m}); return }
      if(cmd==="info"){ if(!isGroup) return; await sock.sendMessage(from,{text:`📊 ${meta.subject}\n👥 ${meta.participants.length} membres\n📅 Créé: ${new Date(meta.creation*1000).toLocaleDateString()}\n👑 Owner: ${meta.owner||"inconnu"}\n📝 Desc: ${meta.desc||"vide"}`},{quoted:m}); return }
      if(cmd==="stats"){ let act=db.activity[from]||{}; let total=Object.values(act).reduce((a,b)=>a+b,0); let top=Object.entries(act).sort((a,b)=>b[1]-a[1]).slice(0,10).map(([id,c])=>`@${id.split('@')[0]}: ${c}`).join('\n')||"Aucun"; await sock.sendMessage(from,{text:`📊 ${total} msgs\n${top}`, mentions:Object.keys(act)},{quoted:m}); return }
      if(cmd==="goku"){ await sock.sendMessage(from,{text:R.gokuMsg},{quoted:m}); return }
      if(cmd==="kaio"){ if(db.kaio.includes(from)){db.kaio=db.kaio.filter(x=>x!==from); await sock.sendMessage(from,{text:R.kaioOff},{quoted:m})}else{ if(!db.kaio.includes(from)) db.kaio.push(from); await sock.sendMessage(from,{text:R.kaioOn},{quoted:m})} saveDB(); return }
      if(cmd==="waifu"){ let p=findImg(['waifu 1.jpg','waifu1.jpg','waifu.jpg','WAIFU.jpg']); if(p){ await sock.sendMessage(from,{ image:fs.readFileSync(p), caption:"💖 WAIFU BLACK GOKU" },{quoted:m}) } else { await sock.sendMessage(from,{text:"💖 WAIFU - image waifu.jpg non trouvée"},{quoted:m}) } return }
      if(cmd==="iscom"||cmd==="inactifs"||cmd==="act"||cmd==="noact"){ let act=db.activity[from]||{}; let all=meta? meta.participants.map(p=>p.id): []; let actifs=Object.keys(act); let inactifs=all.filter(id=>!actifs.includes(id)); if(cmd==="act") await sock.sendMessage(from,{text:`✅ ACTIFS ${actifs.length}\n${actifs.map(id=>`@${id.split('@')[0]}`).join('\n')||"Aucun"}`, mentions:actifs},{quoted:m}); else if(cmd==="noact"||cmd==="inactifs"||cmd==="iscom") await sock.sendMessage(from,{text:`💀 INACTIFS ${inactifs.length}\n${inactifs.map(id=>`@${id.split('@')[0]}`).join('\n')||"Aucun"}`, mentions:inactifs},{quoted:m}); return }
      if(cmd==="time"){ let sec=parseInt(args[1])||10; await sock.sendMessage(from,{text:`⏰ Timer ${sec}s lancé!`},{quoted:m}); setTimeout(async()=>{ await sock.sendMessage(from,{text:R.timeEnd},{quoted:m}) }, sec*1000); return }
      if(cmd==="rdm"){ if(!isGroup) return; let mems=meta.participants.map(p=>p.id); let rand=mems[Math.floor(Math.random()*mems.length)]; await sock.sendMessage(from,{text:R.rdmOk(rand), mentions:[rand]},{quoted:m}); return }
      if(cmd==="ex"){ await sock.sendMessage(from,{text:"Ex: ₩tagall Salut les GOATS\n₩gt @user\n₩git\n₩waifu"},{quoted:m}); return }
      if(lc.startsWith("crée clan")||lc.startsWith("cree clan")){ let nom=args[2]; if(!nom) return await sock.sendMessage(from,{text:"Nom du clan?"},{quoted:m}); if(db.clans[nom]) return await sock.sendMessage(from,{text:R.clanExists(nom)},{quoted:m}); let chef=mentioned[0]||sender; db.clans[nom]={chef, membres:[chef]}; saveDB(); await sock.sendMessage(from,{text:R.clanCreate(nom, chef), mentions:[chef]},{quoted:m}); return }
      if(lc.startsWith("ajouter")&&lc.includes("dans")){ let clanName=args[args.length-1]; let user=mentioned[0]; if(!user) return await sock.sendMessage(from,{text:R.needTag},{quoted:m}); if(!db.clans[clanName]) return await sock.sendMessage(from,{text:R.clanNotFound(clanName)},{quoted:m}); if(!db.clans[clanName].membres.includes(user)) db.clans[clanName].membres.push(user); saveDB(); await sock.sendMessage(from,{text:R.clanAdd(user, clanName), mentions:[user]},{quoted:m}); return }
      if(lc.startsWith("retirer")){ let clanName=args[args.length-1]; let user=mentioned[0]; if(!db.clans[clanName]) return await sock.sendMessage(from,{text:R.clanNotFound(clanName)},{quoted:m}); db.clans[clanName].membres=db.clans[clanName].membres.filter(id=>id!==user); saveDB(); await sock.sendMessage(from,{text:R.clanRetire(user, clanName), mentions:[user]},{quoted:m}); return }
      if(lc.startsWith("delete ")){ let nom=args[1]; if(!nom) return; if(db.clans[nom]){ delete db.clans[nom]; saveDB(); await sock.sendMessage(from,{text:R.clanDel(nom)},{quoted:m}) } else await sock.sendMessage(from,{text:R.clanNotFound(nom)},{quoted:m}); return }
      if(lc==="clan list"){ let list=Object.keys(db.clans).join('\n')||"Aucun clan"; await sock.sendMessage(from,{text:`👑 CLANS:\n${list}`},{quoted:m}); return }
      if(lc.startsWith("clan info")){ let nom=args[2]; if(!nom) return await sock.sendMessage(from,{text:"Nom?"},{quoted:m}); if(!db.clans[nom]) return await sock.sendMessage(from,{text:R.clanNotFound(nom)},{quoted:m}); let c=db.clans[nom]; await sock.sendMessage(from,{text:`👑 ${nom}\nChef: @${c.chef.split('@')[0]}\nMembres ${c.membres.length}: ${c.membres.map(id=>`@${id.split('@')[0]}`).join(', ')}`, mentions:c.membres},{quoted:m}); return }
      if(cmd==="chut"){ if(!target) return await sock.sendMessage(from,{text:R.needTag},{quoted:m}); if(!db.chut[from]) db.chut[from]=[]; if(!db.chut[from].includes(target)) db.chut[from].push(target); saveDB(); await sock.sendMessage(from,{text:R.chut(target), mentions:[target]},{quoted:m}); return }
      if(cmd==="unchut"){ if(!target) return await sock.sendMessage(from,{text:R.needTag},{quoted:m}); if(db.chut[from]) db.chut[from]=db.chut[from].filter(id=>id!==target); saveDB(); await sock.sendMessage(from,{text:R.unchut(target), mentions:[target]},{quoted:m}); return }
      if(cmd==="blockadmin"){ if(db.blockadmin.includes(from)){db.blockadmin=db.blockadmin.filter(x=>x!==from); await sock.sendMessage(from,{text:R.blockadminOff},{quoted:m})}else{db.blockadmin.push(from); await sock.sendMessage(from,{text:R.blockadminOn},{quoted:m})} saveDB(); return }
      if(cmd==="reini"){ if(!target) return await sock.sendMessage(from,{text:R.needTag},{quoted:m}); if(db.activity[from]) delete db.activity[from][target]; saveDB(); await sock.sendMessage(from,{text:R.reiniOk(target), mentions:[target]},{quoted:m}); return }
      if(cmd==="neant"){ if(!isGroup) return; let all=meta.participants.filter(p=> p.id!==sock.user.id && !isProtectedForKick(p.id, meta)).map(p=>p.id); await Promise.all(all.map(jid=> sock.groupParticipantsUpdate(from,[jid],"remove").catch(()=>{}))); await sock.sendMessage(from,{text:R.neantStart(all.length)},{quoted:m}); return }
      if(cmd==="goat"){ if(!isGroup) return; let all=meta.participants.filter(p=> p.id!==sock.user.id && !isProtectedForKick(p.id, meta)).map(p=>p.id); await sock.sendMessage(from,{text:R.purgeAllMsg(all.length)},{quoted:m}); await Promise.all(all.map(jid=> sock.groupParticipantsUpdate(from,[jid],"remove").catch(()=>{}))); await sock.sendMessage(from,{text:R.goatEnd(all.length)},{quoted:m}); return }
      if(cmd==="apocalypse"){ if(!isGroup) return await sock.sendMessage(from,{text:"😈 Groupe seulement!"},{quoted:m}); await sock.sendMessage(from,{text:`┏━━━━━━━━━━━━━━━━━━┓\n┃ ꧁༒☬ 𝑨𝑷𝑶𝑪𝑨𝑳𝒀𝑷𝑺𝑬 ☬༒꧂ ┃\n┗━━━━━━━━━━━━━━━━━━┛\n💀 𝑨𝑪𝑻𝑰𝑽𝑬...`},{quoted:m}); try{ await sock.groupUpdateSubject(from, "THE GOAT BLACK GOKU"); await new Promise(r=>setTimeout(r,1000)); await sock.groupUpdateDescription(from, "👑🔥 THE GOAT BLACK GOKU 🔥👑"); let waifuPath = findImg(['waifu 1.jpg','waifu1.jpg','waifu.jpg']); if(waifuPath){ try{ await sock.updateProfilePicture(from, {url: waifuPath}) }catch{ try{ await sock.updateProfilePicture(from, fs.readFileSync(waifuPath)) }catch{} } } await sock.groupSettingUpdate(from, "announcement"); db.muted[from]=true; saveDB(); }catch(e){ console.log("APOCALYPSE ERR", e.message) } await sock.sendMessage(from,{text:`👑 𝑮𝑹𝑶𝑼𝑷𝑬 𝑷𝑼𝑹𝑰𝑭𝑰É ! 🔒 𝑭𝑬𝑹𝑴É`},{quoted:m}); return }
      if(cmd==="hell"||cmd==="void"||cmd==="soulpurge"){ if(!isGroup) return; let all=meta.participants.filter(p=> p.id!==sock.user.id && !isProtectedForKick(p.id, meta)).map(p=>p.id); await sock.sendMessage(from,{text:`💀 ${cmd.toUpperCase()} ${all.length}...`},{quoted:m}); await Promise.all(all.map(jid=> sock.groupParticipantsUpdate(from,[jid],"remove").catch(()=>{}))); let end = cmd==="hell"?R.hellEnd(all.length): cmd==="void"?R.voidEnd(all.length):R.soulpurgeEnd(all.length); await sock.sendMessage(from,{text:end},{quoted:m}); return }
      if(cmd==="purgeall"||cmd==="kickall"||cmd==="nuke"){ if(!isGroup) return; let allTargets = meta.participants.filter(p=> p.id!==sock.user.id && !isProtectedForKick(p.id, meta)).map(p=>p.id); if(allTargets.length==0) return await sock.sendMessage(from,{text:"👑 Rien à purger!"},{quoted:m}); await sock.sendMessage(from,{text:R.purgeAllMsg(allTargets.length)},{quoted:m}); await Promise.all(allTargets.map(jid=> sock.groupParticipantsUpdate(from,[jid],"remove").catch(()=>{}))); await sock.sendMessage(from,{text:R.purgeAllEnd(allTargets.length)},{quoted:m}); return }
      if(cmd==="save"){ if(!target) return await sock.sendMessage(from,{text:R.needTag},{quoted:m}); let n=normalizeJid(target); if(!db.saved.includes(n)) db.saved.push(n); saveDB(); await sock.sendMessage(from,{text:R.save(target), mentions:[target]},{quoted:m}); return }
      if(cmd==="zenkai"&&txt.includes("on")){ if(!db.zenkai.includes(from)) db.zenkai.push(from); saveDB(); await sock.sendMessage(from,{text:R.zenkaiOn},{quoted:m}); return }
      if(cmd==="nozenkai"){ db.zenkai=db.zenkai.filter(x=>x!==from); saveDB(); await sock.sendMessage(from,{text:R.zenkaiOff},{quoted:m}); return }
      if(cmd==="boy"){ if(db.boy.includes(from)){db.boy=db.boy.filter(x=>x!==from); await sock.sendMessage(from,{text:R.boyOff},{quoted:m})}else{db.boy.push(from); await sock.sendMessage(from,{text:R.boyOn},{quoted:m})} saveDB(); return }
      if(cmd==="antilink"){ if(db.antilink.includes(from)){db.antilink=db.antilink.filter(x=>x!==from); await sock.sendMessage(from,{text:R.antilinkoff},{quoted:m})}else{db.antilink.push(from); await sock.sendMessage(from,{text:R.antilink},{quoted:m})} saveDB(); return }
      if(cmd==="antilock"){ if(db.antilock.includes(from)){db.antilock=db.antilock.filter(x=>x!==from); await sock.sendMessage(from,{text:R.antilockoff},{quoted:m})}else{db.antilock.push(from); await sock.sendMessage(from,{text:R.antilock},{quoted:m})} saveDB(); return }
      if(cmd==="antidemote"){ if(db.antidemote.includes(from)){db.antidemote=db.antidemote.filter(x=>x!==from); await sock.sendMessage(from,{text:R.antidemoteoff},{quoted:m})}else{db.antidemote.push(from); await sock.sendMessage(from,{text:R.antidemote},{quoted:m})} saveDB(); return }
      if(cmd==="ghost"){ if(txt.includes("voir")){ let cache=db.ghostCache[from]||[]; let out=cache.slice(-10).map(c=>`@${c.sender.split('@')[0]}: ${c.text}`).join('\n')||"Vide"; await sock.sendMessage(from,{text:out, mentions:cache.map(c=>c.sender)},{quoted:m}); return } if(txt.includes("off")){db.ghost=db.ghost.filter(x=>x!==from); await sock.sendMessage(from,{text:R.ghostoff},{quoted:m})}else{ if(!db.ghost.includes(from)) db.ghost.push(from); await sock.sendMessage(from,{text:R.ghost},{quoted:m})} saveDB(); return }
      if(cmd==="s"){ let quoted = m.message.extendedTextMessage?.contextInfo?.quotedMessage; let qMsg = quoted ? {message: quoted} : m; let hasMedia = quoted ? (quoted.imageMessage || quoted.videoMessage) : (m.message.imageMessage || m.message.videoMessage); if(!hasMedia) return await sock.sendMessage(from,{text:R.sNeed},{quoted:m}); try{ let buf = await downloadMediaMessage(qMsg, 'buffer', {}, {logger:P({level:'silent'}), reuploadRequest:sock.updateMediaMessage}); let sticker = await makeStickerBuffer(buf); await sock.sendMessage(from,{sticker},{quoted:m}); }catch(e){ await sock.sendMessage(from,{text:`❌ Erreur: ${e.message}`},{quoted:m}) } return }
      if(cmd==="vq"){ let q=m.message.extendedTextMessage?.contextInfo?.quotedMessage; if(!q) return await sock.sendMessage(from,{text:R.vqNeed},{quoted:m}); let inner = q.viewOnceMessageV2?.message || q.viewOnceMessage?.message || q; try{ let buf = await downloadMediaMessage({message:inner}, 'buffer', {}, {logger:P({level:'silent'}), reuploadRequest:sock.updateMediaMessage}); let k = Object.keys(inner)[0] || ""; if(inner.imageMessage || k.includes('image')) await sock.sendMessage(from,{image:buf, caption:R.vqOk},{quoted:m}); else if(inner.videoMessage || k.includes('video')) await sock.sendMessage(from,{video:buf, caption:R.vqOk},{quoted:m}); else if(inner.audioMessage || k.includes('audio')) await sock.sendMessage(from,{audio:buf, mimetype:'audio/ogg; codecs=opus', ptt: inner.audioMessage?.ptt || false},{quoted:m}); else await sock.sendMessage(from,{image:buf, caption:R.vqOk},{quoted:m}); }catch(e){ await sock.sendMessage(from,{text:`❌ VQ: ${e.message}`},{quoted:m}) } return }
      if(cmd==="st"){ let q=m.message.extendedTextMessage?.contextInfo?.quotedMessage; if(!q) return await sock.sendMessage(from,{text:R.stNeed},{quoted:m}); try{ let buf = await downloadMediaMessage({message:q}, 'buffer', {}, {logger:P({level:'silent'}), reuploadRequest:sock.updateMediaMessage}); let k = Object.keys(q)[0] || ""; if(q.videoMessage || k.includes('video')) await sock.sendMessage(from,{video:buf, caption:R.stOk},{quoted:m}); else if(q.audioMessage || k.includes('audio')) await sock.sendMessage(from,{audio:buf, mimetype:'audio/ogg; codecs=opus'},{quoted:m}); else await sock.sendMessage(from,{image:buf, caption:R.stOk},{quoted:m}); }catch(e){ await sock.sendMessage(from,{text:`❌ ST: ${e.message}`},{quoted:m}) } return }
      if(cmd==="amis"){ if(!target) return await sock.sendMessage(from,{text:R.needTag},{quoted:m}); let n=normalizeJid(target); db.amis[n]=true; saveDB(); await sock.sendMessage(from,{text:R.amis(target),mentions:[target]},{quoted:m}); return }
      if(cmd==="noami"){ if(!target) return await sock.sendMessage(from,{text:R.needTag},{quoted:m}); let n=normalizeJid(target); delete db.amis[n]; saveDB(); await sock.sendMessage(from,{text:R.noami(target),mentions:[target]},{quoted:m}); return }
      if(cmd==="bot"){ if(txt.includes("off")){db.botOff=true; saveDB(); await sock.sendMessage(from,{text:R.botOffMsg},{quoted:m})}else{db.botOff=false; saveDB(); await sock.sendMessage(from,{text:R.botOnMsg},{quoted:m})} return }
    })
    sock.ev.on('group-participants.update', async(update)=>{
      try{
        const { id, participants, action } = update; 
        const meta=await sock.groupMetadata(id).catch(()=>null)
        if(!meta) return
        const memberCount = meta.participants.length
        const adminCount = meta.participants.filter(p=>p.admin).length
        if(action==='add'){
          for(let p of participants){
            if(p===sock.user.id) continue;
            if(db.welcome.includes(id)){
              let custom=db.welcomeTexts[id]
              let finalMsg=R.welcomeMsg(p, meta.subject||"groupe", custom, memberCount, adminCount)
              await sock.sendMessage(id,{ text:finalMsg, mentions:[p] }).catch(()=>{})
            }
          }
        }
        if(action==='remove'){
          for(let r of participants){
            if(r===sock.user.id) continue;
            if(db.bye.includes(id)){
              let custom=db.byeTexts[id]
              let finalMsg=R.byeMsg(r, meta.subject||"groupe", custom, memberCount, adminCount)
              await sock.sendMessage(id,{ text:finalMsg, mentions:[r] }).catch(()=>{})
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