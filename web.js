// web.js - BLACK GOKU V115.8 - MENU INCHANGÉ + TOUTES CONFIRMATIONS STYLE SUKUNA + FIX MEDIA
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

let db = { amis:{}, saved:[], pro:[], protec:[], chut:{}, blockadmin:[], godmode:[], kaio:[], antilink:[], antisticker:[], welcome:[], welcomeTexts:{}, bye:[], byeTexts:{}, ghost:[], ghostCache:{}, antibod:{}, curse:{}, antilock:[], antidemote:[], clans:{}, zenkai:[], zenkaiUsers:[], boy:[], boyUsers:[], ownerLids:[], privateMode:false, botOff:false, activity:{}, groupCache:{}, muted:{}, styles:{}, antidelete:[], antideleteCache:{}, autoreply:[], autoreplyAll:false, autoreplyGroupe:[], autoreplyGroupeAll:false }
if(fs.existsSync(DB_FILE)){ try{ db={...db,...JSON.parse(fs.readFileSync(DB_FILE))} }catch{} }
const saveDB = ()=>fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2))
let sock, status="Demarrage...", latestQR=null, latestPairCode=null, BOT_START=Date.now()
let messageStore = {}
let isConnecting = false

// MENU EXACT INCHANGÉ - COMME TU L'AS ENVOYÉ
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

const S = (t)=>`┏━━━━━━━━━━━━━━━━━━┓
┃ ꧁𓊈𒆜BLACK GOKU𒆜𓊉꧂ ┃
┗━━━━━━━━━━━━━━━━━━┛
${t}
┗━━━ 𝑻𝑯𝑬 𝑮𝑶𝑨𝑻 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 ━━━┛`

