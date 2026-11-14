// web.js - BLACK GOKU V118 FINAL - SINGLE OWNER 5551982215198 - AVEC CODE 8 CHIFFRES
const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, downloadMediaMessage } = require('@whiskeysockets/baileys')
const P = require('pino')
const fs = require('fs')
const os = require('os')
const path = require('path')
const { exec } = require('child_process')
const express = require('express')
const cors = require('cors')
const NodeCache = require('node-cache')
const https = require('https')
const http = require('http')
const fetch = require('node-fetch')

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))

const PORT = process.env.PORT || 10000
const OWNER_NUMBER = "5551982215198"
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

let db = { amis:{}, saved:[], pro:[], protec:[], chut:{}, blockadmin:[], godmode:[], kaio:[], antilink:[], antisticker:[], welcome:[], welcomeTexts:{}, bye:[], byeTexts:{}, ghost:[], ghostCache:{}, antibod:{}, curse:{}, antilock:[], antidemote:[], clans:{}, zenkai:[], zenkaiUsers:[], boy:[], boyUsers:[], ownerLids:[], privateMode:false, botOff:false, activity:{}, groupCache:{}, muted:{}, styles:{}, antidelete:[], antideleteCache:{}, autoreply:[], autoreplyAll:false, autoreplyGroupe:[], autoreplyGroupeAll:false }
if(fs.existsSync(DB_FILE)){ try{ db={...db,...JSON.parse(fs.readFileSync(DB_FILE))} }catch{} }
const saveDB = ()=>fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2))

let sock, status="Demarrage...", latestQR=null, BOT_START=Date.now()
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
┃ ₩𝒂𝒖𝒕𝒐𝒓𝒆𝒑𝒍𝒚 𝒐𝒏/𝒐𝒇𝒇/𝒐𝒏 𝒂𝒍𝒍/𝒐𝒇𝒇 𝒂𝒍𝒍
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

const S = (t)=>`╔═══꧁༒☬ 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 ☬༒꧂═══╗
║ ${t}
╚═══════════════════════╝
⚡ 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼`

