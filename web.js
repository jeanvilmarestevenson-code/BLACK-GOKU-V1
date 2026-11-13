// web.js - BLACK GOKU V115.6 - COMPLET AVEC TON BLOC EXACT SUKUNA
const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, downloadMediaMessage } = require('@whiskeysockets/baileys')
const P = require('pino')
const fs = require('fs')
const os = require('os')
const path = require('path')
const { exec } = require('child_process')
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

let ffmpegPath = null
try { ffmpegPath = require('ffmpeg-static') } catch { try { require('child_process').execSync('which ffmpeg'); ffmpegPath = 'ffmpeg' } catch {} }

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
    if(decoded.startsWith("{")){ fs.writeFileSync('auth2/creds.json', decoded); return true }
  }catch(e){ console.log("SESSION ERR:", e.message) }
  return false
}
if(!fs.existsSync('auth2') || fs.readdirSync('auth2').length===0){ if(SESSION_ID) loadSessionFromId() }

let db = { amis:{}, saved:[], pro:[], protec:[], chut:{}, blockadmin:[], godmode:[], kaio:[], antilink:[], antisticker:[], welcome:[], welcomeTexts:{}, bye:[], byeTexts:{}, ghost:[], ghostCache:{}, antibod:{}, curse:{}, antilock:[], antidemote:[], clans:{}, zenkai:[], zenkaiUsers:[], boy:[], boyUsers:[], ownerLids:[], privateMode:false, botOff:false, activity:{}, groupCache:{}, muted:{}, styles:{}, antidelete:[], antideleteCache:{}, autoreply:[], autoreplyGroupe:[], autoreplyGroupeAll:false }
if(fs.existsSync(DB_FILE)){ try{ db={...db,...JSON.parse(fs.readFileSync(DB_FILE))} }catch{} }
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
noPerm:"😈 𝑺𝑬𝑼𝑳 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 𝑷𝑬𝑼𝑻 𝑼𝑻𝑰𝑳𝑰𝑺𝑬𝑹 𝑪𝑬 𝑩𝑶𝑻",
needTag:"😈 𝑻𝑨𝑮 𝑼𝑵 𝑴𝑶𝑹𝑻𝑬𝑳!",
creatorProtect:"👑🔥 𝑰𝑴𝑷𝑶𝑺𝑺𝑰𝑩𝑳𝑬 𝑫𝑬 𝑻𝑶𝑼𝑪𝑯𝑬𝑹 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼!",
ban:(j)=>`💀 𝑯𝑨𝑲𝑨𝑰! @${j.split('@')[0]} 𝒆𝒇𝒇𝒂𝒄é!`,
promote:(j)=>`👑 @${j.split('@')[0]} é𝒍𝒆𝒗é!`,
demote:(j)=>`💔 @${j.split('@')[0]} 𝒅é𝒄𝒉𝒖!`,
mute:"🤫 𝑴𝑼𝑻𝑬 𝑶𝑵", unmute:"🔊 𝑼𝑵𝑴𝑼𝑻𝑬 𝑶𝑭𝑭",
vqOk:"👁️🔥 𝑽𝑼𝑬 𝑫É𝑽𝑶𝑰𝑳É𝑬!", vqNeed:"😈 𝑹é𝒑𝒐𝒏𝒅𝒔 à 𝒖𝒏𝒆 𝒗𝒖𝒆 𝒖𝒏𝒊𝒒𝒖𝒆!", sNeed:"😈 𝑹é𝒑𝒐𝒏𝒅𝒔 à 𝒖𝒏𝒆 𝒊𝒎𝒂𝒈𝒆/𝒗𝒊𝒅é𝒐!", stNeed:"😈 𝑹é𝒑𝒐𝒏𝒅𝒔 à 𝒖𝒏 𝒔𝒕𝒂𝒕𝒖𝒕!", stOk:"👁️ 𝑺𝒕𝒂𝒕𝒖𝒕 𝒗𝒐𝒍é",
rdmOk:(j)=>`🎲 @${j.split('@')[0]}!`, timeEnd:"⏰ 𝑻𝑰𝑴𝑬 𝑭𝑰𝑵𝑰!",
antideleteOn:"👁️ 𝑨𝑩𝒀𝑺𝑺𝑺𝑬𝑬 𝑶𝑵", antideleteOff:"👁️ 𝑶𝑭𝑭",
autoreplyOn:"🤖 𝑨𝑼𝑻𝑶𝑹𝑬𝑷𝑳𝒀 𝑶𝑵", autoreplyOff:"🤖 𝑶𝑭𝑭",
autoreplyGroupeOn:"👑 𝑨𝑼𝑻𝑶𝑹𝑬𝑷𝑳𝒀𝑮𝑹𝑶𝑼𝑷𝑬 𝑶𝑵", autoreplyGroupeOff:"👑 𝑶𝑭𝑭",
autoreplyGroupeOnAll:"👑 𝑶𝑵 𝑨𝑳𝑳", autoreplyGroupeOffAll:"👑 𝑶𝑭𝑭 𝑨𝑳𝑳",