const R = {
noPerm: S(`😈 𝑺𝑬𝑼𝑳 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 𝑷𝑬𝑼𝑻 𝑼𝑻𝑰𝑳𝑰𝑺𝑬𝑹 𝑪𝑬 𝑩𝑶𝑻`),
needTag: S(`😈 𝑻𝑨𝑮 𝑼𝑵 𝑴𝑶𝑹𝑻𝑬𝑳!`),
creatorProtect: S(`👑🔥 𝑰𝑴𝑷𝑶𝑺𝑺𝑰𝑩𝑳𝑬 𝑫𝑬 𝑻𝑶𝑼𝑪𝑯𝑬𝑹 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼!`),
ban:(j)=>S(`💀 𝑯𝑨𝑲𝑨𝑰! @${j.split('@')[0]} 𝒆𝒇𝒇𝒂𝒄é!`),
promote:(j)=>S(`👑 @${j.split('@')[0]} é𝒍𝒆𝒗é!`),
demote:(j)=>S(`💔 @${j.split('@')[0]} 𝒅é𝒄𝒉𝒖!`),
mute: S(`🤫 𝑴𝑼𝑻𝑬 𝑶𝑵\n🔒 𝑮𝒓𝒐𝒖𝒑𝒆 𝒇𝒆𝒓𝒎é, 𝒔𝒆𝒖𝒍𝒔 𝒍𝒆𝒔 𝒂𝒅𝒎𝒊𝒏𝒔 𝒑𝒂𝒓𝒍𝒆𝒏𝒕!`), unmute: S(`🔊 𝑼𝑵𝑴𝑼𝑻𝑬 𝑶𝑭𝑭\n🔓 𝑮𝒓𝒐𝒖𝒑𝒆 𝒐𝒖𝒗𝒆𝒓𝒕!`),
vqOk: S(`👁️🔥 𝑽𝑼𝑬 𝑫É𝑽𝑶𝑰𝑳É𝑬!`), vqNeed: S(`😈 𝑹é𝒑𝒐𝒏𝒅𝒔 à 𝒖𝒏𝒆 𝒗𝒖𝒆 𝒖𝒏𝒊𝒒𝒖𝒆!`), sNeed: S(`😈 𝑹é𝒑𝒐𝒏𝒅𝒔 à 𝒖𝒏𝒆 𝒊𝒎𝒂𝒈𝒆/𝒗𝒊𝒅é𝒐!`), stNeed: S(`😈 𝑹é𝒑𝒐𝒏𝒅𝒔 à 𝒖𝒏 𝒔𝒕𝒂𝒕𝒖𝒕!`), stOk: S(`👁️ 𝑺𝒕𝒂𝒕𝒖𝒕 𝒗𝒐𝒍é!`),
rdmOk:(j)=>S(`🎲 @${j.split('@')[0]} 𝒄𝒉𝒐𝒊𝒔𝒊 𝒑𝒂𝒓 𝒍𝒆 𝒅𝒆𝒔𝒕𝒊𝒏!`), timeEnd: S(`⏰ 𝑻𝑰𝑴𝑬 𝑭𝑰𝑵𝑰!`),
antideleteOn: S(`👁️ 𝑨𝑩𝒀𝑺𝑺𝑺𝑬𝑬 𝑶𝑵\n💀 𝑱𝒆 𝒗𝒆𝒓𝒓𝒂𝒊 𝒍𝒆𝒔 𝒔𝒖𝒑𝒑𝒓𝒆𝒔𝒔𝒊𝒐𝒏𝒔!`), antideleteOff: S(`👁️ 𝑨𝑩𝒀𝑺𝑺𝑺𝑬𝑬 𝑶𝑭𝑭`),
autoreplyOn: S(`🤖 𝑨𝑼𝑻𝑶𝑹𝑬𝑷𝑳𝒀 𝑶𝑵\n✅ 𝑨𝒄𝒕𝒊𝒗é 𝒅𝒂𝒏𝒔 𝒄𝒆 𝑷𝑽!`), autoreplyOff: S(`🤖 𝑨𝑼𝑻𝑶𝑹𝑬𝑷𝑳𝒀 𝑶𝑭𝑭`), autoreplyOnAll: S(`🤖 𝑨𝑼𝑻𝑶𝑹𝑬𝑷𝑳𝒀 𝑶𝑵 𝑨𝑳𝑳 𝑷𝑽\n✅ 𝑱𝒆 𝒓é𝒑𝒐𝒏𝒅𝒔 à 𝒕𝒐𝒖𝒔 𝒍𝒆𝒔 𝑷𝑽!`), autoreplyOffAll: S(`🤖 𝑶𝑭𝑭 𝑨𝑳𝑳 𝑷𝑽`),
autoreplyGroupeOn: S(`👑 𝑨𝑼𝑻𝑶𝑹𝑬𝑷𝑳𝒀𝑮𝑹𝑶𝑼𝑷𝑬 𝑶𝑵\n✅ 𝑨𝒄𝒕𝒊𝒗é 𝒅𝒂𝒏𝒔 𝒄𝒆 𝒈𝒓𝒐𝒖𝒑𝒆!`), autoreplyGroupeOff: S(`👑 𝑨𝑼𝑻𝑶𝑹𝑬𝑷𝑳𝒀𝑮𝑹𝑶𝑼𝑷𝑬 𝑶𝑭𝑭`), autoreplyGroupeOnAll: S(`👑 𝑶𝑵 𝑨𝑳𝑳\n✅ 𝑨𝒄𝒕𝒊𝒗é 𝒅𝒂𝒏𝒔 𝒕𝒐𝒖𝒔 𝒍𝒆𝒔 𝒈𝒓𝒐𝒖𝒑𝒆𝒔!`), autoreplyGroupeOffAll: S(`👑 𝑶𝑭𝑭 𝑨𝑳𝑳`),
// NOUVELLES CONFIRMATIONS STYLE SUKUNA POUR COMMANDES SANS RÉPONSE
tagallDone:(n)=>S(`🔥 𝑻𝑨𝑮𝑨𝑳𝑳 𝑬𝒙é𝒄𝒖𝒕é!\n👥 ${n} 𝒎𝒆𝒎𝒃𝒓𝒆𝒔 𝒕𝒂𝒈𝒖é𝒔!`),
hidetagDone:(n)=>S(`👁️ 𝑯𝑰𝑫𝑬𝑻𝑨𝑮 𝑬𝒙é𝒄𝒖𝒕é!\n👥 ${n} 𝒊𝒏𝒗𝒊𝒔𝒊𝒃𝒍𝒆𝒔 𝒕𝒂𝒈𝒖é𝒔!`),
addDone:(n)=>S(`➕ ${n} 𝒂𝒋𝒐𝒖𝒕é 𝒂𝒗𝒆𝒄 𝒔𝒖𝒄𝒄è𝒔!`),
chutOn:(j)=>S(`🔇 @${j.split('@')[0]} 𝒓é𝒅𝒖𝒊𝒕 𝒂𝒖 𝒔𝒊𝒍𝒆𝒏𝒄𝒆!\n💀 𝑰𝒍 𝒏𝒆 𝒑𝒆𝒖𝒕 𝒑𝒍𝒖𝒔 𝒑𝒂𝒓𝒍𝒆𝒓!`), chutOff:(j)=>S(`🔊 @${j.split('@')[0]} 𝒍𝒊𝒃é𝒓é!`),
saveOn:(j)=>S(`🛡️ @${j.split('@')[0]} 𝒔𝒂𝒖𝒗é!\n👑 𝑰𝒍 𝒆𝒔𝒕 𝒑𝒓𝒐𝒕é𝒈é 𝒄𝒐𝒏𝒕𝒓𝒆 𝒍𝒆𝒔 𝒌𝒊𝒄𝒌!`),
antilinkOn: S(`🔗 𝑨𝑵𝑻𝑰𝑳𝑰𝑵𝑲 𝑶𝑵\n❌ 𝑳𝒆𝒔 𝒍𝒊𝒆𝒏𝒔 𝒔𝒐𝒏𝒕 𝒊𝒏𝒕𝒆𝒓𝒅𝒊𝒕𝒔!`), antilinkOff: S(`🔗 𝑨𝑵𝑻𝑰𝑳𝑰𝑵𝑲 𝑶𝑭𝑭`),
welcomeOn: S(`👋 𝑾𝑬𝑳𝑪𝑶𝑴𝑬 𝑶𝑵\n🌸 𝑱'𝒂𝒄𝒄𝒖𝒆𝒊𝒍𝒍𝒆𝒓𝒂𝒊 𝒍𝒆𝒔 𝒏𝒐𝒖𝒗𝒆𝒂𝒖𝒙!`), welcomeOff: S(`👋 𝑾𝑬𝑳𝑪𝑶𝑴𝑬 𝑶𝑭𝑭`),
byeOn: S(`💀 𝑩𝒀𝑬 𝑶𝑵\n🌑 𝑱𝒆 𝒅𝒊𝒓𝒂𝒊 𝒂𝒖 𝒓𝒆𝒗𝒐𝒊𝒓 à 𝒄𝒆𝒖𝒙 𝒒𝒖𝒊 𝒑𝒂𝒓𝒕𝒆𝒏𝒕!`), byeOff: S(`💀 𝑩𝒀𝑬 𝑶𝑭𝑭`),
ghostOn: S(`👻 𝑮𝑯𝑶𝑺𝑻 𝑶𝑵\n👁️ 𝑱𝒆 𝒔𝒖𝒓𝒗𝒆𝒊𝒍𝒍𝒆 𝒍𝒆𝒔 𝒇𝒂𝒏𝒕ô𝒎𝒆𝒔!`), ghostOff: S(`👻 𝑮𝑯𝑶𝑺𝑻 𝑶𝑭𝑭`),
purgeDone:(n)=>S(`☠️ 𝑷𝑼𝑹𝑮𝑬 𝑻𝑬𝑹𝑴𝑰𝑵É!\n💀 ${n} â𝒎𝒆𝒔 𝒆𝒇𝒇𝒂𝒄é𝒆𝒔!`),
amiOn:(j)=>S(`✅ @${j.split('@')[0]} 𝒆𝒔𝒕 𝒎𝒐𝒏 𝑨𝑴𝑰!\n👑 𝑰𝒍 𝒑𝒆𝒖𝒕 𝒖𝒕𝒊𝒍𝒊𝒔𝒆𝒓 𝒍𝒆 𝒃𝒐𝒕!`), amiOff:(j)=>S(`❌ @${j.split('@')[0]} 𝒏'𝒆𝒔𝒕 𝒑𝒍𝒖𝒔 𝒎𝒐𝒏 𝑨𝑴𝑰!`),
antilockOn: S(`🔒 𝑨𝑵𝑻𝑰𝑳𝑶𝑪𝑲 𝑶𝑵\n💀 𝑷𝒆𝒓𝒔𝒐𝒏𝒏𝒆 𝒏𝒆 𝒑𝒆𝒖𝒕 𝒇𝒖𝒊𝒓!`), antilockOff: S(`🔒 𝑨𝑵𝑻𝑰𝑳𝑶𝑪𝑲 𝑶𝑭𝑭`),
antidemoteOn: S(`🛡️ 𝑨𝑵𝑻𝑰𝑫𝑬𝑴𝑶𝑻𝑬 𝑶𝑵\n👑 𝑳𝒆𝒔 𝒂𝒅𝒎𝒊𝒏𝒔 𝒔𝒐𝒏𝒕 𝒑𝒓𝒐𝒕é𝒈é𝒔!`), antidemoteOff: S(`🛡️ 𝑨𝑵𝑻𝑰𝑫𝑬𝑴𝑶𝑻𝑬 𝑶𝑭𝑭`),
zenkaiOn: S(`⚡ 𝒁𝑬𝑵𝑲𝑨𝑰 𝑶𝑵\n🔥 𝑷𝒖𝒊𝒔𝒔𝒂𝒏𝒄𝒆 𝒂𝒄𝒕𝒊𝒗é𝒆!`), zenkaiOff: S(`⚡ 𝒁𝑬𝑵𝑲𝑨𝑰 𝑶𝑭𝑭`),
boyOn: S(`💀 𝑩𝑶𝒀 𝑶𝑵\n👁️ 𝑴𝒐𝒅𝒆 𝒇𝒂𝒏𝒕ô𝒎𝒆 𝒂𝒄𝒕𝒊𝒇!`), boyOff: S(`💀 𝑩𝑶𝒀 𝑶𝑭𝑭`),
blockadminOn: S(`⛓️ 𝑩𝑳𝑶𝑪𝑲𝑨𝑫𝑴𝑰𝑵 𝑶𝑵\n🔒 𝑨𝒅𝒎𝒊𝒏𝒔 𝒃𝒍𝒐𝒒𝒖é𝒔!`), blockadminOff: S(`⛓️ 𝑩𝑳𝑶𝑪𝑲𝑨𝑫𝑴𝑰𝑵 𝑶𝑭𝑭`),
kaioOn: S(`🔥 𝑲𝑨𝑰𝑶 𝑶𝑵\n💀 𝑲𝒂𝒊𝒐-𝒌𝒆𝒏 𝒂𝒄𝒕𝒊𝒗é!`), kaioOff: S(`🔥 𝑲𝑨𝑰𝑶 𝑶𝑭𝑭`),

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
  if(custom) return custom.replace(/@user/g, `@${j.split('@')[0]}`).replace(/@group/g, g)
  return `┏━━━━━━━━━━━━━━━━━━┓
┃ ꧁𓊈𒆜BLACK GOKU𒆜𓊉꧂ ┃
┗━━━━━━━━━━━━━━━━━━┛
👑 𝑩𝒊𝒆𝒏𝒗𝒆𝒏𝒖𝒆 @${j.split('@')[0]} !

🌸 𝑻𝒖 𝒂𝒔 𝒓𝒆𝒋𝒐𝒊𝒏𝒕 : ${g}
👥 𝑴𝒆𝒎𝒃𝒓𝒆𝒔 : ${members}
👑 𝑨𝒅𝒎𝒊𝒏𝒔 : ${admins}

✨ 𝑷𝒓𝒐𝒇𝒊𝒕𝒆 𝒃𝒊𝒆𝒏 𝒅𝒖 𝒈𝒓𝒐𝒖𝒑𝒆 𝒆𝒕 𝒓𝒆𝒔𝒑𝒆𝒄𝒕𝒆 𝒍𝒆𝒔 𝒓è𝒈𝒍𝒆𝒔 !
🔥 𝑨𝒎𝒖𝒔𝒆-𝒕𝒐𝒊 𝒃𝒊𝒆𝒏 !
┗━━━ 𝑻𝑯𝑬 𝑮𝑶𝑨𝑻 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 ━━━┛`
},
byeMsg:(j, g, custom, members, admins)=>{
  if(custom) return custom.replace(/@user/g, `@${j.split('@')[0]}`).replace(/@group/g, g)
  return `┏━━━━━━━━━━━━━━━━━━┓
┃ ꧁𓊈𒆜BLACK GOKU𒆜𓊉꧂ ┃
┗━━━━━━━━━━━━━━━━━━┛
💀 𝑨𝒅𝒊𝒆𝒖 @${j.split('@')[0]} !

🌑 𝑻𝒖 𝒂𝒔 𝒒𝒖𝒊𝒕𝒕é : ${g}
👥 𝑴𝒆𝒎𝒃𝒓𝒆𝒔 : ${members}
👑 𝑨𝒅𝒎𝒊𝒏𝒔 : ${admins}

💨 𝑸𝒖𝒆 𝒍𝒆 𝒏é𝒂𝒏𝒕 𝒕'𝒆𝒎𝒑𝒐𝒓𝒕𝒆...
🔥 𝑶𝒏 𝒕'𝒐𝒖𝒃𝒍𝒊𝒆𝒓𝒂 𝒑𝒂𝒔 !
┗━━━ 𝑻𝑯𝑬 𝑮𝑶𝑨𝑻 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 ━━━┛`
},
gitMsg:(g, members, admins)=>`┏━━━━━━━━━━━━━━━━━━┓
┃ ꧁𓊈𒆜BLACK GOKU𒆜𓊉꧂ ┃
┗━━━━━━━━━━━━━━━━━━┛
👑 𝑮𝒊𝒕𝒉𝒖𝒃 𝑶𝒇𝒇𝒊𝒄𝒊𝒆𝒍

🌸 𝑮𝒓𝒐𝒖𝒑𝒆 : ${g}
👥 𝑴𝒆𝒎𝒃𝒓𝒆𝒔 : ${members}
👑 𝑨𝒅𝒎𝒊𝒏𝒔 : ${admins}
🔗 𝑳𝒊𝒆𝒏 : ${GITHUB_LINK}

💀 𝑪𝒐𝒅é 𝒑𝒂𝒓 𝑻𝑯𝑬 𝑮𝑶𝑨𝑻 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼
🔥 𝑫𝒐𝒏𝒏𝒆 𝒖𝒏𝒆 é𝒕𝒐𝒊𝒍𝒆 !
┗━━━ 𝑻𝑯𝑬 𝑮𝑶𝑨𝑻 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 ━━━┛`,
gtMsg:(j, g, members, admins, isPv)=>`┏━━━━━━━━━━━━━━━━━━┓
┃ ꧁𓊈𒆜BLACK GOKU𒆜𓊉꧂ ┃
┗━━━━━━━━━━━━━━━━━━┛
👑 𝑷𝒓𝒐𝒇𝒊𝒍 𝑽𝒐𝒍é !

👤 𝑼𝒔𝒆𝒓 : @${j.split('@')[0]}
${isPv ? `📸 𝑷𝒉𝒐𝒕𝒐 𝒅𝒆 𝒑𝒓𝒐𝒇𝒊𝒍 𝒄𝒊-𝒅𝒆𝒔𝒔𝒖𝒔` : `🌸 𝑮𝒓𝒐𝒖𝒑𝒆 : ${g}\n👥 𝑴𝒆𝒎𝒃𝒓𝒆𝒔 : ${members}\n👑 𝑨𝒅𝒎𝒊𝒏𝒔 : ${admins}`}
💀 𝑽𝒐𝒍é 𝒂𝒗𝒆𝒄 𝒔𝒖𝒄𝒄è𝒔 𝒑𝒂𝒓 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼
🔥 𝑮𝑻 𝑻𝒆𝒓𝒎𝒊𝒏é !
┗━━━ 𝑻𝑯𝑬 𝑮𝑶𝑨𝑻 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 ━━━┛`,
}