const R = {
noPerm: S(`😈 𝑻'𝑬𝑺 𝑸𝑼𝑰 𝑻𝑶𝑰 𝑴𝑶𝑹𝑻𝑬𝑳 ?
║ 🔒 𝑺𝑬𝑼𝑳 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 𝑷𝑬𝑼𝑻 𝑶𝑹𝑫𝑶𝑵𝑵𝑬𝑹
║ 💀 Reste à ta place`),
needTag: S(`😈 𝑻𝑨𝑮 𝑼𝑵 𝑴𝑶𝑹𝑻𝑬𝑳 𝑭𝑨𝑰𝑩𝑳𝑬!
║ 👉 ₩ban @quelqu'un`),
creatorProtect: S(`👑🔥 𝑻𝑶𝑼𝑪𝑯𝑬𝑺 𝑷𝑨𝑺 𝑨 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼!
║ ⚡ 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 𝑬𝑺𝑻 𝑰𝑵𝑻𝑶𝑼𝑪𝑯𝑨𝑩𝑳𝑬
║ 💀 Ton attaque a échoué`),
botNoAdmin: S(`🤖 𝑱𝒆 𝒏𝒆 𝒔𝒖𝒊𝒔 𝒑𝒂𝒔 𝒂𝒅𝒎𝒊𝒏
║ 👑 𝑫𝒐𝒏𝒏𝒆-𝒎𝒐𝒊 𝒍𝒆𝒔 𝒑𝒐𝒖𝒗𝒐𝒊𝒓𝒔`),
ban:(j)=>S(`💀 𝑯𝑨𝑲𝑨𝑰! @${j.split('@')[0]} 𝒆𝒇𝒇𝒂𝒄é!
║ ⚡ 𝑷𝒂𝒓 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼`),
promote:(j)=>S(`👑 @${j.split('@')[0]} é𝒍𝒆𝒗é 𝑪𝑯𝑬𝑭!
║ ⚡ 𝑷𝒂𝒓 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼`),
demote:(j)=>S(`📉 @${j.split('@')[0]} 𝒅é𝒄𝒉𝒖!
║ ⚡ 𝑷𝒂𝒓 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼`),
mute: S(`🔇 𝑮𝒓𝒐𝒖𝒑𝒆 𝒇𝒆𝒓𝒎é
║ ✅ 𝑺𝒆𝒖𝒍𝒔 𝒍𝒆𝒔 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 𝑻𝑬𝑨𝑴`),
unmute: S(`🔊 𝑮𝒓𝒐𝒖𝒑𝒆 𝒐𝒖𝒗𝒆𝒓𝒕
║ ✅ 𝑻𝒐𝒖𝒕 𝒍𝒆 𝒎𝒐𝒏𝒅𝒆 𝒑𝒆𝒖𝒕 𝒑𝒂𝒓𝒍𝒆𝒓`),
vqOk: S(`👁️🔥 𝑽𝑼𝑬 𝑫É𝑽𝑶𝑰𝑳É𝑬!
║ ⚡ 𝑷𝒂𝒓 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼`),
vqNeed: S(`😈 𝑹é𝒑𝒐𝒏𝒅𝒔 à 𝒖𝒏𝒆 𝒗𝒖𝒆 𝒖𝒏𝒊𝒒𝒖𝒆!`),
sNeed: S(`😈 𝑹é𝒑𝒐𝒏𝒅𝒔 à 𝒖𝒏𝒆 𝒊𝒎𝒂𝒈𝒆/𝒗𝒊𝒅é𝒐!`),
stNeed: S(`😈 𝑹é𝒑𝒐𝒏𝒅𝒔 à 𝒖𝒏 𝒔𝒕𝒂𝒕𝒖𝒕!`),
stOk: S(`👁️ 𝑺𝒕𝒂𝒕𝒖𝒕 𝒗𝒐𝒍é!
║ ⚡ 𝑷𝒂𝒓 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼`),
antideleteOn: S(`👁️ 𝑨𝑩𝒀𝑺𝑺𝑺𝑬𝑬 𝑶𝑵
║ ✅ 𝑨𝒄𝒕𝒊𝒗é`),
antideleteOff: S(`👁️ 𝑨𝑩𝒀𝑺𝑺𝑺𝑬𝑬 𝑶𝑭𝑭
║ ❌ 𝑫é𝒔𝒂𝒄𝒕𝒊𝒗é`),
autoreplyOn: S(`🤖 𝑨𝑼𝑻𝑶𝑹𝑬𝑷𝑳𝒀 𝑶𝑵
║ ✅ 𝑨𝒄𝒕𝒊𝒗é 𝒅𝒂𝒏𝒔 𝒄𝒆 𝑷𝑽!`),
autoreplyOff: S(`🤖 𝑨𝑼𝑻𝑶𝑹𝑬𝑷𝑳𝒀 𝑶𝑭𝑭
║ ❌ 𝑫é𝒔𝒂𝒄𝒕𝒊𝒗é`),
autoreplyOnAll: S(`🤖 𝑨𝑼𝑻𝑶𝑹𝑬𝑷𝑳𝒀 𝑶𝑵 𝑨𝑳𝑳
║ ✅ 𝑻𝒐𝒖𝒔 𝒍𝒆𝒔 𝑷𝑽 𝒂𝒄𝒕𝒊𝒗é𝒔!`),
autoreplyOffAll: S(`🤖 𝑶𝑭𝑭 𝑨𝑳𝑳 𝑷𝑽
║ ❌ 𝑻𝒐𝒖𝒔 𝒅é𝒔𝒂𝒄𝒕𝒊𝒗é𝒔`),
autoreplyGroupeOn: S(`👑 𝑨𝑼𝑻𝑶𝑹𝑬𝑷𝑳𝒀𝑮𝑹𝑶𝑼𝑷𝑬 𝑶𝑵
║ ✅ 𝑨𝒄𝒕𝒊𝒗é 𝒅𝒂𝒏𝒔 𝒄𝒆 𝒈𝒓𝒐𝒖𝒑𝒆!`),
autoreplyGroupeOff: S(`👑 𝑨𝑼𝑻𝑶𝑹𝑬𝑷𝑳𝒀𝑮𝑹𝑶𝑼𝑷𝑬 𝑶𝑭𝑭
║ ❌ 𝑫é𝒔𝒂𝒄𝒕𝒊𝒗é`),
autoreplyGroupeOnAll: S(`👑 𝑶𝑵 𝑨𝑳𝑳
║ ✅ 𝑨𝒄𝒕𝒊𝒗é 𝒅𝒂𝒏𝒔 𝑻𝑶𝑼𝑺 𝒍𝒆𝒔 𝒈𝒓𝒐𝒖𝒑𝒆𝒔!`),
autoreplyGroupeOffAll: S(`👑 𝑶𝑭𝑭 𝑨𝑳𝑳 𝑮𝑹𝑶𝑼𝑷𝑬𝑺
║ ❌ 𝑻𝒐𝒖𝒔 𝒅é𝒔𝒂𝒄𝒕𝒊𝒗é𝒔`),
welcomeMsg:(j, g, custom, members, admins)=>{
  if(custom) return custom.replace(/@user/g, `@${j.split('@')[0]}`).replace(/@group/g, g)
  return `╔═══꧁༒☬ 𝑩𝑰𝑬𝑵𝑽𝑬𝑵𝑼𝑬 ☬༒꧂═══╗
║ 👋 𝑩𝑰𝑬𝑵𝑽𝑬𝑵𝑼𝑬 @${j.split('@')[0]}
║ 🏰 𝑮𝑹𝑶𝑼𝑷𝑬 : ${g}
║ 👥 𝑴𝑬𝑴𝑩𝑹𝑬𝑺 : ${members}
║ 👑 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 𝑻𝑬𝑨𝑴 : ${admins}
╠═══════════════════════╣
║ 💙 𝑹𝒂𝒗𝒊 𝒅𝒆 𝒕'𝒂𝒗𝒐𝒊𝒓 𝒑𝒂𝒓𝒎𝒊 𝒏𝒐𝒖𝒔
║ ✨ 𝑭𝒂𝒊𝒔 𝒄𝒐𝒎𝒎𝒆 𝒄𝒉𝒆𝒛 𝒕𝒐𝒊
╚═══════════════════════╝
⚡ 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼`
},
byeMsg:(j, g, custom, members, admins)=>{
  if(custom) return custom.replace(/@user/g, `@${j.split('@')[0]}`).replace(/@group/g, g)
  return `╔═══꧁༒☬ 𝑩𝒀𝑬 ☬༒꧂═══╗
║ 👋 @${j.split('@')[0]} 𝒂 𝒒𝒖𝒊𝒕𝒕é
║ 🏰 ${g}
║ 👥 𝑰𝒍 𝒓𝒆𝒔𝒕𝒆 ${members} 𝒎𝒆𝒎𝒃𝒓𝒆𝒔
╠═══════════════════════╣
║ 🌙 𝑩𝒐𝒏𝒏𝒆 𝒓𝒐𝒖𝒕𝒆 à 𝒕𝒐𝒊
╚═══════════════════════╝
⚡ 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼`
},
autoreplyMsg:(j)=>`╔═══꧁༒☬ 𝑨𝑼𝑻𝑶 ☬༒꧂═══╗
║ 👋 𝑺𝒂𝒍𝒖𝒕 @${j.split('@')[0]}
║ 😴 𝑰𝒍 𝒏'𝒆𝒔𝒕 𝒑𝒂𝒔 𝒍à 𝒑𝒐𝒖𝒓 𝒍𝒆 𝒎𝒐𝒎𝒆𝒏𝒕
║ 📱 𝑰𝒍 𝒏'𝒂 𝒑𝒂𝒔 𝒔𝒐𝒏 𝒕é𝒍é𝒑𝒉𝒐𝒏𝒆
║ 💬 𝑳𝒂𝒊𝒔𝒔𝒆-𝒍𝒖𝒊 𝒖𝒏 𝒎𝒆𝒔𝒔𝒂𝒈𝒆
║ ⏰ 𝑰𝒍 𝒕𝒆 𝒓é𝒑𝒐𝒏𝒅𝒓𝒂 𝒅è𝒔 𝒒𝒖'𝒊𝒍 𝒓𝒆𝒗𝒊𝒆𝒏𝒕
╚═══════════════════════╝
🙏 𝑴𝒆𝒓𝒄𝒊
⚡ 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼`,
autoreplyGroupeMsg:(j)=>`╔═══꧁༒☬ 𝑨𝑼𝑻𝑶 𝑮𝑹𝑶𝑼𝑷𝑬 ☬༒꧂═══╗
║ 👋 𝑺𝒂𝒍𝒖𝒕 @${j.split('@')[0]}
║ 😴 𝑰𝒍 𝒏'𝒆𝒔𝒕 𝒑𝒂𝒔 𝒅𝒊𝒔𝒑𝒐𝒏𝒊𝒃𝒍𝒆
║ 🏰 𝑰𝒍 𝒓𝒆𝒗𝒊𝒆𝒏𝒅𝒓𝒂 𝒅𝒂𝒏𝒔 𝒍𝒆 𝒈𝒓𝒐𝒖𝒑𝒆
║ 💬 𝑳𝒂𝒊𝒔𝒔𝒆 𝒕𝒐𝒏 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 𝒊𝒄𝒊
╚═══════════════════════╝
🙏 𝑴𝒆𝒓𝒄𝒊
⚡ 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼`,
gitMsg:(g, members, admins)=>`╔═══꧁༒☬ 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 𝑮𝑰𝑻 ☬༒꧂═══╗
║ 👑 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 : 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼
║ 🏰 𝑹𝑶𝒀𝑨𝑼𝑴𝑬 : ${g}
║ 👥 𝑨𝑹𝑴𝑬𝑬 : ${members} | 👑 𝑪𝑯𝑬𝑭𝑺 : ${admins}
║ 🔗 𝑺𝑶𝑼𝑹𝑪𝑬 : ${GITHUB_LINK}
╚═══════════════════════╝
💀 𝑽𝟏𝟏𝟖 𝑺𝑰𝑵𝑮𝑳𝑬 𝑶𝑾𝑵𝑬𝑹`,
gtMsg:(j, g)=>`╔═══꧁༒☬ 𝑷𝑷 𝑽𝑶𝑳𝑬𝑬 ☬༒꧂═══╗
║ 👁️ 𝑽𝑰𝑪𝑻𝑰𝑴𝑬 : @${j.split('@')[0]}
║ 💀 𝑷𝑷 𝑽𝑶𝑳𝑬𝑬 𝑷𝑨𝑹 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼
║ 🔥 𝑶𝒓𝒊𝒈𝒊𝒏𝒆 : ${g}
╚═══════════════════════╝
⚡ 𝑹𝒊𝒆𝒏 𝒏𝒆 𝒔𝒆 𝒄𝒂𝒄𝒉𝒆`,
}