// BLOC EXACT - COPIE ÇA DANS TON R
autoreplyMsg:(j)=>`┏━━━━━━━━━━━━━━━━━━┓
┃ ꧁𓊈𒆜BLACK GOKU𒆜𓊉꧂ ┃
┗━━━━━━━━━━━━━━━━━━┛
👑 𝑩𝒐𝒏𝒋𝒐𝒖𝒓 @${j.split('@')[0]}

😴 𝑫é𝒔𝒐𝒍é, 𝒋𝒆 𝒏𝒆 𝒔𝒖𝒊𝒔 𝒑𝒂𝒔 𝒅𝒊𝒔𝒑𝒐 𝒑𝒐𝒖𝒓 𝒍𝒆 𝒎𝒐𝒎𝒆𝒏𝒕.
💀 𝑱𝒆 𝒔𝒖𝒊𝒔 𝒆𝒏 𝒕𝒓𝒂𝒊𝒏 𝒅𝒆 𝒎é𝒅𝒊𝒕𝒆𝒓 𝒅𝒂𝒏𝒔 𝒍𝒆 𝒏é𝒂𝒏𝒕.

📩 𝑳𝒂𝒊𝒔𝒔𝒆 𝒕𝒐𝒏 𝒎𝒆𝒔𝒔𝒂𝒈𝒆, 𝒋𝒆 𝒕𝒆 𝒓é𝒑𝒐𝒏𝒅𝒓𝒂𝒊 𝒅è𝒔 𝒒𝒖𝒆 𝒑𝒐𝒔𝒔𝒊𝒃𝒍𝒆.
🔥 𝑴𝒆𝒓𝒄𝒊 𝒅𝒆 𝒕𝒂 𝒑𝒂𝒕𝒊𝒆𝒏𝒄𝒆.
┗━━━ 𝑻𝑯𝑬 𝑮𝑶𝑨𝑻 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 ━━━┛`,

autoreplyGroupeMsg:(j)=>`┏━━━━━━━━━━━━━━━━━━┓
┃ ꧁𓊈𒆜BLACK GOKU𒆜𓊉꧂ ┃
┗━━━━━━━━━━━━━━━━━━┛
👑 𝑩𝒐𝒏𝒋𝒐𝒖𝒓 @${j.split('@')[0]}

😴 𝑫é𝒔𝒐𝒍é, 𝒋𝒆 𝒏𝒆 𝒔𝒖𝒊𝒔 𝒑𝒂𝒔 𝒅𝒊𝒔𝒑𝒐 𝒑𝒐𝒖𝒓 𝒍𝒆 𝒎𝒐𝒎𝒆𝒏𝒕.
💀 𝑱𝒆 𝒔𝒖𝒊𝒔 𝒆𝒏 𝒕𝒓𝒂𝒊𝒏 𝒅𝒆 𝒎é𝒅𝒊𝒕𝒆𝒓 𝒅𝒂𝒏𝒔 𝒍𝒆 𝒏é𝒂𝒏𝒕.

📩 𝑳𝒂𝒊𝒔𝒔𝒆 𝒕𝒐𝒏 𝒎𝒆𝒔𝒔𝒂𝒈𝒆, 𝒋𝒆 𝒕𝒆 𝒓é𝒑𝒐𝒏𝒅𝒓𝒂𝒊 𝒅è𝒔 𝒒𝒖𝒆 𝒑𝒐𝒔𝒔𝒊𝒃𝒍𝒆.
🔥 𝑴𝒆𝒓𝒄𝒊 𝒅𝒆 𝒕𝒂 𝒑𝒂𝒕𝒊𝒆𝒏𝒄𝒆.
┗━━━ 𝑻𝑯𝑬 𝑮𝑶𝑨𝑻 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 ━━━┛`,