function normalizeJid(j){ return j?.split(':')[0].split('@')[0].replace(/[^0-9]/g,'')||"" }
function getRealNumberFromLid(lidJid, meta){ if(!meta||!lidJid) return null; try{ for(let p of meta.participants){ if(p.id===lidJid&&p.phoneNumber) return normalizeJid(p.phoneNumber) } }catch{} return null }
function isCreator(jid, meta){ if(!jid) return false; let n=normalizeJid(jid); if(n===OWNER_NUMBER) return true; if(db.ownerLids.includes(jid)||db.ownerLids.includes(n)) return true; return false }
function isProtectedForKick(jid, meta){ if(isCreator(jid,meta)) return true; let n=normalizeJid(jid); if(meta&&jid&&jid.includes('@lid')){ let real=getRealNumberFromLid(jid,meta); if(real&&(db.saved.includes(real)||db.protec.includes(real))) return true } return db.saved.includes(jid)||db.protec.includes(jid)||db.saved.includes(n)||db.protec.includes(n) }
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
async function safeDownload(m, quoted){
  try{
    if(quoted){
      let q=quoted
      if(q.viewOnceMessageV2?.message) q=q.viewOnceMessageV2.message
      if(q.viewOnceMessage?.message) q=q.viewOnceMessage.message
      return await downloadMediaMessage({message:q, key:m.key}, 'buffer', {}, {logger:P({level:'silent'}), reuploadRequest:sock.updateMediaMessage})
    }
    return await downloadMediaMessage(m, 'buffer', {}, {logger:P({level:'silent'}), reuploadRequest:sock.updateMediaMessage})
  }catch(e){ throw e }
}
function findImg(list){ for(let f of list){ if(fs.existsSync(f)) return f } return null }
async function downloadPinterest(q){ try{ let r=await fetch(`https://api.siputzx.my.id/api/s/pinterest?query=${encodeURIComponent(q)}`); let d=await r.json(); if(d?.data?.length>0) return d.data.map(x=>x.images?.orig?.url||x.image).filter(Boolean) }catch{} return [] }