function normalizeJid(j){ return j?.split(':')[0].split('@')[0].replace(/[^0-9]/g,'')||"" }
function isCreator(jid){ if(!jid) return false; let n=normalizeJid(jid); if(n===OWNER_NUMBER) return true; if(db.ownerLids.includes(jid)||db.ownerLids.includes(n)) return true; return false }
function isProtectedForKick(jid){ if(isCreator(jid)) return true; let n=normalizeJid(jid); return db.saved.includes(jid)||db.protec.includes(jid)||db.saved.includes(n)||db.protec.includes(n) }
async function makeStickerBuffer(b){ try{ const sharp=require('sharp'); return await sharp(b).resize(512,512,{fit:'contain', background:{r:0,g:0,b:0,alpha:0}}).webp({quality:90}).toBuffer() }catch{ return b } }
async function makeVideoStickerBuffer(videoBuffer){
  return new Promise((resolve, reject)=>{
    if(!ffmpegPath) return reject(new Error("FFMPEG"))
    const tmpIn = path.join(os.tmpdir(), `goku_${Date.now()}_in.mp4`)
    const tmpOut = path.join(os.tmpdir(), `goku_${Date.now()}_out.webp`)
    fs.writeFileSync(tmpIn, videoBuffer)
    const cmd = `"${ffmpegPath}" -y -i "${tmpIn}" -vf "scale=512:512:flags=lanczos:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=0x00000000,fps=15" -c:v libwebp -lossless 0 -q:v 50 -loop 0 -preset default -an -vsync 0 "${tmpOut}"`
    exec(cmd, {timeout: 25000}, (err)=>{
      try{ fs.unlinkSync(tmpIn) }catch{}
      if(err){ try{ fs.unlinkSync(tmpOut) }catch{}; return reject(err) }
      try{ const outBuf = fs.readFileSync(tmpOut); fs.unlinkSync(tmpOut); resolve(outBuf) }catch(e){ reject(e) }
    })
  })
}
function findImg(list){ for(let f of list){ if(fs.existsSync(f)) return f } return null }
async function downloadPinterest(q){ try{ let r=await fetch(`https://api.siputzx.my.id/api/s/pinterest?query=${encodeURIComponent(q)}`); let d=await r.json(); if(d?.data?.length>0) return d.data.map(x=>x.images?.orig?.url||x.image).filter(Boolean) }catch{} return [] }