welcomeMsg:(j, g, custom, members, admins)=>{
  if(custom) return custom
  return `┏━━━━━━━━━━━━━━━━━━┓
┃ ꧁𓊈𒆜BLACK GOKU𒆜𓊉꧂ ┃
┗━━━━━━━━━━━━━━━━━━┛
👑 𝑩𝒐𝒏𝒋𝒐𝒖𝒓 @${j.split('@')[0]}

😴 𝑫é𝒔𝒐𝒍é, 𝒋𝒆 𝒏𝒆 𝒔𝒖𝒊𝒔 𝒑𝒂𝒔 𝒅𝒊𝒔𝒑𝒐 𝒑𝒐𝒖𝒓 𝒍𝒆 𝒎𝒐𝒎𝒆𝒏𝒕.
💀 𝑱𝒆 𝒔𝒖𝒊𝒔 𝒆𝒏 𝒕𝒓𝒂𝒊𝒏 𝒅𝒆 𝒎é𝒅𝒊𝒕𝒆𝒓 𝒅𝒂𝒏𝒔 𝒍𝒆 𝒏é𝒂𝒏𝒕.

🌸 𝑩𝒊𝒆𝒏𝒗𝒆𝒏𝒖𝒆 𝒅𝒂𝒏𝒔 : ${g}
📩 𝑷𝒓𝒐𝒇𝒊𝒕𝒆 𝒃𝒊𝒆𝒏 𝒅𝒖 𝒈𝒓𝒐𝒖𝒑𝒆 !
🔥 𝑴𝒆𝒓𝒄𝒊 𝒅𝒆 𝒕𝒂 𝒑𝒂𝒕𝒊𝒆𝒏𝒄𝒆.
┗━━━ 𝑻𝑯𝑬 𝑮𝑶𝑨𝑻 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 ━━━┛`
},
byeMsg:(j, g, custom, members, admins)=>{
  if(custom) return custom
  return `┏━━━━━━━━━━━━━━━━━━┓
┃ ꧁𓊈𒆜BLACK GOKU𒆜𓊉꧂ ┃
┗━━━━━━━━━━━━━━━━━━┛
👑 𝑩𝒐𝒏𝒋𝒐𝒖𝒓 @${j.split('@')[0]}

😴 𝑫é𝒔𝒐𝒍é, 𝒋𝒆 𝒏𝒆 𝒔𝒖𝒊𝒔 𝒑𝒂𝒔 𝒅𝒊𝒔𝒑𝒐 𝒑𝒐𝒖𝒓 𝒍𝒆 𝒎𝒐𝒎𝒆𝒏𝒕.
💀 𝑱𝒆 𝒔𝒖𝒊𝒔 𝒆𝒏 𝒕𝒓𝒂𝒊𝒏 𝒅𝒆 𝒎é𝒅𝒊𝒕𝒆𝒓 𝒅𝒂𝒏𝒔 𝒍𝒆 𝒏é𝒂𝒏𝒕.

📩 𝑻𝒖 𝒂𝒔 𝒒𝒖𝒊𝒕𝒕é : ${g}
🔥 𝑨 𝒃𝒊𝒆𝒏𝒕ô𝒕.
┗━━━ 𝑻𝑯𝑬 𝑮𝑶𝑨𝑻 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 ━━━┛`
},
gitMsg:(g, members, admins)=>`┏━━━━━━━━━━━━━━━━━━┓
┃ ꧁𓊈𒆜BLACK GOKU𒆜𓊉꧂ ┃
┗━━━━━━━━━━━━━━━━━━┛
👑 𝑩𝒐𝒏𝒋𝒐𝒖𝒓

😴 𝑫é𝒔𝒐𝒍é, 𝒋𝒆 𝒏𝒆 𝒔𝒖𝒊𝒔 𝒑𝒂𝒔 𝒅𝒊𝒔𝒑𝒐 𝒑𝒐𝒖𝒓 𝒍𝒆 𝒎𝒐𝒎𝒆𝒏𝒕.
💀 𝑮𝒓𝒐𝒖𝒑𝒆 : ${g}
📩 𝑴𝒆𝒎𝒃𝒓𝒆𝒔 : ${members} | 𝑨𝒅𝒎𝒊𝒏𝒔 : ${admins}
🔗 ${GITHUB_LINK}

🔥 𝑴𝒆𝒓𝒄𝒊 𝒅𝒆 𝒕𝒂 𝒑𝒂𝒕𝒊𝒆𝒏𝒄𝒆.
┗━━━ 𝑻𝑯𝑬 𝑮𝑶𝑨𝑻 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 ━━━┛`,
gtMsg:(j, g, members, admins, isPv)=>`┏━━━━━━━━━━━━━━━━━━┓
┃ ꧁𓊈𒆜BLACK GOKU𒆜𓊉꧂ ┃
┗━━━━━━━━━━━━━━━━━━┛
👑 𝑩𝒐𝒏𝒋𝒐𝒖𝒓 @${j.split('@')[0]}

😴 𝑫é𝒔𝒐𝒍é, 𝒋𝒆 𝒏𝒆 𝒔𝒖𝒊𝒔 𝒑𝒂𝒔 𝒅𝒊𝒔𝒑𝒐 𝒑𝒐𝒖𝒓 𝒍𝒆 𝒎𝒐𝒎𝒆𝒏𝒕.
💀 𝑱𝒆 𝒔𝒖𝒊𝒔 𝒆𝒏 𝒕𝒓𝒂𝒊𝒏 𝒅𝒆 𝒎é𝒅𝒊𝒕𝒆𝒓 𝒅𝒂𝒏𝒔 𝒍𝒆 𝒏é𝒂𝒏𝒕.

📩 𝑷𝒓𝒐𝒇𝒊𝒍 𝒓é𝒄𝒖𝒑é𝒓é : ${g}
🔥 𝑴𝒆𝒓𝒄𝒊 𝒅𝒆 𝒕𝒂 𝒑𝒂𝒕𝒊𝒆𝒏𝒄𝒆.
┗━━━ 𝑻𝑯𝑬 𝑮𝑶𝑨𝑻 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 ━━━┛`,
}