app.get('/', (req,res)=>res.send(`BLACK GOKU ${status} FFMPEG ${ffmpegPath?'ON':'OFF'}`))
app.get('/h24', (req,res)=>res.send(`H24 OK`))
app.get('/session', async(req,res)=>{ try{ let creds = fs.readFileSync('auth2/creds.json','utf-8'); let b64 = Buffer.from(creds).toString('base64'); res.send(`BLACK-GOKU~${b64}`) }catch(e){ res.send(e.message) } })
app.get('/clear', (req,res)=>{ try{ if(fs.existsSync('auth2')) fs.rmSync('auth2',{recursive:true,force:true}); res.send("CLEAR OK"); setTimeout(()=>process.exit(0),1000) }catch(e){ res.send(e.message) } })
app.get('/pair', async(req,res)=>{ if(!sock) return res.status(503).send("⏳"); let num = (req.query.num||OWNER_NUMBER).replace(/[^0-9]/g,''); try{ let code = await sock.requestPairingCode(num); res.send(code) }catch(e){ res.status(500).send(e.message) } })
app.get('/qr', async(req,res)=>{ if(latestQR){ res.send(`<img src="https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(latestQR)}">`) } else { res.send("⏳ QR") } })
app.listen(PORT,'0.0.0.0',()=>console.log(`🔥 V115.8 LIVE ${PORT}`))

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
      if(m.messageTimestamp && (Date.now()/1000 - Number(m.messageTimestamp) > 30)) return
      if(Date.now()-BOT_START<5000) return
      const from=m.key.remoteJid; const sender=m.key.participant||from
      const isGroup=from.endsWith('@g.us')
      const meta=isGroup? await sock.groupMetadata(from).catch(()=>null): null
      let txtForCache=m.message.conversation||m.message.extendedTextMessage?.text||m.message.imageMessage?.caption||m.message.videoMessage?.caption||""
      let senderNum=normalizeJid(sender); let fromNum=normalizeJid(from)
      let isSelfOwner = senderNum===OWNER_NUMBER || fromNum===OWNER_NUMBER || m.key.fromMe
      let isOwner=isSelfOwner || isCreator(sender, meta) || db.amis[senderNum] || db.amis[fromNum]
      if(txtForCache){ if(isGroup){ if(!db.activity[from]) db.activity[from]={}; db.activity[from][sender]=(db.activity[from][sender]||0)+1; saveDB() } }
      let text=m.message.conversation||m.message.extendedTextMessage?.text||m.message.imageMessage?.caption||m.message.videoMessage?.caption||""

      if(!m.key.fromMe && text && !text.startsWith(PREFIX)){
        if(!isGroup && (db.autoreplyAll || db.autoreply.includes(from))){
          await sock.sendMessage(from,{ text:R.autoreplyMsg(sender), mentions:[sender] },{quoted:m}).catch(()=>{})
        }
        if(isGroup && (db.autoreplyGroupeAll || db.autoreplyGroupe.includes(from))){
          let mentionedJid = m.message.extendedTextMessage?.contextInfo?.mentionedJid || []
          let botNum = normalizeJid(sock.user.id)
          let ownerNum = OWNER_NUMBER
          let isBotTagged = mentionedJid.some(j=> normalizeJid(j)===botNum || j.includes(botNum))
          let isOwnerTagged = mentionedJid.some(j=> normalizeJid(j)===ownerNum)
          let participant = m.message.extendedTextMessage?.contextInfo?.participant || ""
          let isReplyToBot = participant && normalizeJid(participant)===botNum
          if(isBotTagged || isOwnerTagged || isReplyToBot){
            await sock.sendMessage(from,{ text:R.autoreplyGroupeMsg(sender), mentions:[sender] },{quoted:m}).catch(()=>{})
          }
        }
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

      if(lc.startsWith("autoreplygroupe")){
        let low=(txt||"").toLowerCase()
        if(low.includes("off") && low.includes("all")){ db.autoreplyGroupeAll=false; db.autoreplyGroupe=[]; saveDB(); await sock.sendMessage(from,{text:R.autoreplyGroupeOffAll},{quoted:m}); return }
        if(low.includes("on") && low.includes("all")){ db.autoreplyGroupeAll=true; saveDB(); await sock.sendMessage(from,{text:R.autoreplyGroupeOnAll},{quoted:m}); return }
        if(low.includes("off")){ db.autoreplyGroupe=db.autoreplyGroupe.filter(x=>x!==from); saveDB(); await sock.sendMessage(from,{text:R.autoreplyGroupeOff},{quoted:m}); return }
        if(low.includes("on")||low===""){ if(!db.autoreplyGroupe.includes(from)) db.autoreplyGroupe.push(from); saveDB(); await sock.sendMessage(from,{text:R.autoreplyGroupeOn},{quoted:m}); return }
      }
      if(lc.startsWith("autoreply")){
        let low=(txt||"").toLowerCase()
        if(low.includes("off") && low.includes("all")){ db.autoreplyAll=false; db.autoreply=[]; saveDB(); await sock.sendMessage(from,{text:R.autoreplyOffAll},{quoted:m}); return }
        if(low.includes("on") && low.includes("all")){ db.autoreplyAll=true; saveDB(); await sock.sendMessage(from,{text:R.autoreplyOnAll},{quoted:m}); return }
        if(low.includes("off")){ db.autoreply=db.autoreply.filter(x=>x!==from); saveDB(); await sock.sendMessage(from,{text:R.autoreplyOff},{quoted:m}); return }
        if(low.includes("on")||low===""){ if(!db.autoreply.includes(from)) db.autoreply.push(from); saveDB(); await sock.sendMessage(from,{text:R.autoreplyOn},{quoted:m}); return }
      }

      if(["antidelete","antidel","abysssee"].includes(cmd)){ let low=(txt||"").toLowerCase(); if(low.includes("off")){ db.antidelete=db.antidelete.filter(x=>x!==from) } else { if(!db.antidelete.includes(from)) db.antidelete.push(from) } saveDB(); await sock.sendMessage(from,{text:db.antidelete.includes(from)?R.antideleteOn:R.antideleteOff},{quoted:m}); return }
      if(["pp","savepp","ppgod","ppvol"].includes(cmd)){ let jidTarget = target || m.message.extendedTextMessage?.contextInfo?.participant || sender; try{ let ppUrl = await sock.profilePictureUrl(jidTarget, 'image'); await sock.sendMessage(from,{ image:{url:ppUrl}, caption:R.gtMsg(jidTarget, "PP", "1", "1", true), mentions:[jidTarget] },{quoted:m}) }catch{ await sock.sendMessage(from,{text:S(`❌ Pas de PP`)},{quoted:m}) } return }
      if(["pinterest","pin","pindieu"].includes(cmd)){ if(!txt){ await sock.sendMessage(from,{text:S(`📌 ${PREFIX}pindieu naruto`)},{quoted:m}); return } let results = await downloadPinterest(txt); if(results.length===0){ await sock.sendMessage(from,{text:S(`❌ Aucune image pour ${txt}`)},{quoted:m}); return } for(let i=0;i<Math.min(5, results.length); i++){ try{ await sock.sendMessage(from,{ image:{url:results[i]}, caption:`📌 ${txt} ${i+1}/5` },{quoted:m}); await new Promise(r=>setTimeout(r,900)) }catch{} } return }
      if(["tgpack","tgstickers","tgvol"].includes(cmd)){ if(!txt || !txt.includes('t.me')){ await sock.sendMessage(from,{text:S(`📦 ${PREFIX}tgvol https://t.me/addstickers/MonPack`)},{quoted:m}); return } let packName = txt.split('/addstickers/')[1]?.split('?')[0] || txt.split('/').pop(); try{ let html = await fetch(`https://t.me/addstickers/${packName}`, {headers:{"User-Agent":"Mozilla/5.0"}}).then(r=>r.text()); let urls = [...new Set([...html.matchAll(/https:\/\/[^"']+\.webp[^"']*/g)].map(x=>x[0].replace(/\\u002F/g,'/')) )]; if(urls.length===0){ await sock.sendMessage(from,{text:S(`❌ Pack vide`)},{quoted:m}); return } for(let u of urls.slice(0,15)){ try{ let bufRes = await fetch(u); let buf = Buffer.from(await bufRes.arrayBuffer()); let stickerBuf = await makeStickerBuffer(buf); await sock.sendMessage(from,{ sticker: stickerBuf },{quoted:m}); await new Promise(r=>setTimeout(r,900)) }catch{} } await sock.sendMessage(from,{text:S(`✅ Pack fini - ${urls.length} volés!`)},{quoted:m}) }catch(e){ await sock.sendMessage(from,{text:S(`❌ ${e.message}`)},{quoted:m}) } return }
      if(["trad","tradgod"].includes(cmd)){ if(!txt){ await sock.sendMessage(from,{text:S(`🌍 ${PREFIX}tradgod en bonjour`)},{quoted:m}); return } let lang = args[0].toLowerCase(); let textToTrad = args.slice(1).join(' '); if(args.length===1 || lang.length>5){ lang="en"; textToTrad=txt } try{ let res=await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(textToTrad)}`); let data=await res.json(); let trad=data[0]?.map(x=>x[0]).join('')||""; await sock.sendMessage(from,{text:R.gtMsg(sender, trad, "Trad", lang, false), mentions:[sender]},{quoted:m}) }catch(e){ await sock.sendMessage(from,{text:S(`❌ Trad error`)},{quoted:m}) } return }
      if(["lyrics","stt","paroles"].includes(cmd)){ let q = m.message.extendedTextMessage?.contextInfo?.quotedMessage; let hasAudio = q?.audioMessage || m.message.audioMessage; if(!hasAudio){ await sock.sendMessage(from,{text:S(`🎙️ Réponds à un vocal avec ${PREFIX}lyrics`)},{quoted:m}); return } try{ let audioMsg = q ? { message: q } : m; let buf = await safeDownload(audioMsg, null); let fd2 = new FormData(); fd2.append('file', new Blob([buf]), 'audio.ogg'); let r2 = await fetch('https://api.siputzx.my.id/api/tools/transcribe', {method:'POST', body: fd2}); let j2 = await r2.json(); let txtT = j2?.data?.text || j2?.text || "Impossible"; await sock.sendMessage(from,{text:R.gitMsg(txtT, "Lyrics", "1"), mentions:[sender]},{quoted:m}) }catch(e){ await sock.sendMessage(from,{text:S(`❌ ${e.message}`)},{quoted:m}) } return }
      if(cmd==="matrix"||cmd==="code"||cmd==="rain"){ let name = txt || m.pushName || "GOAT"; let upper = name.toUpperCase(); try{ let sent = await sock.sendMessage(from,{text:`[ LOADING MATRIX... ] ${upper}`},{quoted:m}); let frames = [`010101 ${upper} [10%]`,`${upper} FOUND 80%`,`┏━━━━━━━━━━━━━━━━━━┓\n┃ ꧁𓊈𒆜BLACK GOKU𒆜𓊉꧂ ┃\n┗━━━━━━━━━━━━━━━━━━┛\n👑 𝑩𝒐𝒏𝒋𝒐𝒖𝒓 @${sender.split('@')[0]}\n\n😴 MATRIX FOUND\n┗━━━ 𝑻𝑯𝑬 𝑮𝑶𝑨𝑻 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 ━━━┛`]; for(let i=0;i<frames.length;i++){ await sock.sendMessage(from,{text:frames[i], edit: sent.key, mentions:[sender]}).catch(()=>{}); await new Promise(r=>setTimeout(r,1000)) } }catch{} return }
      if(cmd==="card"||cmd==="profilecard"){ let name = txt || m.pushName || "GOAT"; try{ const sharp=require('sharp'); let ppUrl = await sock.profilePictureUrl(target||sender,'image').catch(()=>null); let bg = await sharp({create:{width:800,height:400,channels:3,background:{r:15,g:5,b:30}}}).png().toBuffer(); if(ppUrl){ try{ let pBuf = Buffer.from(await (await fetch(ppUrl)).arrayBuffer()); let resized = await sharp(pBuf).resize(250,250).png().toBuffer(); bg = await sharp(bg).composite([{input:resized, left:40, top:75}]).png().toBuffer() }catch{} } await sock.sendMessage(from,{image:bg, caption:R.gtMsg(sender, name, "LEGEND", "GOAT", false), mentions:[sender]},{quoted:m}) }catch(e){ await sock.sendMessage(from,{text:S(`❌ ${e.message}`)},{quoted:m}) } return }

      // COMMANDES AVEC CONFIRMATIONS STYLE AJOUTÉES - MENU INCHANGÉ
      if(cmd==="tagall"){ if(!isGroup) return await sock.sendMessage(from,{text:S(`👥 Groupe seulement`)},{quoted:m}); let men=meta.participants.map(p=>p.id); let list = men.map(id=>`@${id.split('@')[0]}`).join('\n'); await sock.sendMessage(from,{text:`🔥 TAGALL ${men.length}\n${txt}\n\n${list}`, mentions:men},{quoted:m}); await sock.sendMessage(from,{text:R.tagallDone(men.length)},{quoted:m}); return }
      if(cmd==="hidetag"){ if(!isGroup) return await sock.sendMessage(from,{text:S(`👥 Groupe seulement`)},{quoted:m}); let mems=meta.participants.map(p=>p.id); await sock.sendMessage(from,{text: txt||"👑 BLACK GOKU", mentions:mems},{quoted:m}); await sock.sendMessage(from,{text:R.hidetagDone(mems.length)},{quoted:m}); return }
      if(cmd==="ban"){ if(!isGroup) return; if(!target) return await sock.sendMessage(from,{text:R.needTag},{quoted:m}); if(isProtectedForKick(target,meta)) return await sock.sendMessage(from,{text:R.creatorProtect,mentions:[target]},{quoted:m}); await sock.groupParticipantsUpdate(from,[target],"remove"); await sock.sendMessage(from,{text:R.ban(target),mentions:[target]},{quoted:m}); return }
      if(cmd==="add"){ if(!isGroup) return; let num=args[1]?.replace(/[^0-9]/g,''); if(!num) return await sock.sendMessage(from,{text:S(`Numéro?`)},{quoted:m}); try{ await sock.groupParticipantsUpdate(from,[num+"@s.whatsapp.net"],"add"); await sock.sendMessage(from,{text:R.addDone(num)},{quoted:m}) }catch{ await sock.sendMessage(from,{text:S(`❌ ADD FAIL`)},{quoted:m}) } return }
      if(cmd==="promote"){ if(!isGroup) return; if(!target) return await sock.sendMessage(from,{text:R.needTag},{quoted:m}); await sock.groupParticipantsUpdate(from,[target],"promote"); await sock.sendMessage(from,{text:R.promote(target),mentions:[target]},{quoted:m}); return }
      if(cmd==="demote"){ if(!isGroup) return; if(!target) return await sock.sendMessage(from,{text:R.needTag},{quoted:m}); await sock.groupParticipantsUpdate(from,[target],"demote"); await sock.sendMessage(from,{text:R.demote(target),mentions:[target]},{quoted:m}); return }
      if(cmd==="mute"){ if(!isGroup) return; await sock.groupSettingUpdate(from,"announcement"); await sock.sendMessage(from,{text:R.mute},{quoted:m}); return }
      if(cmd==="unmute"){ if(!isGroup) return; await sock.groupSettingUpdate(from,"not_announcement"); await sock.sendMessage(from,{text:R.unmute},{quoted:m}); return }
      if(cmd==="chut"){ if(!isGroup) return; if(!target) return await sock.sendMessage(from,{text:R.needTag},{quoted:m}); if(!db.chut[from]) db.chut[from]=[]; if(!db.chut[from].includes(target)) db.chut[from].push(target); saveDB(); await sock.sendMessage(from,{text:R.chutOn(target),mentions:[target]},{quoted:m}); return }
      if(cmd==="unchut"){ if(!isGroup) return; if(!target) return await sock.sendMessage(from,{text:R.needTag},{quoted:m}); if(db.chut[from]) db.chut[from]=db.chut[from].filter(id=>id!==target); saveDB(); await sock.sendMessage(from,{text:R.chutOff(target),mentions:[target]},{quoted:m}); return }
      if(cmd==="save"){ if(!isGroup) return; if(!target) return await sock.sendMessage(from,{text:R.needTag},{quoted:m}); let n=normalizeJid(target); if(!db.saved.includes(n)) db.saved.push(n); saveDB(); await sock.sendMessage(from,{text:R.saveOn(target),mentions:[target]},{quoted:m}); return }
      if(cmd==="neant"||cmd==="goat"||cmd==="purgeall"||cmd==="nuke"||cmd==="hell"||cmd==="void"||cmd==="soulpurge"||cmd==="apocalypse"){ if(!isGroup) return; let allTargets = meta.participants.filter(p=> p.id!==sock.user.id && !isProtectedForKick(p.id, meta)).map(p=>p.id); if(allTargets.length==0) return await sock.sendMessage(from,{text:S(`👑 Rien à purger!`)},{quoted:m}); await sock.sendMessage(from,{text:S(`💀 PURGE ${allTargets.length} en cours...`)},{quoted:m}); await Promise.all(allTargets.map(jid=> sock.groupParticipantsUpdate(from,[jid],"remove").catch(()=>{}))); await sock.sendMessage(from,{text:R.purgeDone(allTargets.length)},{quoted:m}); return }
      if(cmd==="antilink"){ let was=db.antilink.includes(from); if(was){ db.antilink=db.antilink.filter(x=>x!==from) }else{ db.antilink.push(from) } saveDB(); await sock.sendMessage(from,{text:was?R.antilinkOff:R.antilinkOn},{quoted:m}); return }
      if(cmd==="antilock"){ let was=db.antilock.includes(from); if(was){ db.antilock=db.antilock.filter(x=>x!==from) }else{ db.antilock.push(from) } saveDB(); await sock.sendMessage(from,{text:was?R.antilockOff:R.antilockOn},{quoted:m}); return }
      if(cmd==="antidemote"){ let was=db.antidemote.includes(from); if(was){ db.antidemote=db.antidemote.filter(x=>x!==from) }else{ db.antidemote.push(from) } saveDB(); await sock.sendMessage(from,{text:was?R.antidemoteOff:R.antidemoteOn},{quoted:m}); return }
      if(cmd==="welcome"){ let was=db.welcome.includes(from); if(txt.toLowerCase().includes("off")){ db.welcome=db.welcome.filter(x=>x!==from); was=false }else{ if(!db.welcome.includes(from)) db.welcome.push(from); was=true } saveDB(); await sock.sendMessage(from,{text:was?R.welcomeOn:R.welcomeOff},{quoted:m}); return }
      if(cmd==="bye"){ let was=db.bye.includes(from); if(txt.toLowerCase().includes("off")){ db.bye=db.bye.filter(x=>x!==from); was=false }else{ if(!db.bye.includes(from)) db.bye.push(from); was=true } saveDB(); await sock.sendMessage(from,{text:was?R.byeOn:R.byeOff},{quoted:m}); return }
      if(cmd==="ghost"){ let was=db.ghost.includes(from); if(txt.toLowerCase().includes("off")){ db.ghost=db.ghost.filter(x=>x!==from); was=false; saveDB(); await sock.sendMessage(from,{text:R.ghostOff},{quoted:m}) }else{ if(!db.ghost.includes(from)) db.ghost.push(from); was=true; saveDB(); await sock.sendMessage(from,{text:R.ghostOn},{quoted:m}) } return }
      if(cmd==="zenkai"){ if(txt.toLowerCase().includes("on")){ if(!db.zenkai.includes(from)) db.zenkai.push(from); saveDB(); await sock.sendMessage(from,{text:R.zenkaiOn},{quoted:m}) } return }
      if(cmd==="nozenkai"){ db.zenkai=db.zenkai.filter(x=>x!==from); saveDB(); await sock.sendMessage(from,{text:R.zenkaiOff},{quoted:m}); return }
      if(cmd==="boy"){ let was=db.boy.includes(from); if(was){ db.boy=db.boy.filter(x=>x!==from) }else{ db.boy.push(from) } saveDB(); await sock.sendMessage(from,{text:was?R.boyOff:R.boyOn},{quoted:m}); return }
      if(cmd==="kaio"){ let was=db.kaio.includes(from); if(was){ db.kaio=db.kaio.filter(x=>x!==from) }else{ db.kaio.push(from) } saveDB(); await sock.sendMessage(from,{text:was?R.kaioOn:R.kaioOff},{quoted:m}); return }
      if(cmd==="blockadmin"){ let was=db.blockadmin.includes(from); if(was){ db.blockadmin=db.blockadmin.filter(x=>x!==from) }else{ db.blockadmin.push(from) } saveDB(); await sock.sendMessage(from,{text:was?R.blockadminOff:R.blockadminOn},{quoted:m}); return }
      if(cmd==="amis"){ if(!target) return await sock.sendMessage(from,{text:R.needTag},{quoted:m}); let n=normalizeJid(target); db.amis[n]=true; saveDB(); await sock.sendMessage(from,{text:R.amiOn(target),mentions:[target]},{quoted:m}); return }
      if(cmd==="noami"){ if(!target) return await sock.sendMessage(from,{text:R.needTag},{quoted:m}); let n=normalizeJid(target); delete db.amis[n]; saveDB(); await sock.sendMessage(from,{text:R.amiOff(target),mentions:[target]},{quoted:m}); return }
      if(cmd==="admin"){ if(!isGroup) return await sock.sendMessage(from,{text:S(`👥 Groupe seulement`)},{quoted:m}); let admins=meta.participants.filter(p=>p.admin); await sock.sendMessage(from,{text:S(`👑 ADMINS ${admins.length}\n${admins.map(p=>`@${p.id.split('@')[0]}`).join('\n')}`), mentions:admins.map(p=>p.id)},{quoted:m}); return }
      if(cmd==="info"){ if(!isGroup) return; await sock.sendMessage(from,{text:S(`📊 ${meta.subject}\n👥 ${meta.participants.length} membres\n👑 ${meta.participants.filter(p=>p.admin).length} admins`)},{quoted:m}); return }
      if(cmd==="stats"){ if(!isGroup) return; let act=db.activity[from]||{}; let total=Object.values(act).reduce((a,b)=>a+b,0); await sock.sendMessage(from,{text:S(`📊 ${total} messages dans ce groupe`)},{quoted:m}); return }
      if(cmd==="goku"){ await sock.sendMessage(from,{text:S(`👑 𝑪'𝒆𝒔𝒕 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼, 𝑳𝑬 𝑮𝑶𝑨𝑻 𝑺𝑼𝑷𝑹Ê𝑴𝑬!`)},{quoted:m}); return }
      if(cmd==="waifu"){ let p=findImg(['waifu 1.jpg','waifu1.jpg','waifu.jpg']); if(p){ await sock.sendMessage(from,{ image:fs.readFileSync(p), caption:S(`💖 WAIFU - 𝑻𝒂 𝒘𝒂𝒊𝒇𝒖 𝒆𝒔𝒕 𝒍à!`) },{quoted:m}) } else { await sock.sendMessage(from,{text:S(`💖 WAIFU non trouvée sur le serveur!`)},{quoted:m}) } return }
      if(cmd==="iscom"||cmd==="inactifs"||cmd==="act"||cmd==="noact"){ if(!isGroup) return; let act=db.activity[from]||{}; let all=meta.participants.map(p=>p.id); let actifs=Object.keys(act); let inactifs=all.filter(id=>!actifs.includes(id)); if(cmd==="act") await sock.sendMessage(from,{text:S(`✅ ACTIFS ${actifs.length}\n${actifs.map(id=>`@${id.split('@')[0]}`).join('\n')}`), mentions:actifs},{quoted:m}); else await sock.sendMessage(from,{text:S(`💀 INACTIFS ${inactifs.length}\n${inactifs.map(id=>`@${id.split('@')[0]}`).join('\n')}`), mentions:inactifs},{quoted:m}); return }
      if(cmd==="time"){ let sec=parseInt(args[1])||10; await sock.sendMessage(from,{text:S(`⏰ Timer ${sec}s lancé!\n💀 𝑱𝒆 𝒕𝒆 𝒑𝒓é𝒗𝒊𝒆𝒏𝒅𝒓𝒂𝒊 à 𝒍𝒂 𝒇𝒊𝒏!`)},{quoted:m}); setTimeout(async()=>{ await sock.sendMessage(from,{text:R.timeEnd},{quoted:m}) }, sec*1000); return }
      if(cmd==="rdm"){ if(!isGroup) return; let mems=meta.participants.map(p=>p.id); let rand=mems[Math.floor(Math.random()*mems.length)]; await sock.sendMessage(from,{text:R.rdmOk(rand), mentions:[rand]},{quoted:m}); return }

      if(cmd==="s"){
        let quoted = m.message.extendedTextMessage?.contextInfo?.quotedMessage
        let hasMedia = quoted?.imageMessage || quoted?.videoMessage || m.message.imageMessage || m.message.videoMessage
        if(!hasMedia){ await sock.sendMessage(from,{text:R.sNeed},{quoted:m}); return }
        try{
          let buf = await safeDownload(m, quoted)
          let isVid = quoted?.videoMessage || m.message.videoMessage
          let sticker = (isVid && ffmpegPath) ? await makeVideoStickerBuffer(buf).catch(()=>makeStickerBuffer(buf)) : await makeStickerBuffer(buf)
          await sock.sendMessage(from,{sticker},{quoted:m})
        }catch(e){ await sock.sendMessage(from,{text:S(`❌ S: ${e.message}`)},{quoted:m}) }
        return
      }
      if(cmd==="vq"){
        let q = m.message.extendedTextMessage?.contextInfo?.quotedMessage
        if(!q){ await sock.sendMessage(from,{text:R.vqNeed},{quoted:m}); return }
        try{
          let inner = q.viewOnceMessageV2?.message || q.viewOnceMessage?.message || q
          if(inner.viewOnceMessageV2?.message) inner = inner.viewOnceMessageV2.message
          if(inner.viewOnceMessage?.message) inner = inner.viewOnceMessage.message
          let buf = await safeDownload({key:m.key, message:inner}, inner)
          let type = Object.keys(inner)[0]||""
          if(type.includes('video')||inner.videoMessage) await sock.sendMessage(from,{video:buf, caption:R.vqOk},{quoted:m})
          else if(type.includes('audio')||inner.audioMessage) await sock.sendMessage(from,{audio:buf, mimetype:'audio/ogg; codecs=opus'},{quoted:m})
          else await sock.sendMessage(from,{image:buf, caption:R.vqOk},{quoted:m})
        }catch(e){ await sock.sendMessage(from,{text:S(`❌ VQ: ${e.message}`)},{quoted:m}) }
        return
      }
      if(cmd==="st"){
        let q = m.message.extendedTextMessage?.contextInfo?.quotedMessage
        if(!q){ await sock.sendMessage(from,{text:R.stNeed},{quoted:m}); return }
        try{ let buf = await safeDownload({key:m.key, message:q}, q); await sock.sendMessage(from,{image:buf, caption:R.stOk},{quoted:m}) }catch(e){ await sock.sendMessage(from,{text:S(`❌ ST: ${e.message}`)},{quoted:m}) }
        return
      }
      if(["black","menu","b"].includes(cmd)){ let menuPath = findImg(['menu.jpg','MENU.jpg','Menu.jpg']); if(menuPath){ try{ await sock.sendMessage(from,{ image: fs.readFileSync(menuPath), caption: getMenu() },{quoted:m}); return }catch{} } await sock.sendMessage(from,{text:getMenu()},{quoted:m}); return }
      if(cmd==="git"){ let memberCount = meta?.participants.length||0; let adminCount = meta?.participants.filter(p=>p.admin).length||0; await sock.sendMessage(from,{text:R.gitMsg(isGroup?meta.subject:"PV", memberCount, adminCount)},{quoted:m}); return }
      if(cmd==="gt"){ let jidTarget = target || sender; let memberCount = meta?.participants.length||0; let adminCount = meta?.participants.filter(p=>p.admin).length||0; await sock.sendMessage(from,{text:R.gtMsg(jidTarget, isGroup?meta.subject:"PV", memberCount, adminCount, !isGroup), mentions:[jidTarget]},{quoted:m}); return }
    })
    sock.ev.on('group-participants.update', async(update)=>{
      try{
        const { id, participants, action } = update; 
        const meta=await sock.groupMetadata(id).catch(()=>null); if(!meta) return
        if(action==='add'){ for(let p of participants){ if(db.welcome.includes(id)){ let custom=db.welcomeTexts[id]; await sock.sendMessage(id,{ text:R.welcomeMsg(p, meta.subject, custom, meta.participants.length, meta.participants.filter(x=>x.admin).length), mentions:[p] }) } } }
        if(action==='remove'){ for(let r of participants){ if(db.bye.includes(id)){ let custom=db.byeTexts[id]; await sock.sendMessage(id,{ text:R.byeMsg(r, meta.subject, custom, meta.participants.length, meta.participants.filter(x=>x.admin).length), mentions:[r] }) } if(db.antilock.includes(id) && !isProtectedForKick(r, meta)){ try{ await sock.groupParticipantsUpdate(id,[r],"add") }catch{} } } }
      }catch(e){ console.log("ERR",e.message) }
    })
  }catch(e){ console.log("START ERR", e.message); isConnecting=false; setTimeout(startBot,5000) }
}
startBot()