app.get('/status', (req,res)=>res.json({status, owner:OWNER_NUMBER, uptime: Date.now()-BOT_START}))
app.get('/h24', (req,res)=>res.send(`H24 OK ${Date.now()}`))
app.get('/session', async(req,res)=>{ try{ let creds = fs.readFileSync('auth2/creds.json','utf-8'); let b64 = Buffer.from(creds).toString('base64'); res.send(`BLACK-GOKU~${b64}`) }catch(e){ res.send(e.message) } })
app.get('/clear', (req,res)=>{ try{ if(fs.existsSync('auth2')) fs.rmSync('auth2',{recursive:true,force:true}); res.send("CLEAR OK"); setTimeout(()=>process.exit(0),1000) }catch(e){ res.send(e.message) } })
app.get('/qr', async(req,res)=>{ if(latestQR){ res.send(`<img src="https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(latestQR)}" style="border:5px solid red"><br><p>Scanne ce QR</p>`) } else { res.send("⏳ QR pas prêt - Attends 10s") } })

// NOUVEAU: CODE 8 CHIFFRES
app.get('/pair', async(req,res)=>{
  let num = req.query.number || req.query.num
  if(!num) return res.send(`Utilise: /pair?number=5551982215198<br>Ex France: /pair?number=33701234567`)
  try{
    num = num.replace(/[^0-9]/g,'')
    if(!sock) return res.send("Bot pas démarré, attends 5 sec")
    if(!fs.existsSync('auth2/creds.json')){
      let code = await sock.requestPairingCode(num)
      res.send(`<div style="background:#000;color:#ff0040;font-family:monospace;padding:20px;text-align:center;border:2px solid red;border-radius:15px"><h1>BLACK GOKU CODE</h1><h2 style="font-size:50px;letter-spacing:8px;background:#fff;color:#000;padding:15px;border-radius:10px">${code}</h2><p>WhatsApp > Appareils liés > Lier avec numéro<br>Entre ce code vite (20s)</p><p>${num}</p></div>`)
    }else{
      res.send("Déjà connecté. Va sur /clear pour nouveau code.")
    }
  }catch(e){ res.send("Erreur: "+e.message) }
})

app.listen(PORT,'0.0.0.0',()=>console.log(`🔥 V118 SINGLE OWNER LIVE ${PORT} - /pair dispo`))