function normalizeJid(j){ return j?.split(':')[0].split('@')[0].replace(/[^0-9]/g,'')||"" }
function isCreator(jid){ return normalizeJid(jid)===OWNER_NUMBER }
async function makeStickerBuffer(b){ try{ const sharp=require('sharp'); return await sharp(b).resize(512,512,{fit:'contain', background:{r:0,g:0,b:0,alpha:0}}).webp({quality:90}).toBuffer() }catch{ return b } }
async function makeVideoStickerBuffer(videoBuffer){
  return new Promise((resolve, reject)=>{
    if(!ffmpegPath) return reject(new Error("FFMPEG non trouvé"))
    const tmpIn = path.join(os.tmpdir(), `goku_${Date.now()}_in.mp4`)
    const tmpOut = path.join(os.tmpdir(), `goku_${Date.now()}_out.webp`)
    fs.writeFileSync(tmpIn, videoBuffer)
    const cmd = `"${ffmpegPath}" -y -i "${tmpIn}" -vf "scale=512:512:flags=lanczos:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=0x00000000,fps=15" -c:v libwebp -lossless 0 -q:v 50 -loop 0 -preset default -an -vsync 0 "${tmpOut}"`
    exec(cmd, {timeout: 20000}, (err)=>{
      try{ fs.unlinkSync(tmpIn) }catch{}
      if(err){ try{ fs.unlinkSync(tmpOut) }catch{}; return reject(err) }
      try{ const outBuf = fs.readFileSync(tmpOut); fs.unlinkSync(tmpOut); resolve(outBuf) }catch(e){ reject(e) }
    })
  })
}

app.get('/', (req,res)=>res.send(`BLACK GOKU ${status} FFMPEG ${ffmpegPath?'ON':'OFF'}`))
app.get('/h24', (req,res)=>res.send(`H24 OK`))
app.get('/session', async(req,res)=>{ try{ let creds = fs.readFileSync('auth2/creds.json','utf-8'); let b64 = Buffer.from(creds).toString('base64'); res.send(`BLACK-GOKU~${b64}`) }catch(e){ res.send(e.message) } })
app.get('/clear', (req,res)=>{ try{ if(fs.existsSync('auth2')) fs.rmSync('auth2',{recursive:true,force:true}); res.send("CLEAR OK"); setTimeout(()=>process.exit(0),1000) }catch(e){ res.send(e.message) } })
app.get('/pair', async(req,res)=>{ if(!sock) return res.status(503).send("⏳"); let num = (req.query.num||OWNER_NUMBER).replace(/[^0-9]/g,''); try{ let code = await sock.requestPairingCode(num); res.send(code) }catch(e){ res.status(500).send(e.message) } })
app.get('/qr', async(req,res)=>{ if(latestQR){ res.send(`<img src="https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(latestQR)}">`) } else { res.send("⏳ QR") } })
app.listen(PORT,'0.0.0.0',()=>console.log(`🔥 V115.6 LIVE ${PORT}`))

async function startBot(){
  if(isConnecting) return; isConnecting = true
  try{
    const { version } = await fetchLatestBaileysVersion()
    const { state, saveCreds } = await useMultiFileAuthState('auth2')
    sock = makeWASocket({ version, auth:{creds:state.creds, keys:makeCacheableSignalKeyStore(state.keys, P({level:'silent'}))}, logger:P({level:'silent'}), browser:["Ubuntu","Chrome","20.0"], msgRetryCounterCache, markOnlineOnConnect:true, syncFullHistory:false, getMessage: async(k)=> messageStore[k.id]? {conversation:messageStore[k.id].text}: undefined })
    sock.ev.on('creds.update', saveCreds)
    sock.ev.on('connection.update', async(u)=>{
      const { connection, lastDisconnect, qr } = u
      if(qr){ latestQR = qr; status = "QR PRÊT"; }
      if(connection==='open'){ status="BLACK GOKU ACTIF H24 ✅"; latestQR=null; BOT_START=Date.now(); isConnecting=false; }
      if(connection==='close'){ isConnecting=false; setTimeout(startBot,5000) }
    })
    sock.ev.on('messages.upsert', async({messages,type})=>{
      if(type!=='notify') return; const m=messages[0]; if(!m?.message) return
      const from=m.key.remoteJid; const sender=m.key.participant||from
      const isGroup=from.endsWith('@g.us')
      const meta=isGroup? await sock.groupMetadata(from).catch(()=>null): null
      let senderNum=normalizeJid(sender); let fromNum=normalizeJid(from)
      let isOwner = senderNum===OWNER_NUMBER || fromNum===OWNER_NUMBER || m.key.fromMe || db.amis[senderNum]
      let text=m.message.conversation||m.message.extendedTextMessage?.text||m.message.imageMessage?.caption||m.message.videoMessage?.caption||""

      if(!m.key.fromMe && text && !text.startsWith(PREFIX)){
        if(!isGroup && db.autoreply.includes(from)){
          await sock.sendMessage(from,{ text:R.autoreplyMsg(sender), mentions:[sender] },{quoted:m}).catch(()=>{})
        }
        if(isGroup && (db.autoreplyGroupeAll || db.autoreplyGroupe.includes(from))){
          let mentionedJid = m.message.extendedTextMessage?.contextInfo?.mentionedJid || []
          let botNum = normalizeJid(sock.user.id)
          if(mentionedJid.some(j=> normalizeJid(j)===botNum)){
            await sock.sendMessage(from,{ text:R.autoreplyGroupeMsg(sender), mentions:[sender] },{quoted:m}).catch(()=>{})
          }
        }
      }

      if(!text.startsWith(PREFIX)) return
      if(!isOwner){ await sock.sendMessage(from,{text:R.noPerm},{quoted:m}); return }
      let args=text.slice(PREFIX.length).trim().split(/ +/); let cmd=args[0].toLowerCase(); let txt=args.slice(1).join(' '); let mentioned=m.message.extendedTextMessage?.contextInfo?.mentionedJid||[]; let target=mentioned[0];

      if(cmd==="autoreplygroupe"){
        let low=(txt||"").toLowerCase()
        if(low.includes("off") && low.includes("all")){ db.autoreplyGroupeAll=false; db.autoreplyGroupe=[] }
        else if(low.includes("on") && low.includes("all")){ db.autoreplyGroupeAll=true }
        else if(low.includes("off")){ db.autoreplyGroupe=db.autoreplyGroupe.filter(x=>x!==from) }
        else { if(!db.autoreplyGroupe.includes(from)) db.autoreplyGroupe.push(from) }
        saveDB(); return
      }
      if(cmd==="autoreply"){
        let low=(txt||"").toLowerCase()
        if(low.includes("off")) db.autoreply=db.autoreply.filter(x=>x!==from)
        else if(!db.autoreply.includes(from)) db.autoreply.push(from)
        saveDB(); return
      }

      if(cmd==="mute"){ if(!isGroup) return; await sock.groupSettingUpdate(from,"announcement"); await sock.sendMessage(from,{text:R.mute},{quoted:m}); return }
      if(cmd==="unmute"){ if(!isGroup) return; await sock.groupSettingUpdate(from,"not_announcement"); await sock.sendMessage(from,{text:R.unmute},{quoted:m}); return }
      if(cmd==="s"){
        let quoted = m.message.extendedTextMessage?.contextInfo?.quotedMessage
        let isVideo = quoted?.videoMessage || m.message.videoMessage
        let isImage = quoted?.imageMessage || m.message.imageMessage
        if(!isVideo && !isImage){ await sock.sendMessage(from,{text:R.sNeed},{quoted:m}); return }
        try{
          let buf = await downloadMediaMessage(quoted ? {message: quoted} : m, 'buffer', {}, {logger:P({level:'silent'}), reuploadRequest:sock.updateMediaMessage})
          let sticker = isVideo && ffmpegPath ? await makeVideoStickerBuffer(buf).catch(()=>makeStickerBuffer(buf)) : await makeStickerBuffer(buf)
          await sock.sendMessage(from,{sticker},{quoted:m})
        }catch(e){ await sock.sendMessage(from,{text:`❌ ${e.message}`},{quoted:m}) }
        return
      }
      if(cmd==="vq"){
        let q = m.message.extendedTextMessage?.contextInfo?.quotedMessage
        if(!q){ await sock.sendMessage(from,{text:R.vqNeed},{quoted:m}); return }
        try{
          let inner = q.viewOnceMessageV2?.message || q.viewOnceMessage?.message || q.viewOnceMessageV2 || q.viewOnceMessage || q
          if(inner.viewOnceMessageV2) inner = inner.viewOnceMessageV2.message
          let buf = await downloadMediaMessage({message: inner}, 'buffer', {}, {logger:P({level:'silent'}), reuploadRequest:sock.updateMediaMessage})
          let type = Object.keys(inner)[0]||""
          if(type.includes('video')||inner.videoMessage) await sock.sendMessage(from,{video:buf, caption:R.vqOk},{quoted:m})
          else await sock.sendMessage(from,{image:buf, caption:R.vqOk},{quoted:m})
        }catch(e){ await sock.sendMessage(from,{text:`❌ VQ ${e.message}`},{quoted:m}) }
        return
      }
      if(["black","menu"].includes(cmd)){ await sock.sendMessage(from,{text:getMenu()},{quoted:m}); return }
      if(cmd==="git"){ let memberCount = meta?.participants.length||0; let adminCount = meta?.participants.filter(p=>p.admin).length||0; await sock.sendMessage(from,{text:R.gitMsg(meta?.subject||"groupe", memberCount, adminCount)},{quoted:m}); return }
      if(cmd==="gt"){ let jidTarget = target || sender; let memberCount = meta?.participants.length||0; let adminCount = meta?.participants.filter(p=>p.admin).length||0; await sock.sendMessage(from,{text:R.gtMsg(jidTarget, meta?.subject||"groupe", memberCount, adminCount, !isGroup), mentions:[jidTarget]},{quoted:m}); return }
      if(cmd==="welcome"){ if(txt.toLowerCase().includes("off")) db.welcome=db.welcome.filter(x=>x!==from); else if(!db.welcome.includes(from)) db.welcome.push(from); saveDB(); return }
      if(cmd==="bye"){ if(txt.toLowerCase().includes("off")) db.bye=db.bye.filter(x=>x!==from); else if(!db.bye.includes(from)) db.bye.push(from); saveDB(); return }
    })
    sock.ev.on('group-participants.update', async(update)=>{
      try{
        const { id, participants, action } = update; 
        const meta=await sock.groupMetadata(id).catch(()=>null); if(!meta) return
        if(action==='add'){ for(let p of participants){ if(db.welcome.includes(id)){ await sock.sendMessage(id,{ text:R.welcomeMsg(p, meta.subject, null, meta.participants.length, meta.participants.filter(x=>x.admin).length), mentions:[p] }) } } }
        if(action==='remove'){ for(let r of participants){ if(db.bye.includes(id)){ await sock.sendMessage(id,{ text:R.byeMsg(r, meta.subject, null, meta.participants.length, meta.participants.filter(x=>x.admin).length), mentions:[r] }) } } }
      }catch(e){ console.log(e.message) }
    })
  }catch(e){ console.log("START ERR", e.message); isConnecting=false; setTimeout(startBot,5000) }
}
startBot()