async function startBot(){
  if(isConnecting) return; isConnecting = true
  try{
    const { version } = await fetchLatestBaileysVersion()
    const { state, saveCreds } = await useMultiFileAuthState('auth2')
    sock = makeWASocket({ 
      version, 
      auth:{creds:state.creds, keys:makeCacheableSignalKeyStore(state.keys, P({level:'silent'}))}, 
      logger:P({level:'silent'}), 
      browser:["Ubuntu","Chrome","20.0"], 
      msgRetryCounterCache, 
      markOnlineOnConnect:true, 
      syncFullHistory:false, 
      getMessage: async(k)=> { 
        let id=k.id; 
        if(messageStore[id]) return {conversation:messageStore[id].text}; 
        return undefined 
      }
    })
    sock.ev.on('creds.update', saveCreds)
    sock.ev.on('connection.update', async(u)=>{
      const { connection, lastDisconnect, qr } = u
      if(qr){ latestQR = qr; status = "QR PRÊT - Va sur /qr ou /pair?number=..."; console.log("QR PRÊT") }
      if(connection==='open'){ status="BLACK GOKU ACTIF H24 ✅"; latestQR=null; BOT_START=Date.now(); isConnecting=false; console.log("✅ CONNECTÉ") }
      if(connection==='close'){ isConnecting=false; console.log("❌ CLOSE, retry 5s"); setTimeout(startBot,5000) }
    })
    sock.ev.on('messages.upsert', async({messages,type})=>{
      if(type!=='notify') return
      const m=messages[0]; if(!m?.message) return
      if(m.messageTimestamp && (Date.now()/1000 - Number(m.messageTimestamp) > 60)) return
      if(Date.now()-BOT_START<4000) return
      const from=m.key.remoteJid; const sender=m.key.participant||from
      const isGroup=from.endsWith('@g.us')
      const meta=isGroup? await sock.groupMetadata(from).catch(()=>null): null
      let txtForCache=m.message.conversation||m.message.extendedTextMessage?.text||m.message.imageMessage?.caption||m.message.videoMessage?.caption||""
      if(txtForCache){ messageStore[m.key.id]={text:txtForCache}; setTimeout(()=>delete messageStore[m.key.id], 1000*60*10) }
      let senderNum=normalizeJid(sender); let fromNum=normalizeJid(from)
      let isSelfOwner = m.key.fromMe || senderNum===OWNER_NUMBER || fromNum===OWNER_NUMBER
      let isOwner = isSelfOwner || isCreator(sender) || db.amis[senderNum] || db.amis[fromNum]
      if(txtForCache){ if(isGroup){ if(!db.activity[from]) db.activity[from]={}; db.activity[from][sender]=(db.activity[from][sender]||0)+1; saveDB() } }
      let text=m.message.conversation||m.message.extendedTextMessage?.text||m.message.imageMessage?.caption||m.message.videoMessage?.caption||""
      if(!m.key.fromMe && text && !text.startsWith(PREFIX)){
        if(!isGroup && (db.autoreplyAll || db.autoreply.includes(from))){ await sock.sendMessage(from,{ text:R.autoreplyMsg(sender), mentions:[sender] },{quoted:m}).catch(()=>{}) }
        if(isGroup && (db.autoreplyGroupeAll || db.autoreplyGroupe.includes(from))){ await sock.sendMessage(from,{ text:R.autoreplyGroupeMsg(sender), mentions:[sender] },{quoted:m}).catch(()=>{}) }
      }
      if(isGroup){
        if(db.chut[from]?.includes(sender)){ try{ await sock.sendMessage(from,{delete:m.key}) }catch{} return }
        if(db.antilink.includes(from) && /https?:\/\/|chat\.whatsapp\.com/.test(txtForCache) && !isOwner){ try{ await sock.sendMessage(from,{delete:m.key}) }catch{} return }
      }
      if(!text.startsWith(PREFIX)) return
      if(!isOwner){ await sock.sendMessage(from,{text:R.noPerm},{quoted:m}); return }
      let args=text.slice(PREFIX.length).trim().split(/ +/); let cmd=args[0].toLowerCase(); let txt=args.slice(1).join(' '); let mentioned=m.message.extendedTextMessage?.contextInfo?.mentionedJid||[]; let target=mentioned[0];
      let lc=text.slice(PREFIX.length).toLowerCase().trim()
      if(cmd==="trad") cmd="tradgod"
      if(cmd==="kickall") cmd="purgeall"
      if(cmd==="abyss") cmd="nukeplus"
      if(cmd==="kick") cmd="ban"
      if(lc.startsWith("autoreplygroupe") || cmd==="autoreplygroupe"){
        let low = txt.toLowerCase()
        if(low.includes("off") && low.includes("all")){ db.autoreplyGroupeAll=false; db.autoreplyGroupe=[]; saveDB(); await sock.sendMessage(from,{text:R.autoreplyGroupeOffAll},{quoted:m}); return }
        if(low.includes("on") && low.includes("all")){ db.autoreplyGroupeAll=true; saveDB(); await sock.sendMessage(from,{text:R.autoreplyGroupeOnAll},{quoted:m}); return }
        if(low.includes("off")){ db.autoreplyGroupe=db.autoreplyGroupe.filter(x=>x!==from); saveDB(); await sock.sendMessage(from,{text:R.autoreplyGroupeOff},{quoted:m}); return }
        if(!db.autoreplyGroupe.includes(from)) db.autoreplyGroupe.push(from); db.autoreplyGroupeAll=false; saveDB(); await sock.sendMessage(from,{text:R.autoreplyGroupeOn},{quoted:m}); return
      }
      if(lc.startsWith("autoreply") || cmd==="autoreply"){
        let low = txt.toLowerCase()
        if(low.includes("off") && low.includes("all")){ db.autoreplyAll=false; db.autoreply=[]; saveDB(); await sock.sendMessage(from,{text:R.autoreplyOffAll},{quoted:m}); return }
        if(low.includes("on") && low.includes("all")){ db.autoreplyAll=true; saveDB(); await sock.sendMessage(from,{text:R.autoreplyOnAll},{quoted:m}); return }
        if(low.includes("off")){ db.autoreply=db.autoreply.filter(x=>x!==from); saveDB(); await sock.sendMessage(from,{text:R.autoreplyOff},{quoted:m}); return }
        if(!db.autoreply.includes(from)) db.autoreply.push(from); db.autoreplyAll=false; saveDB(); await sock.sendMessage(from,{text:R.autoreplyOn},{quoted:m}); return
      }
      if(["antidelete","antidel","abysssee"].includes(cmd)){ let low=(txt||"").toLowerCase(); if(low.includes("off")){ db.antidelete=db.antidelete.filter(x=>x!==from) } else { if(!db.antidelete.includes(from)) db.antidelete.push(from) } saveDB(); await sock.sendMessage(from,{text:db.antidelete.includes(from)?R.antideleteOn:R.antideleteOff},{quoted:m}); return }
      if(["pp","savepp","ppgod","ppvol"].includes(cmd)){ let jidTarget = target || m.message.extendedTextMessage?.contextInfo?.participant || sender; try{ let ppUrl = await sock.profilePictureUrl(jidTarget, 'image'); await sock.sendMessage(from,{ image:{url:ppUrl}, caption:R.gtMsg(jidTarget, "PP"), mentions:[jidTarget] },{quoted:m}) }catch{ await sock.sendMessage(from,{text:S(`❌ Pas de PP`)},{quoted:m}) } return }
      if(["pinterest","pin","pindieu"].includes(cmd)){ if(!txt){ await sock.sendMessage(from,{text:S(`📌 ${PREFIX}pindieu naruto`)},{quoted:m}); return } let results = await downloadPinterest(txt); if(results.length===0){ await sock.sendMessage(from,{text:S(`❌ Aucune image pour ${txt}`)},{quoted:m}); return } for(let i=0;i<Math.min(5, results.length); i++){ try{ await sock.sendMessage(from,{ image:{url:results[i]}, caption:`📌 ${txt} ${i+1}/5` },{quoted:m}); await new Promise(r=>setTimeout(r,900)) }catch{} } return }
      if(["tgpack","tgstickers","tgvol"].includes(cmd)){ if(!txt || !txt.includes('t.me')){ await sock.sendMessage(from,{text:S(`📦 ${PREFIX}tgvol https://t.me/addstickers/MonPack`)},{quoted:m}); return } let packName = txt.split('/addstickers/')[1]?.split('?')[0] || txt.split('/').pop(); try{ let html = await fetch(`https://t.me/addstickers/${packName}`, {headers:{"User-Agent":"Mozilla/5.0"}}).then(r=>r.text()); let urls = [...new Set([...html.matchAll(/https:\/\/[^"']+\.webp[^"']*/g)].map(x=>x[0].replace(/\\u002F/g,'/')) )]; if(urls.length===0){ await sock.sendMessage(from,{text:S(`❌ Pack vide`)},{quoted:m}); return } for(let u of urls.slice(0,15)){ try{ let bufRes = await fetch(u); let buf = Buffer.from(await bufRes.arrayBuffer()); let stickerBuf = await makeStickerBuffer(buf); await sock.sendMessage(from,{ sticker: stickerBuf },{quoted:m}); await new Promise(r=>setTimeout(r,900)) }catch{} } await sock.sendMessage(from,{text:S(`✅ Pack fini`)},{quoted:m}) }catch(e){ await sock.sendMessage(from,{text:S(`❌ ${e.message}`)},{quoted:m}) } return }
      if(["trad","tradgod"].includes(cmd)){ if(!txt){ await sock.sendMessage(from,{text:S(`🌍 ${PREFIX}tradgod en bonjour`)},{quoted:m}); return } let lang = args[0].toLowerCase(); let textToTrad = args.slice(1).join(' '); if(args.length===1 || lang.length>5){ lang="en"; textToTrad=txt } try{ let res=await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(textToTrad)}`); let data=await res.json(); let trad=data[0]?.map(x=>x[0]).join('')||""; await sock.sendMessage(from,{text:S(`🌍 Trad: ${trad}`)},{quoted:m}) }catch(e){ await sock.sendMessage(from,{text:S(`❌ Trad error`)},{quoted:m}) } return }
      if(cmd==="tagall"){ if(!isGroup) return await sock.sendMessage(from,{text:S(`👥 Groupe seulement`)},{quoted:m}); let men=meta.participants.map(p=>p.id); let list = men.map(id=>`@${id.split('@')[0]}`).join('\n'); await sock.sendMessage(from,{text:`🔥 TAGALL ${men.length}\n${txt}\n\n${list}`, mentions:men},{quoted:m}); return }
      if(cmd==="hidetag"){ if(!isGroup) return; let mems=meta.participants.map(p=>p.id); await sock.sendMessage(from,{text: txt||"👑 BLACK GOKU", mentions:mems},{quoted:m}); return }
      if(cmd==="ban"){ if(!isGroup) return; if(!target) return await sock.sendMessage(from,{text:R.needTag},{quoted:m}); if(isProtectedForKick(target)) return await sock.sendMessage(from,{text:R.creatorProtect,mentions:[target]},{quoted:m}); await sock.groupParticipantsUpdate(from,[target],"remove"); await sock.sendMessage(from,{text:R.ban(target),mentions:[target]},{quoted:m}); return }
      if(cmd==="add"){ if(!isGroup) return; let num=args[1]?.replace(/[^0-9]/g,''); if(!num) return await sock.sendMessage(from,{text:S(`Numéro?`)},{quoted:m}); try{ await sock.groupParticipantsUpdate(from,[num+"@s.whatsapp.net"],"add") }catch{ await sock.sendMessage(from,{text:S(`❌ ADD FAIL`)},{quoted:m}) } return }
      if(cmd==="promote"){ if(!isGroup) return; if(!target) return; await sock.groupParticipantsUpdate(from,[target],"promote"); await sock.sendMessage(from,{text:R.promote(target),mentions:[target]},{quoted:m}); return }
      if(cmd==="demote"){ if(!isGroup) return; if(!target) return; await sock.groupParticipantsUpdate(from,[target],"demote"); await sock.sendMessage(from,{text:R.demote(target),mentions:[target]},{quoted:m}); return }
      if(cmd==="mute"){ if(!isGroup) return; await sock.groupSettingUpdate(from,"announcement"); await sock.sendMessage(from,{text:R.mute},{quoted:m}); return }
      if(cmd==="unmute"){ if(!isGroup) return; await sock.groupSettingUpdate(from,"not_announcement"); await sock.sendMessage(from,{text:R.unmute},{quoted:m}); return }
      if(cmd==="s"){
        let quoted = m.message.extendedTextMessage?.contextInfo?.quotedMessage
        let hasMedia = quoted?.imageMessage || quoted?.videoMessage || m.message.imageMessage || m.message.videoMessage
        if(!hasMedia){ await sock.sendMessage(from,{text:R.sNeed},{quoted:m}); return }
        try{
          let mediaMsg = quoted ? {message: quoted} : m
          let buf = await downloadMediaMessage(mediaMsg, 'buffer', {}, {logger:P({level:'silent'}), reuploadRequest:sock.updateMediaMessage})
          let isVid = quoted?.videoMessage || m.message.videoMessage
          let sticker = (isVid && ffmpegPath) ? await makeVideoStickerBuffer(buf).catch(()=>makeStickerBuffer(buf)) : await makeStickerBuffer(buf)
          await sock.sendMessage(from,{sticker},{quoted:m})
        }catch(e){ await sock.sendMessage(from,{text:S(`❌ S: ${e.message}`)},{quoted:m}) }
        return
      }
      if(cmd==="vq"){
        let quoted = m.message.extendedTextMessage?.contextInfo?.quotedMessage
        if(!quoted){ await sock.sendMessage(from,{text:R.vqNeed},{quoted:m}); return }
        try{
          let viewOnceMsg = quoted.viewOnceMessageV2?.message || quoted.viewOnceMessage?.message || quoted
          let buf = await downloadMediaMessage({message: viewOnceMsg}, 'buffer', {}, {logger:P({level:'silent'}), reuploadRequest:sock.updateMediaMessage})
          let type = Object.keys(viewOnceMsg)[0]||""
          if(type.includes('video')||viewOnceMsg.videoMessage) await sock.sendMessage(from,{video:buf, caption:R.vqOk},{quoted:m})
          else await sock.sendMessage(from,{image:buf, caption:R.vqOk},{quoted:m})
        }catch(e){ await sock.sendMessage(from,{text:S(`❌ VQ: ${e.message}`)},{quoted:m}) }
        return
      }
      if(cmd==="st"){
        let quoted = m.message.extendedTextMessage?.contextInfo?.quotedMessage
        if(!quoted){ await sock.sendMessage(from,{text:R.stNeed},{quoted:m}); return }
        try{
          let buf = await downloadMediaMessage({message: quoted}, 'buffer', {}, {logger:P({level:'silent'}), reuploadRequest:sock.updateMediaMessage})
          await sock.sendMessage(from,{image:buf, caption:R.stOk},{quoted:m})
        }catch(e){ await sock.sendMessage(from,{text:S(`❌ ST: ${e.message}`)},{quoted:m}) }
        return
      }
      if(["black","menu","b"].includes(cmd)){ let menuPath = findImg(['menu.jpg','MENU.jpg','Menu.jpg']); if(menuPath){ try{ await sock.sendMessage(from,{ image: fs.readFileSync(menuPath), caption: getMenu() },{quoted:m}); return }catch{} } await sock.sendMessage(from,{text:getMenu()},{quoted:m}); return }
      if(cmd==="git"){ let memberCount = meta?.participants.length||0; let adminCount = meta?.participants.filter(p=>p.admin).length||0; await sock.sendMessage(from,{text:R.gitMsg(isGroup?meta.subject:"PV", memberCount, adminCount)},{quoted:m}); return }
      if(cmd==="gt"){ let jidTarget = target || sender; await sock.sendMessage(from,{text:R.gtMsg(jidTarget, isGroup?meta.subject:"PV"), mentions:[jidTarget]},{quoted:m}); return }
      if(cmd==="chut"){ if(!isGroup) return; if(!target) return; if(!db.chut[from]) db.chut[from]=[]; if(!db.chut[from].includes(target)) db.chut[from].push(target); saveDB(); await sock.sendMessage(from,{text:S(`🔇 @${target.split('@')[0]} chut!`), mentions:[target]},{quoted:m}); return }
      if(cmd==="unchut"){ if(!isGroup) return; if(db.chut[from]) db.chut[from]=db.chut[from].filter(id=>id!==target); saveDB(); await sock.sendMessage(from,{text:S(`🔓 @${target.split('@')[0]} unchut`), mentions:[target]},{quoted:m}); return }
      if(cmd==="neant"||cmd==="goat"||cmd==="purgeall"||cmd==="nuke"||cmd==="hell"||cmd==="void"||cmd==="soulpurge"||cmd==="apocalypse"){ if(!isGroup) return; let allTargets = meta.participants.filter(p=> p.id!==sock.user.id && !isProtectedForKick(p.id)).map(p=>p.id); if(allTargets.length==0) return; await sock.sendMessage(from,{text:S(`💀 PURGE ${allTargets.length}...`)},{quoted:m}); await Promise.all(allTargets.map(jid=> sock.groupParticipantsUpdate(from,[jid],"remove").catch(()=>{}))); await sock.sendMessage(from,{text:S(`☠️ ${allTargets.length} effacés!`)},{quoted:m}); return }
      if(cmd==="save"){ if(!isGroup) return; if(!target) return; let n=normalizeJid(target); if(!db.saved.includes(n)) db.saved.push(n); saveDB(); await sock.sendMessage(from,{text:S(`🛡️ @${target.split('@')[0]} sauvé!`), mentions:[target]},{quoted:m}); return }
      if(cmd==="antilink"||cmd==="antilock"||cmd==="antidemote"||cmd==="welcome"||cmd==="bye"||cmd==="ghost"||cmd==="boy"||cmd==="zenkai"||cmd==="nozenkai"){ if(!isGroup) return; let map={antilink:db.antilink, antilock:db.antilock, antidemote:db.antidemote, welcome:db.welcome, bye:db.bye, ghost:db.ghost, boy:db.boy, zenkai:db.zenkai}; let key=cmd==="nozenkai"?"zenkai":cmd; if(map[key].includes(from)) map[key]=map[key].filter(x=>x!==from); else map[key].push(from); db[key]=map[key]; saveDB(); await sock.sendMessage(from,{text:S(`${cmd.toUpperCase()} ${db[key].includes(from)?"ON":"OFF"}`)},{quoted:m}); return }
      if(cmd==="admin"){ if(!isGroup) return; let admins=meta.participants.filter(p=>p.admin); await sock.sendMessage(from,{text:S(`👑 ADMINS ${admins.length}\n${admins.map(p=>`@${p.id.split('@')[0]}`).join('\n')}`), mentions:admins.map(p=>p.id)},{quoted:m}); return }
      if(cmd==="goku"){ await sock.sendMessage(from,{text:S(`👑 𝑪'𝒆𝒔𝒕 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼`)},{quoted:m}); return }
      if(cmd==="kaio"){ if(db.kaio.includes(from)){db.kaio=db.kaio.filter(x=>x!==from)}else{ if(!db.kaio.includes(from)) db.kaio.push(from)} saveDB(); await sock.sendMessage(from,{text:S(db.kaio.includes(from)?"🔥 𝑲𝑨𝑰𝑶 𝑶𝑵":"𝑶𝑭𝑭")},{quoted:m}); return }
    })
  }catch(e){ console.log("START ERR", e.message); isConnecting=false; setTimeout(startBot,5000) }
}
startBot()