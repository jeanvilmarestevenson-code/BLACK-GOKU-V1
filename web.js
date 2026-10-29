const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, downloadMediaMessage } = require('@whiskeysockets/baileys')
const P = require('pino')
const fs = require('fs')
const express = require('express')
const NodeCache = require('node-cache')
const axios = require('axios')
const app = express()
const PORT = process.env.PORT || 3000

const OWNER_NUMBER = "555182215198"
const PREFIX = "₩"
const DB_FILE = './black_db.json'
const msgRetryCounterCache = new NodeCache()

let db = { amis:{}, saved:[], pro:[], protec:[], chut:{}, blockadmin:[], godmode:[], kaio:[], antilink:[], antisticker:[], antistatus:[], welcome:[], pt:[], ghost:[], muted:[], ghostCache:{}, antibod:{}, curse:{}, antilock:[], antidemote:[], clans:{}, autoreply:{}, autoreplyOn:[], autoreplyAll:[], zenkai:[], zenkaiUsers:{}, boy:[], privateMode:false, botOff:false }
if(fs.existsSync(DB_FILE)){ try{ let o=JSON.parse(fs.readFileSync(DB_FILE)); db={...db,...o, clans:o.clans||{}, autoreply:o.autoreply||{}, autoreplyOn:o.autoreplyOn||[], autoreplyAll:o.autoreplyAll||[], zenkai:o.zenkai||[], zenkaiUsers:o.zenkaiUsers||{}, ghostCache:o.ghostCache||{}, antibod:o.antibod||{}, curse:o.curse||{}, antilock:o.antilock||[], antidemote:o.antidemote||[], boy:o.boy||[], privateMode:o.privateMode||false, botOff:o.botOff||false } }catch{} }
const saveDB = ()=>fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2))

let sock, status="Demarrage...", lastCode="pas encore", latestQR=null
let messageStore = {}

const getMenu = () => `꧁༒☬ 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 ☬༒꧂
┏━ ✦ 𝑴𝑬𝑴𝑩𝑹𝑬𝑺 ✦ ━┓
┃ ₩𝒕𝒂𝒈𝒂𝒍𝒍
┃ ₩𝒉𝒊𝒅𝒆𝒕𝒂𝒈
┃ ₩𝒌𝒊𝒄𝒌
┃ ₩𝒃𝒂𝒏
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
┃ ₩𝒊𝒔𝒄𝒐𝒎
┃ ₩𝒕𝒊𝒎𝒆
┃ ₩𝒕𝒊𝒎
┃ ₩𝒓𝒅𝒎
┃ ₩𝒈𝒕
┗━━━━━━━━━━━━━━┛
┏━ ✦ 𝑷𝑼𝑵𝑰𝑻𝑰𝑶𝑵𝑺 ✦ ━┓
┃ ₩𝒄𝒉𝒖𝒕
┃ ₩𝒖𝒏𝒄𝒉𝒖𝒕
┃ ₩𝒃𝒍𝒐𝒄𝒌𝒂𝒅𝒎𝒊𝒏
┃ ₩𝒖𝒏𝒃𝒍𝒐𝒄𝒌𝒂𝒅𝒎𝒊𝒏
┃ ₩𝒓𝒆𝒊𝒏𝒊
┃ ₩𝒄𝒖𝒓𝒔𝒆
┃ ₩𝒖𝒏𝒄𝒖𝒓𝒔𝒆
┃ ₩𝒏𝒆𝒂𝒏𝒕
┃ ₩𝒈𝒐𝒂𝒕
┗━━━━━━━━━━━━━━┛
┏━ ✦ 𝑪𝑳𝑨𝑵 ✦ ━┓
┃ ₩𝒄𝒓é𝒆 𝒄𝒍𝒂𝒏
┃ ₩𝒂𝒋𝒐𝒖𝒕𝒆𝒓
┃ ₩𝒓𝒆𝒕𝒊𝒓𝒆𝒓
┃ ₩𝒄𝒍𝒂𝒏 𝒍𝒊𝒔𝒕
┃ ₩𝒄𝒍𝒂𝒏 𝒊𝒏𝒇𝒐
┃ ₩𝒔𝒖𝒑𝒑𝒓𝒊𝒎𝒆𝒓 𝒄𝒍𝒂𝒏
┗━━━━━━━━━━━━━━┛
┏━ ✦ 𝑷𝑹𝑶𝑻𝑬𝑪𝑻𝑰𝑶𝑵 ✦ ━┓
┃ ₩𝒔𝒂𝒗𝒆
┃ ₩𝒖𝒏𝒔𝒂𝒗𝒆
┃ ₩𝒑𝒓𝒐𝒕𝒆𝒄
┃ ₩𝒖𝒏𝒑𝒓𝒐𝒕𝒆𝒄𝒕
┃ ₩𝒛𝒆𝒏𝒌𝒂𝒊 𝒐𝒏
┃ ₩𝒛𝒆𝒏𝒌𝒂𝒊 @𝒖𝒔𝒆𝒓
┃ ₩𝒏𝒐𝒛𝒆𝒏𝒌𝒂𝒊
┃ ₩𝒃𝒐𝒚
┃ ₩𝒂𝒏𝒕𝒊𝒍𝒊𝒏𝒌
┃ ₩𝒂𝒏𝒕𝒊𝒃𝒐𝒅
┃ ₩𝒂𝒏𝒕𝒊𝒍𝒐𝒄𝒌
┃ ₩𝒂𝒏𝒕𝒊𝒅𝒆𝒎𝒐𝒕𝒆
┃ ₩𝒂𝒏𝒕𝒊𝒔𝒕𝒊𝒄𝒌𝒆𝒓
┃ ₩𝒂𝒏𝒕𝒊𝒔𝒕𝒂𝒕𝒖𝒔
┃ ₩𝒘𝒆𝒍𝒄𝒐𝒎𝒆
┃ ₩𝒈𝒉𝒐𝒔𝒕 𝒐𝒏/𝒐𝒇𝒇/𝒗𝒐𝒊𝒓
┗━━━━━━━━━━━━━━┛
┏━ ✦ 𝑺𝑻𝑰𝑪𝑲𝑬𝑹 ✦ ━┓
┃ ₩𝒔
┃ ₩𝒗𝒒
┃ ₩𝒔𝒕
┗━━━━━━━━━━━━━━┛
┏━ ✦ 𝑨𝑼𝑻𝑶-𝑹𝑬𝑷𝑶𝑵𝑺𝑬 ✦ ━┓
┃ ₩𝒂𝒖𝒕𝒐𝒓𝒆𝒑𝒍𝒚 𝒂𝒅𝒅
┃ ₩𝒂𝒖𝒕𝒐𝒓𝒆𝒑𝒍𝒚 𝒍𝒊𝒔𝒕
┃ ₩𝒂𝒖𝒕𝒐𝒓𝒆𝒑𝒍𝒚 𝒅𝒆𝒍
┃ ₩𝒂𝒖𝒕𝒐𝒓𝒆𝒑𝒍𝒚 𝒐𝒏
┃ ₩𝒂𝒖𝒕𝒐𝒓𝒆𝒑𝒍𝒚 𝒐𝒏 𝒂𝒍𝒍
┃ ₩𝒂𝒖𝒕𝒐𝒓𝒆𝒑𝒍𝒚 𝒐𝒇𝒇
┗━━━━━━━━━━━━━━┛
┏━ ✦ 𝑰𝑨 ✦ ━┓
┃ ₩𝒂𝒊
┃ ₩𝒈𝒑𝒕
┗━━━━━━━━━━━━━━┛
┏━ ✦ 𝑶𝑾𝑵𝑬𝑹 ✦ ━┓
┃ ₩𝒂𝒎𝒊𝒔
┃ ₩𝒏𝒐𝒂𝒎𝒊
┃ ₩𝒈𝒓𝒐𝒖𝒑𝒆
┃ ₩𝒏𝒐
┃ ₩𝒃𝒐𝒕
┃ ₩𝒍𝒐𝒄𝒌
┃ ₩𝒖𝒏𝒍𝒐𝒄𝒌
┃ ₩𝒑𝒓𝒊𝒗𝒂𝒕𝒆 𝒐𝒏/𝒐𝒇𝒇
┗━━━━━━━━━━━━━━┛
*₩𝑻𝑯𝑬 𝑮𝑶𝑨𝑻 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼₩*`;

const R = { 
  noPerm:"😈 𝑻𝒖 𝒐𝒔𝒆𝒔 𝒊𝒏𝒗𝒐𝒒𝒖𝒆𝒓 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 𝒔𝒂𝒏𝒔 𝒎𝒂 𝒑𝒆𝒓𝒎𝒊𝒔𝒔𝒊𝒐𝒏? 𝑨𝒈𝒆𝒏𝒐𝒖𝒊𝒍𝒍𝒆-𝒕𝒐𝒊, 𝒎𝒐𝒓𝒕𝒆𝒍. 𝑺𝒆𝒖𝒍𝒔 𝒎𝒆𝒔 𝑨𝑴𝑰𝑺 𝒑𝒆𝒖𝒗𝒆𝒏𝒕 𝒖𝒕𝒊𝒍𝒊𝒔𝒆𝒓 𝒎𝒐𝒏 𝒑𝒐𝒖𝒗𝒐𝒊𝒓. 𝑻𝒖 𝒏'𝒆𝒔 𝒒𝒖𝒆 𝒑𝒐𝒖𝒔𝒔𝒊è𝒓𝒆 𝒅𝒆𝒗𝒂𝒏𝒕 𝒖𝒏 𝑫𝒊𝒆𝒖.",
  needTag:"😈 𝑻𝑨𝑮 𝑼𝑵 𝑴𝑶𝑹𝑻𝑬𝑳, 𝑰𝑫𝑰𝑶𝑻! @𝒎", 
  creatorProtect:"👑🔥 𝑰𝑴𝑷𝑶𝑺𝑺𝑰𝑩𝑳𝑬 𝑫𝑬 𝑻𝑶𝑼𝑪𝑯𝑬𝑹 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼. 𝑻𝑼 𝑽𝑨𝑺 𝑴𝑶𝑼𝑹𝑰𝑹!", 
  ban:(j)=>`💀 𝑯𝑨𝑲𝑨𝑰! @${j.split('@')[0]} 𝒆𝒇𝒇𝒂𝒄é 𝒅𝒆 𝒍'𝒆𝒙𝒊𝒔𝒕𝒆𝒏𝒄𝒆 𝒑𝒂𝒓 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼.`, 
  promote:(j)=>`👑 @${j.split('@')[0]} é𝒍𝒆𝒗é 𝒂𝒖 𝒓𝒂𝒏𝒈 𝒅𝒆 𝑫𝒊𝒆𝒖 𝒑𝒂𝒓 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼.`, 
  demote:(j)=>`💔 @${j.split('@')[0]} 𝒅é𝒄𝒉𝒖. 𝑻𝒖 𝒓𝒆𝒅𝒆𝒗𝒊𝒆𝒏𝒔 𝒖𝒏 𝒊𝒏𝒔𝒆𝒄𝒕𝒆.`, 
  mute:"🤫 𝑺𝑰𝑳𝑬𝑵𝑪𝑬 𝑨𝑩𝑺𝑶𝑳𝑼! 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 𝒐𝒓𝒅𝒐𝒏𝒏𝒆 𝒍𝒆 𝒔𝒊𝒍𝒆𝒏𝒄𝒆!", 
  unmute:"🔊 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 𝒗𝒐𝒖𝒔 𝒂𝒖𝒕𝒐𝒓𝒊𝒔𝒆 à 𝒓𝒂𝒎𝒑𝒆𝒓.", 
  chut:(j)=>`🔇 @${j.split('@')[0]} 𝒄𝒐𝒏𝒅𝒂𝒎𝒏é 𝒂𝒖 𝑵é𝒂𝒏𝒕.`, 
  unchut:(j)=>`🔓 @${j.split('@')[0]} 𝒔𝒆𝒄𝒐𝒏𝒅𝒆 𝒄𝒉𝒂𝒏𝒄𝒆.`, 
  blockadminOn:"⛓️ 𝑩𝑳𝑶𝑪𝑲𝑨𝑫𝑴𝑰𝑵 𝑶𝑵! 𝑷𝑶𝑼𝑽𝑶𝑰𝑹𝑺 𝑺𝑪𝑬𝑳𝑳É𝑺!", 
  blockadminOff:"🔓 𝑶𝑭𝑭", 
  curseOn:(j)=>`☬ @${j.split('@')[0]} 𝒎𝒂𝒖𝒅𝒊𝒕 𝒑𝒂𝒓 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼!`, 
  curseOff:(j)=>`𝑳𝒆𝒗é𝒆 @${j.split('@')[0]}`, 
  reiniOk:(j)=>`♻️ @${j.split('@')[0]} 𝒓é𝒊𝒏𝒊𝒕𝒊𝒂𝒍𝒊𝒔é 𝒑𝒂𝒓 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼!`, 
  neantStart:(c)=>`💀 ${c} 𝒎𝒔𝒈𝒔 𝒆𝒇𝒇𝒂𝒄é𝒔!`, 
  goatStart:(n)=>`🔥 ${n} 𝑭𝑨𝑰𝑩𝑳𝑬𝑺! 𝑯𝑨𝑲𝑨𝑰!`, 
  goatEnd:(n)=>`💀 ${n} 𝑬𝑭𝑭𝑨𝑪É𝑺 𝑷𝑨𝑹 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼!`, 
  save:(j)=>`🛡️ @${j.split('@')[0]} 𝒎𝒂𝒓𝒒𝒖é 𝒑𝒂𝒓 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼. 𝑰𝒏𝒕𝒐𝒖𝒄𝒉𝒂𝒃𝒍𝒆.`, 
  unsave:(j)=>`🛡️ 𝑴𝒂𝒓𝒒𝒖𝒆 𝒓𝒆𝒕𝒊𝒓é𝒆 @${j.split('@')[0]}.`, 
  protec:(j)=>`👑🔥 𝑷𝑹𝑶𝑻𝑬𝑪 𝑨𝑩𝑺𝑶𝑳𝑼𝑬 @${j.split('@')[0]}! 𝑰𝒏𝒕𝒐𝒖𝒄𝒉𝒂𝒃𝒍𝒆!`, 
  unprotec:(j)=>`💀 𝑷𝑹𝑶𝑻𝑬𝑪 𝒓𝒆𝒕𝒊𝒓é𝒆 @${j.split('@')[0]}.`, 
  zenkai:(j)=>`⚡ @${j.split('@')[0]} 𝒁𝑬𝑵𝑲𝑨𝑰.`, 
  nozenkai:(j)=>`𝒁𝑬𝑵𝑲𝑨𝑰 𝒓𝒆𝒕𝒊𝒓é.`, 
  zenkaiOn:"⚡ 𝒁𝑬𝑵𝑲𝑨𝑰 𝑶𝑵", 
  zenkaiOff:"𝒁𝑬𝑵𝑲𝑨𝑰 𝑶𝑭𝑭", 
  antilink:"🔗 𝑨𝑵𝑻𝑰𝑳𝑰𝑵𝑲 𝑶𝑵", 
  antilinkoff:"𝑶𝑭𝑭", 
  antibodOn:(m)=>`𝑨𝑵𝑻𝑰𝑩𝑶𝑫 ${m} 𝑶𝑵`, 
  antibodOff:"𝑶𝑭𝑭", 
  antilock:"𝑨𝑵𝑻𝑰𝑳𝑶𝑪𝑲 𝑶𝑵", 
  antilockoff:"𝑶𝑭𝑭", 
  antidemote:"𝑨𝑵𝑻𝑰𝑫𝑬𝑴𝑶𝑻𝑬 𝑶𝑵", 
  antidemoteoff:"𝑶𝑭𝑭", 
  antisticker:"🖼️ 𝑨𝑵𝑻𝑰𝑺𝑻𝑰𝑪𝑲𝑬𝑹 𝑶𝑵", 
  antistickeroff:"𝑶𝑭𝑭", 
  antistatus:"👁️ 𝑨𝑵𝑻𝑰𝑺𝑻𝑨𝑻𝑼𝑺 𝑶𝑵", 
  antistatusoff:"𝑶𝑭𝑭", 
  welcome:"👋 𝑾𝑬𝑳𝑪𝑶𝑴𝑬 𝑶𝑵", 
  welcomeoff:"𝑶𝑭𝑭", 
  ghost:"👻 𝑮𝑯𝑶𝑺𝑻 𝑶𝑵", 
  ghostoff:"𝑶𝑭𝑭", 
  boyOn:"💀 𝑩𝑶𝒀 𝑶𝑵", 
  boyOff:"𝑶𝑭𝑭", 
  amis:(j)=>`✅✅✅ 𝑨𝑴𝑰𝑻𝑰É 𝑫𝑰𝑽𝑰𝑵𝑬! @${j.split('@')[0]} 𝑨𝑴𝑰 𝑫𝑬 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼!`, 
  noami:(j)=>`❌💀 @${j.split('@')[0]} 𝑩𝑨𝑵𝑵𝑰 𝑨𝑴𝑰!`, 
  botOffMsg:"💤 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 𝑺'𝑬𝑵𝑫𝑶𝑹𝑻...", 
  botOnMsg:"🤖🔥 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 𝑺𝑬 𝑹É𝑽𝑬𝑰𝑳𝑳𝑬!", 
  privateOn:"🔒 𝑷𝑹𝑰𝑽É 𝑶𝑵", 
  privateOff:"𝑶𝑭𝑭", 
  gokuMsg:"👑 𝑪'𝒆𝒔𝒕 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼, 𝒗𝒐𝒕𝒓𝒆 𝑫𝒊𝒆𝒖.", 
  kaioMsg:"🔥 𝑪'𝒆𝒔𝒕 𝑲𝑨𝑰𝑶.", 
  vqOk:"👁️🔥 𝑽𝑼𝑬 𝑫É𝑽𝑶𝑰𝑳É𝑬!", 
  vqNeed:"😈 𝑹é𝒑𝒐𝒏𝒅𝒔 à 𝒖𝒏𝒆 𝒗𝒖𝒆 𝒖𝒏𝒊𝒒𝒖𝒆 𝒂𝒗𝒆𝒄 ₩𝒗𝒒!", 
  sNeed:"😈 𝑹é𝒑𝒐𝒏𝒅𝒔 𝒊𝒎𝒂𝒈𝒆 𝒂𝒗𝒆𝒄 ₩𝒔", 
  stNeed:"😈 𝑹é𝒑𝒐𝒏𝒅𝒔 𝒔𝒕𝒂𝒕𝒖𝒕 𝒂𝒗𝒆𝒄 ₩𝒔𝒕", 
  stOk:"👁️ 𝑺𝒕𝒂𝒕𝒖𝒕 𝒗𝒐𝒍é", 
  rdmOk:(j)=>`🎲 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 𝒂 𝒑𝒂𝒓𝒍é! @${j.split('@')[0]}!`, 
  timeEnd:"⏰ 𝑻𝑰𝑴𝑬 𝑭𝑰𝑵𝑰!", 
  timEnd:"⏰ 𝑻𝑰𝑴 𝑭𝑰𝑵𝑰!",
  onlyOwner: "👑🔥 𝑺𝑬𝑼𝑳 𝑳𝑬 𝑫𝑰𝑬𝑼 𝑺𝑼𝑷𝑹Ê𝑴𝑬 𝑷𝑬𝑼𝑻 𝑭𝑨𝑰𝑹𝑬 Ç𝑨!",
  protecTriggered:(prot, att)=>`☯️🔥 𝑷𝑹𝑶𝑻𝑬𝑪 𝑨𝑪𝑻𝑰𝑽É𝑬! @${att.split('@')[0]} 𝒂 𝒐𝒔é 𝒃𝒂𝒏𝒏𝒊𝒓 @${prot.split('@')[0]}!`,
  protecDemote:(prot, att)=>`☯️🔥 𝑨𝑵𝑻𝑰-𝑫𝑬𝑴𝑶𝑻𝑬! @${att.split('@')[0]} 𝒂 𝒐𝒔é 𝒅𝒆𝒎𝒐𝒕𝒆 @${prot.split('@')[0]}!`,
  protecFail: "⚠️ 𝑴𝑬𝑻𝑻𝑬𝒁 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 𝑨𝑫𝑴𝑰𝑵!",
  godmode:"☯️ 𝑮𝑶𝑫𝑴𝑶𝑫𝑬 𝑶𝑵",
  godmodeoff:"𝑶𝑭𝑭",
  kaio:"🔥 𝑲𝑨𝑰𝑶 𝑶𝑵!",
  kaiooff:"𝑶𝑭𝑭",
  welcomeMsg:(j, g)=>`꧁༒☬ 𝑩𝑰𝑬𝑵𝑽𝑬𝑵𝑼𝑬 ☬༒꧂\n👑 @${j.split('@')[0]} 𝒅𝒂𝒏𝒔 *${g}*.\n*𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼* 💀🔥`,
}

function normalizeJid(jid){ if(!jid) return ""; return jid.split(':')[0].split('@')[0].replace(/[^0-9]/g,'') }
function isCreator(jid){ if(!jid) return false; let n=normalizeJid(jid); if(n===OWNER_NUMBER) return true; return false; }
function isProtectedForKick(jid){ return isCreator(jid) || db.saved.includes(jid) || db.protec.includes(jid) || db.pro.includes(jid) || db.saved.includes(normalizeJid(jid)) || db.protec.includes(normalizeJid(jid)); }
async function askHyper(q){ try{ let r=await axios.get(`https://text.pollinations.ai/${encodeURIComponent(q)}`,{timeout:20000}); let d=typeof r.data==='string'?r.data.trim():JSON.stringify(r.data); if(d && d.length>2) return d; }catch(e){} return "𝑰𝑨 𝒊𝒏𝒅𝒊𝒔𝒑𝒐𝒏𝒊𝒃𝒍𝒆 𝑮𝑶𝑨𝑻."; }
async function safeRemove(gid, jids){ let ok=0; for(let jid of jids){ try{ await sock.groupParticipantsUpdate(gid,[jid],"remove"); ok++; await new Promise(r=>setTimeout(r,1200)); }catch(e){} } return ok; }

app.get('/', (req,res)=> res.send(`<h1>${status}</h1><p>CODE: ${lastCode}</p><a href="/pair?num=${OWNER_NUMBER}">PAIR</a> | <a href="/qr">QR</a> | <a href="/clear">CLEAR</a>`))
app.get('/clear', (req,res)=>{ try{ if(fs.existsSync('auth2')) fs.rmSync('auth2',{recursive:true,force:true}); latestQR=null; messageStore={}; res.send('✅ CLEAR OK - AUTH + CACHE VIDE') }catch(e){ res.send(e.message) } })
app.get('/pair', async(req,res)=>{
  let num=(req.query.num||'').replace(/[^0-9]/g,'')||OWNER_NUMBER
  try{ let code=await sock.requestPairingCode(num); lastCode=code; res.send(`<h1 style="font-size:60px">${code}</h1>`) }catch(e){ res.send('Erreur: '+e.message) }
})
app.get('/qr', async(req,res)=>{
  if(!latestQR) return res.send('<h1>Pas de QR, utilise /pair</h1>');
  try{
    const QRCode = require('qrcode');
    const dataUrl = await QRCode.toDataURL(latestQR);
    res.send(`<html><body style="background:#000;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh"><h1 style="color:#fff">BLACK GOKU QR</h1><img src="${dataUrl}" style="width:300px;border:10px solid #fff" /><p style="color:#fff">Scanne en 30s - Sinon /clear</p></body></html>`);
  }catch(e){ res.send('Erreur QR: '+e.message) }
})

async function startBot(){
  const { version } = await fetchLatestBaileysVersion()
  const { state, saveCreds } = await useMultiFileAuthState('auth2')
  sock = makeWASocket({ 
    version, 
    auth:{creds:state.creds, keys:makeCacheableSignalKeyStore(state.keys, P({level:'silent'}))}, 
    logger:P({level:'silent'}), 
    browser:["Chrome","Ubuntu","22.04"], 
    msgRetryCounterCache, 
    markOnlineOnConnect:false, 
    syncFullHistory:false,
    fireInitQueries:false,
    shouldSyncHistoryMessage:()=>false,
    getMessage: async (key)=> messageStore[key.id] ? { conversation: messageStore[key.id].text } : undefined
  })
  sock.ev.on('creds.update', saveCreds)
  sock.ev.on('connection.update', async(u)=>{
    if(u.qr) latestQR = u.qr
    if(u.connection==='open'){ 
      status="BLACK GOKU ACTIF ✅ CHROME"; 
      latestQR=null; 
      messageStore={}; // FIX PENDING
      console.log("BLACK GOKU LIVE CHROME - LOG CLEAN");
    }
    if(u.connection==='close'){
      let reason = u.lastDisconnect?.error?.output?.statusCode
      if(reason === 401){ if(fs.existsSync('auth2')) fs.rmSync('auth2',{recursive:true,force:true}); }
      setTimeout(startBot,3000)
    }
  })

  sock.ev.on('messages.upsert', async({messages, type})=>{
    if(type!=='notify') return
    const m=messages[0]; if(!m?.message) return
    const from=m.key.remoteJid
    const sender = m.key.participant || from
    
    // ===== PARTIE 1: KAIO + GHOST CACHE (UN SEUL LISTENER) =====
    if(from.endsWith('@g.us')){
      let txtForCache = m.message.conversation || m.message.extendedTextMessage?.text || m.message.imageMessage?.caption || ""
      if(txtForCache){
        if(db.kaio.includes(from)){
          messageStore[m.key.id] = { text: txtForCache, sender: sender, from, id: m.key.id }
        }
        if(db.ghost.includes(from)){
          if(!db.ghostCache[from]) db.ghostCache[from]=[]
          db.ghostCache[from].push({sender:sender, text:txtForCache, time:Date.now()}); 
          if(db.ghostCache[from].length>500) db.ghostCache[from].shift(); 
          saveDB();
        }
        // AUTO-REPLY
        if(!txtForCache.startsWith(PREFIX)){
          let enabled = db.autoreplyAll.includes(from) || db.autoreplyOn.includes(from) || db.autoreplyAll.includes('all')
          if(enabled){
            let low=txtForCache.toLowerCase()
            for(let trig in db.autoreply){ if(low.includes(trig.toLowerCase())){ await sock.sendMessage(from,{text:db.autoreply[trig]},{quoted:m}); break; } }
          }
        }
      }
    }

    // ===== PARTIE 2: COMMANDES =====
    const senderNum = sender.replace(/[^0-9]/g,'')
    const isMe = m.key.fromMe
    const isOwner = isMe || senderNum.includes(OWNER_NUMBER) || db.amis[senderNum] || db.amis[sender]
    let text = m.message.conversation || m.message.extendedTextMessage?.text || m.message.imageMessage?.caption || m.message.videoMessage?.caption || ""
    if(!text.startsWith(PREFIX)) return
    if(!isOwner){ await sock.sendMessage(from, {text: R.noPerm}, {quoted:m}); return }
    if(db.botOff && !isCreator(sender) && !isMe){ return }
    const args=text.slice(1).trim().split(/ +/); const cmd=args[0].toLowerCase(); const txt=args.slice(1).join(' ')
    const mentioned=m.message.extendedTextMessage?.contextInfo?.mentionedJid||[]; let target=mentioned[0]
    const isGroup=from.endsWith('@g.us')
    const meta = isGroup? await sock.groupMetadata(from).catch(()=>null) : null

    if(["black","menu","b"].includes(cmd)){
      const menuText=getMenu()
      if(fs.existsSync('./menu.jpg')) await sock.sendMessage(from,{image:fs.readFileSync('./menu.jpg'), caption:menuText},{quoted:m})
      else await sock.sendMessage(from,{text:menuText},{quoted:m})
      return
    }
    if(cmd==="goku"){ await sock.sendMessage(from,{text:R.gokuMsg},{quoted:m}); return; }
    if(cmd==="kaio" && !text.toLowerCase().includes("off") && txt===""){ await sock.sendMessage(from,{text:R.kaioMsg},{quoted:m}); return; }

    if(isGroup && (cmd==="tagall")){
      if(!meta) return
      let mentions=meta.participants.map(p=>p.id)
      let tagText = `🔥 ${mentions.map((p,i)=>`${i+1}. @${p.split('@')[0]}`).join('\n')}\n\n${txt||""}`
      await sock.sendMessage(from,{text:tagText, mentions},{quoted:m})
      return
    }
    if(isGroup && (cmd==="hidetag")){
      if(!meta) return
      let mentions=meta.participants.map(p=>p.id)
      await sock.sendMessage(from,{text:txt||"👻", mentions},{quoted:m})
      return
    }
    if((cmd==="ban" || cmd==="kick")){
      if(!target) return await sock.sendMessage(from,{text:R.needTag},{quoted:m})
      if(isProtectedForKick(target)){ await sock.sendMessage(from,{text:R.creatorProtect, mentions:[target]},{quoted:m}); return }
      await sock.groupParticipantsUpdate(from,[target],"remove").catch(()=>{})
      await sock.sendMessage(from,{text:R.ban(target), mentions:[target]},{quoted:m})
      return
    }
    if(cmd==="kickall" || cmd==="goat"){
      if(!isGroup) return
      let all=meta?.participants.filter(p=> !isProtectedForKick(p.id) && normalizeJid(p.id)!==normalizeJid(sock.user?.id)).map(p=>p.id)||[]
      await sock.sendMessage(from,{text:R.goatStart(all.length)},{quoted:m})
      let ok=await safeRemove(from, all)
      await sock.sendMessage(from,{text:R.goatEnd(ok)},{quoted:m})
      return
    }
    if(cmd==="promote"){ if(!target) return; let isMin=txt.includes("min"); await sock.groupParticipantsUpdate(from,[target],"promote").catch(()=>{}); await sock.sendMessage(from,{text:isMin?`⏳ @${target.split('@')[0]} 𝒎𝒊𝒏 admin!`:R.promote(target), mentions:[target]},{quoted:m}); return }
    if(cmd==="demote"){ if(!target) return; if(isProtectedForKick(target)){ await sock.sendMessage(from,{text:R.creatorProtect},{quoted:m}); return } await sock.groupParticipantsUpdate(from,[target],"demote").catch(()=>{}); await sock.sendMessage(from,{text:R.demote(target), mentions:[target]},{quoted:m}); return }
    if(cmd==="mute"||cmd==="lock"||cmd==="no"){ await sock.groupSettingUpdate(from,"announcement").catch(()=>{}); await sock.sendMessage(from,{text:R.mute},{quoted:m}); return }
    if(cmd==="unmute"||cmd==="unlock"||cmd==="groupe"){ await sock.groupSettingUpdate(from,"not_announcement").catch(()=>{}); await sock.sendMessage(from,{text:R.unmute},{quoted:m}); return }
    if(cmd==="admin" && meta){ let admins=meta.participants.filter(p=>p.admin).map(p=>p.id); await sock.sendMessage(from,{text:`👑 𝑨𝒅𝒎𝒊𝒏𝒔: ${admins.map(a=>`@${a.split('@')[0]}`).join(', ')}`, mentions:admins},{quoted:m}); return }
    if(cmd==="info" && meta){ await sock.sendMessage(from,{text:`📌 ${meta.subject}\n👥 ${meta.participants.length}`},{quoted:m}); return }
    if(cmd==="stats" && meta){ await sock.sendMessage(from,{text:`📊 𝑪𝒍𝒂𝒏𝒔: ${Object.keys(db.clans).length} 𝑨𝒖𝒕𝒐: ${Object.keys(db.autoreply).length}`},{quoted:m}); return }
    if(["iscom","gt","rdm"].includes(cmd)){ let all=meta?.participants.filter(p=> !isProtectedForKick(p.id)).map(p=>p.id)||[]; let r=all[Math.floor(Math.random()*all.length)]; if(r) await sock.sendMessage(from,{text:R.rdmOk(r), mentions:[r]},{quoted:m}); return }
    if(["time","tim"].includes(cmd)){ let t=parseInt(txt)||10; await sock.sendMessage(from,{text:`⏳ 𝑻𝒊𝒎𝒆𝒓 ${t}s`},{quoted:m}); setTimeout(async()=>{ await sock.sendMessage(from,{text:cmd==="time"?R.timeEnd:R.timEnd},{quoted:m}); }, t*1000); return }
    if(cmd==="chut" && target){ db.chut[target]=true; saveDB(); await sock.sendMessage(from,{text:R.chut(target), mentions:[target]},{quoted:m}); return }
    if(cmd==="unchut" && target){ delete db.chut[target]; saveDB(); await sock.sendMessage(from,{text:R.unchut(target), mentions:[target]},{quoted:m}); return }
    if(cmd==="blockadmin"){ if(!target){ if(!db.blockadmin.includes(from)) db.blockadmin.push(from); saveDB(); await sock.sendMessage(from,{text:R.blockadminOn},{quoted:m}); } else { if(!db.blockadmin.includes(target)) db.blockadmin.push(target); saveDB(); await sock.sendMessage(from,{text:R.blockadminOn, mentions:[target]},{quoted:m}); } return }
    if(cmd==="unblockadmin"){ if(!target){ db.blockadmin=db.blockadmin.filter(x=>x!==from); saveDB(); await sock.sendMessage(from,{text:R.blockadminOff},{quoted:m}); } else { db.blockadmin=db.blockadmin.filter(x=>x!==target); saveDB(); await sock.sendMessage(from,{text:R.blockadminOff},{quoted:m}); } return }
    if(cmd==="curse" && target){ db.curse[target]=true; saveDB(); await sock.sendMessage(from,{text:R.curseOn(target), mentions:[target]},{quoted:m}); return }
    if(cmd==="uncurse" && target){ delete db.curse[target]; saveDB(); await sock.sendMessage(from,{text:R.curseOff(target), mentions:[target]},{quoted:m}); return }
    if(cmd==="reini" && target){ await sock.sendMessage(from,{text:R.reiniOk(target), mentions:[target]},{quoted:m}); return }
    if(cmd==="neant"){ let c=parseInt(txt)||10; await sock.sendMessage(from,{text:R.neantStart(c)},{quoted:m}); return }
    if(text.toLowerCase().startsWith(PREFIX+"crée clan") || text.toLowerCase().startsWith(PREFIX+"cree clan")){
      let clanName = text.split(/clan/i)[1]?.trim()
      if(!clanName){ await sock.sendMessage(from,{text:"👑 𝑼𝒔𝒂𝒈𝒆: ₩𝒄𝒓é𝒆 𝒄𝒍𝒂𝒏 <𝒏𝒐𝒎>"},{quoted:m}); return; }
      if(db.clans[clanName]){ await sock.sendMessage(from,{text:`💀 𝑪𝒍𝒂𝒏 ${clanName} 𝒆𝒙𝒊𝒔𝒕𝒆 𝒅é𝒋à!`},{quoted:m}); return; }
      db.clans[clanName]={owner:senderNum, members:[], created:Date.now()}; saveDB(); await sock.sendMessage(from,{text:`✅ 𝑪𝒍𝒂𝒏 ${clanName} 𝒄𝒓éé!`},{quoted:m}); return
    }
    if(cmd==="ajouter"){
      let clanName = txt.split(' ').pop()
      if(!target || !clanName){ await sock.sendMessage(from,{text:"👑 𝑼𝒔𝒂𝒈𝒆: ₩𝒂𝒋𝒐𝒖𝒕𝒆𝒓 @𝒖𝒔𝒆𝒓 <𝒄𝒍𝒂𝒏>"},{quoted:m}); return; }
      if(!db.clans[clanName]){ await sock.sendMessage(from,{text:`💀 𝑪𝒍𝒂𝒏 ${clanName} 𝒊𝒏𝒆𝒙𝒊𝒔𝒕𝒂𝒏𝒕`},{quoted:m}); return; }
      let nid=target.replace(/[^0-9]/g,''); if(!db.clans[clanName].members.includes(nid)) db.clans[clanName].members.push(nid); saveDB(); await sock.sendMessage(from,{text:`✅ @${target.split('@')[0]} 𝒂𝒋𝒐𝒖𝒕é à ${clanName}`,mentions:[target]},{quoted:m}); return
    }
    if(cmd==="retirer"){
      let clanName = txt.split(' ').pop()
      if(!target || !clanName){ await sock.sendMessage(from,{text:"👑 𝑼𝒔𝒂𝒈𝒆: ₩𝒓𝒆𝒕𝒊𝒓𝒆𝒓 @𝒖𝒔𝒆𝒓 <𝒄𝒍𝒂𝒏>"},{quoted:m}); return; }
      if(!db.clans[clanName]) return; let nid=target.replace(/[^0-9]/g,''); db.clans[clanName].members=db.clans[clanName].members.filter(x=>x!==nid); saveDB(); await sock.sendMessage(from,{text:`✅ @${target.split('@')[0]} 𝒓𝒆𝒕𝒊𝒓é 𝒅𝒆 ${clanName}`,mentions:[target]},{quoted:m}); return
    }
    if(text.toLowerCase().startsWith(PREFIX+"clan list") || (cmd==="clan" && txt.includes("list"))){ let list=Object.keys(db.clans); await sock.sendMessage(from,{text:list.length?`📜 𝑪𝒍𝒂𝒏𝒔: ${list.join(', ')}`:"📜 𝑨𝒖𝒄𝒖𝒏 𝒄𝒍𝒂𝒏"},{quoted:m}); return }
    if(text.toLowerCase().startsWith(PREFIX+"clan info")){ let clanName=text.split(/info/i)[1]?.trim(); let c=db.clans[clanName]; if(!c){ await sock.sendMessage(from,{text:"💀 𝑪𝒍𝒂𝒏 𝒊𝒏𝒆𝒙𝒊𝒔𝒕𝒂𝒏𝒕"},{quoted:m}); return; } await sock.sendMessage(from,{text:`📜 ${clanName} 𝑶𝒘𝒏𝒆𝒓: ${c.owner} 𝑴𝒆𝒎𝒃𝒓𝒆𝒔: ${c.members.length}`},{quoted:m}); return }
    if(text.toLowerCase().startsWith(PREFIX+"supprimer clan")){ let clanName=text.split(/clan/i)[1]?.trim(); if(db.clans[clanName]){ delete db.clans[clanName]; saveDB(); await sock.sendMessage(from,{text:`🗑️ 𝑪𝒍𝒂𝒏 ${clanName} 𝒔𝒖𝒑𝒑𝒓𝒊𝒎é`},{quoted:m}); } return }
    if(cmd==="save" && target){ if(!db.saved.includes(target)) db.saved.push(target); saveDB(); await sock.sendMessage(from,{text:R.save(target), mentions:[target]},{quoted:m}); return }
    if(cmd==="unsave" && target){ db.saved=db.saved.filter(x=>x!==target); saveDB(); await sock.sendMessage(from,{text:R.unsave(target), mentions:[target]},{quoted:m}); return }
    if(cmd==="pro" && target){ if(!db.pro.includes(target)) db.pro.push(target); if(!db.saved.includes(target)) db.saved.push(target); saveDB(); await sock.sendMessage(from,{text:`✨ @${target.split('@')[0]} 𝒃é𝒏𝒊 𝑷𝑹𝑶!`,mentions:[target]},{quoted:m}); return }
    if(cmd==="protec" && target){ if(!db.protec.includes(target)) db.protec.push(target); if(!db.pro.includes(target)) db.pro.push(target); saveDB(); await sock.sendMessage(from,{text:R.protec(target), mentions:[target]},{quoted:m}); return }
    if((cmd==="unprotect"||cmd==="unprotec") && target){ db.protec=db.protec.filter(x=>x!==target); db.pro=db.pro.filter(x=>x!==target); saveDB(); await sock.sendMessage(from,{text:R.unprotec(target), mentions:[target]},{quoted:m}); return }
    if(cmd==="zenkai"){
      if(txt.toLowerCase().includes("on")){ if(!db.zenkai.includes(from)) db.zenkai.push(from); saveDB(); await sock.sendMessage(from,{text:R.zenkaiOn},{quoted:m}); }
      else if(target){ db.zenkaiUsers[target.replace(/[^0-9]/g,'')]=from; saveDB(); await sock.sendMessage(from,{text:R.zenkai(target), mentions:[target]},{quoted:m}); }
      return
    }
    if(cmd==="nozenkai"){
      if(txt.toLowerCase().includes("off")||!target){ db.zenkai=db.zenkai.filter(x=>x!==from); saveDB(); await sock.sendMessage(from,{text:R.zenkaiOff},{quoted:m}); }
      else { delete db.zenkaiUsers[target.replace(/[^0-9]/g,'')]; saveDB(); await sock.sendMessage(from,{text:R.nozenkai(target), mentions:[target]},{quoted:m}); }
      return
    }
    if(cmd==="boy"){ if(txt.toLowerCase().includes("off")){ db.boy=db.boy.filter(x=>x!==from); } else { if(!db.boy.includes(from)) db.boy.push(from); } saveDB(); await sock.sendMessage(from,{text:db.boy.includes(from)?R.boyOn:R.boyOff},{quoted:m}); return }
    if(cmd==="antilink"){ if(txt.toLowerCase().includes("off")){ db.antilink=db.antilink.filter(x=>x!==from); } else { if(!db.antilink.includes(from)) db.antilink.push(from); } saveDB(); await sock.sendMessage(from,{text:db.antilink.includes(from)?R.antilink:R.antilinkoff},{quoted:m}); return }
    if(cmd==="antibod"){ if(txt.toLowerCase().includes("off")){ delete db.antibod[from]; } else { db.antibod[from]=txt||"on"; } saveDB(); await sock.sendMessage(from,{text:db.antibod[from]?R.antibodOn(db.antibod[from]):R.antibodOff},{quoted:m}); return }
    if(cmd==="antilock"){ if(txt.toLowerCase().includes("off")){ db.antilock=db.antilock.filter(x=>x!==from); } else { if(!db.antilock.includes(from)) db.antilock.push(from); } saveDB(); await sock.sendMessage(from,{text:db.antilock.includes(from)?R.antilock:R.antilockoff},{quoted:m}); return }
    if(cmd==="antidemote"){ if(txt.toLowerCase().includes("off")){ db.antidemote=db.antidemote.filter(x=>x!==from); } else { if(!db.antidemote.includes(from)) db.antidemote.push(from); } saveDB(); await sock.sendMessage(from,{text:db.antidemote.includes(from)?R.antidemote:R.antidemoteoff},{quoted:m}); return }
    if(cmd==="antisticker"){ if(txt.toLowerCase().includes("off")){ db.antisticker=db.antisticker.filter(x=>x!==from); } else { if(!db.antisticker.includes(from)) db.antisticker.push(from); } saveDB(); await sock.sendMessage(from,{text:db.antisticker.includes(from)?R.antisticker:R.antistickeroff},{quoted:m}); return }
    if(cmd==="antistatus"){ if(txt.toLowerCase().includes("off")){ db.antistatus=db.antistatus.filter(x=>x!==from); } else { if(!db.antistatus.includes(from)) db.antistatus.push(from); } saveDB(); await sock.sendMessage(from,{text:db.antistatus.includes(from)?R.antistatus:R.antistatusoff},{quoted:m}); return }
    if(cmd==="welcome"){ if(txt.toLowerCase().includes("off")){ db.welcome=db.welcome.filter(x=>x!==from); } else { if(!db.welcome.includes(from)) db.welcome.push(from); } saveDB(); await sock.sendMessage(from,{text:db.welcome.includes(from)?R.welcome:R.welcomeoff},{quoted:m}); return }
    if(cmd==="ghost"){
      if(txt.toLowerCase().includes("off")){ db.ghost=db.ghost.filter(x=>x!==from); saveDB(); await sock.sendMessage(from,{text:R.ghostoff},{quoted:m}); }
      else if(txt.toLowerCase().includes("voir")){ let c=db.ghostCache[from]?.length||0; let msgs=db.ghostCache[from]?.slice(-5).map(m=>`@${m.sender.split('@')[0]}: ${m.text}`).join('\n')||"Vide"; await sock.sendMessage(from,{text:`👻 𝑮𝒉𝒐𝒔𝒕: ${c} 𝒎𝒔𝒈𝒔\n${msgs}`, mentions:db.ghostCache[from]?.map(m=>m.sender)||[]},{quoted:m}); }
      else { if(!db.ghost.includes(from)) db.ghost.push(from); saveDB(); await sock.sendMessage(from,{text:R.ghost},{quoted:m}); }
      return
    }
    if(cmd==="s"||cmd==="sticker"){
      let q=m.message.extendedTextMessage?.contextInfo?.quotedMessage; let mediaMsg=q?{message:q}:m
      try{ let buffer=await downloadMediaMessage(mediaMsg,'buffer',{},{logger:P({level:'silent'}),reuploadRequest:sock.updateMediaMessage}); await sock.sendMessage(from,{sticker:buffer},{quoted:m}); }catch(e){ await sock.sendMessage(from,{text:R.sNeed},{quoted:m}) }
      return
    }
    if(cmd==="vq"){
      let q=m.message.extendedTextMessage?.contextInfo?.quotedMessage; if(!q){ await sock.sendMessage(from,{text:R.vqNeed},{quoted:m}); return; }
      try{ let view=q.viewOnceMessage||q.viewOnceMessageV2||q.viewOnceMessageV2Extension; if(view?.message) view=view.message; let buf=await downloadMediaMessage({message:view||q},'buffer',{},{logger:P({level:'silent'}),reuploadRequest:sock.updateMediaMessage}); await sock.sendMessage(from,{image:buf,caption:R.vqOk},{quoted:m}); }catch(e){ await sock.sendMessage(from,{text:"❌ "+e.message},{quoted:m}) }
      return
    }
    if(cmd==="st"){
      let quoted=m.message.extendedTextMessage?.contextInfo?.quotedMessage; if(!quoted){ await sock.sendMessage(from,{text:R.stNeed},{quoted:m}); return; }
      try{ let buf=await downloadMediaMessage({message:quoted},'buffer',{},{logger:P({level:'silent'}),reuploadRequest:sock.updateMediaMessage}); await sock.sendMessage(from,{image:buf,caption:R.stOk},{quoted:m}); }catch{}
      return
    }
    if(text.toLowerCase().startsWith(PREFIX+"autoreply add")){
      let rest=text.split(/add/i)[1]?.trim(); let parts=rest.split('|'); if(parts.length<2){ await sock.sendMessage(from,{text:"👑 𝑼𝒔𝒂𝒈𝒆: ₩𝒂𝒖𝒕𝒐𝒓𝒆𝒑𝒍𝒚 𝒂𝒅𝒅 𝒕𝒓𝒊𝒈𝒈𝒆𝒓 | 𝒓𝒆𝒑𝒐𝒏𝒔𝒆"},{quoted:m}); return; }
      let trig=parts[0].trim().toLowerCase(); let resp=parts[1].trim(); db.autoreply[trig]=resp; saveDB(); await sock.sendMessage(from,{text:`✅ 𝑨𝒖𝒕𝒐𝑹𝒆𝒑𝒍𝒚: ${trig} => ${resp}`},{quoted:m}); return
    }
    if(text.toLowerCase().startsWith(PREFIX+"autoreply list")){ let list=Object.keys(db.autoreply); await sock.sendMessage(from,{text:list.length?`📜 𝑨𝒖𝒕𝒐𝑹𝒆𝒑𝒍𝒚:\n${list.map(k=>`${k} => ${db.autoreply[k]}`).join('\n')}`:"📜 𝑨𝒖𝒄𝒖𝒏"},{quoted:m}); return }
    if(text.toLowerCase().startsWith(PREFIX+"autoreply del")){ let trig=text.split(/del/i)[1]?.trim().toLowerCase(); if(trig && db.autoreply[trig]){ delete db.autoreply[trig]; saveDB(); await sock.sendMessage(from,{text:`🗑️ 𝑺𝒖𝒑𝒑𝒓𝒊𝒎é: ${trig}`},{quoted:m}); } return }
    if(text.toLowerCase().startsWith(PREFIX+"autoreply on all")){ if(!db.autoreplyAll.includes(from)) db.autoreplyAll.push(from); if(!db.autoreplyAll.includes('all')) db.autoreplyAll.push('all'); saveDB(); await sock.sendMessage(from,{text:"✅ 𝑶𝑵 𝑨𝑳𝑳"},{quoted:m}); return }
    if(text.toLowerCase().startsWith(PREFIX+"autoreply on")){ if(!db.autoreplyOn.includes(from)) db.autoreplyOn.push(from); saveDB(); await sock.sendMessage(from,{text:"✅ 𝑶𝑵"},{quoted:m}); return }
    if(text.toLowerCase().startsWith(PREFIX+"autoreply off")){ db.autoreplyOn=db.autoreplyOn.filter(x=>x!==from); db.autoreplyAll=db.autoreplyAll.filter(x=>x!==from && x!=='all'); saveDB(); await sock.sendMessage(from,{text:"❌ 𝑶𝑭𝑭"},{quoted:m}); return }
    if(cmd==="ai"||cmd==="gpt"){ try{ let ans=await askHyper(txt||"Salut"); await sock.sendMessage(from,{text:ans},{quoted:m}); }catch{} return }
    if(cmd==="amis"){ if(!target){ await sock.sendMessage(from,{text:"👑 𝑻𝑨𝑮: ₩𝒂𝒎𝒊𝒔 @𝒂𝒎𝒊"},{quoted:m}); return; } if(!senderNum.includes(OWNER_NUMBER) &&!isMe){ return await sock.sendMessage(from,{text:R.onlyOwner},{quoted:m}) } let n=target.replace(/[^0-9]/g,''); db.amis[n]=true; db.amis[target]=true; saveDB(); await sock.sendMessage(from,{text:R.amis(target), mentions:[target]},{quoted:m}); return }
    if(cmd==="noami"){ if(!target) return; if(!senderNum.includes(OWNER_NUMBER) &&!isMe){ return await sock.sendMessage(from,{text:R.onlyOwner},{quoted:m}) } let n=target.replace(/[^0-9]/g,''); delete db.amis[n]; delete db.amis[target]; saveDB(); await sock.sendMessage(from,{text:R.noami(target), mentions:[target]},{quoted:m}); return }
    if(cmd==="bot"){ if(txt.includes("off")){ db.botOff=true; } else { db.botOff=false; } saveDB(); await sock.sendMessage(from,{text:db.botOff?R.botOffMsg:R.botOnMsg},{quoted:m}); return }
    if(cmd==="groupe"||cmd==="no"){ await sock.groupSettingUpdate(from, txt.includes("no")||cmd==="no"?"announcement":"not_announcement").catch(()=>{}); await sock.sendMessage(from,{text:txt.includes("no")||cmd==="no"?R.mute:R.unmute},{quoted:m}); return }
    if(cmd==="lock"){ await sock.groupSettingUpdate(from,"announcement").catch(()=>{}); await sock.sendMessage(from,{text:R.mute},{quoted:m}); return }
    if(cmd==="unlock"){ await sock.groupSettingUpdate(from,"not_announcement").catch(()=>{}); await sock.sendMessage(from,{text:R.unmute},{quoted:m}); return }
    if(cmd==="private"){ if(txt.includes("on")){ db.privateMode=true; } else { db.privateMode=false; } saveDB(); await sock.sendMessage(from,{text:db.privateMode?R.privateOn:R.privateOff},{quoted:m}); return }
    if(cmd==="godmode"){ if(txt.includes("off")){ db.godmode=db.godmode.filter(x=>x!==from); } else { if(!db.godmode.includes(from)) db.godmode.push(from); } saveDB(); await sock.sendMessage(from,{text:db.godmode.includes(from)?R.godmode:R.godmodeoff},{quoted:m}); return }
  })

  sock.ev.on('messages.update', async(updates)=>{
    for(let update of updates){
      if(update.update.message === null && messageStore[update.key.id]){
        let stored = messageStore[update.key.id]
        if(db.kaio.includes(stored.from)){
          let sender = stored.sender
          await sock.sendMessage(stored.from, {text: `🔥 *KAIO-KEN! MESSAGE SUPPRIMÉ DÉTECTÉ!* 🔥\n\n@${sender.split('@')[0]} a supprimé: \n\n"${stored.text}"\n\n💀 BLACK GOKU VOIT TOUT!`, mentions:[sender]})
        }
        delete messageStore[update.key.id]
      }
    }
  })

  sock.ev.on('group-participants.update', async(update)=>{
    try{
      const { id, participants, action, author } = update
      if(action==='add'){
        for(let p of participants){
          let meta = await sock.groupMetadata(id).catch(()=>({subject:"mon royaume"}))
          if(db.welcome.includes(id)) await sock.sendMessage(id, {text: R.welcomeMsg(p, meta.subject), mentions:[p]})
        }
      }
      if(action==='remove'){
        for(let removed of participants){
          let num = removed.replace(/[^0-9]/g,'')
          let isProtected = db.protec.includes(removed) || db.pro.includes(removed) || db.saved.includes(removed) || db.amis[num] || num.includes(OWNER_NUMBER) || db.zenkai.includes(id) || db.zenkaiUsers[num]
          if(isProtected){
            let meta = await sock.groupMetadata(id).catch(()=>null)
            if(!meta) continue
            let botIsAdmin = meta.participants.find(p=>p.id.includes(sock.user.id.split(':')[0]))?.admin
            if(!botIsAdmin){ await sock.sendMessage(id, {text: R.protecFail}); continue }
            await sock.groupParticipantsUpdate(id, [removed], "add").catch(()=>{})
            await new Promise(r=>setTimeout(r,1200))
            if(author && author!==removed){
              let authorNum = author.replace(/[^0-9]/g,'')
              if(!db.protec.includes(author) &&!authorNum.includes(OWNER_NUMBER)){
                await sock.groupParticipantsUpdate(id, [author], "remove").catch(()=>{})
                await sock.sendMessage(id, {text: R.protecTriggered(removed, author), mentions:[removed, author]})
              }
            }
          }
        }
      }
      if(action==='demote'){
        for(let demoted of participants){
          let num = demoted.replace(/[^0-9]/g,'')
          let isProtected = db.protec.includes(demoted) || db.pro.includes(demoted) || db.saved.includes(demoted) || num.includes(OWNER_NUMBER)
          let antibod = db.antibod[id] || db.antidemote.includes(id)
          if(isProtected || antibod){
            let meta = await sock.groupMetadata(id).catch(()=>null)
            if(!meta) continue
            let botIsAdmin = meta.participants.find(p=>p.id.includes(sock.user.id.split(':')[0]))?.admin
            if(!botIsAdmin){ await sock.sendMessage(id, {text: R.protecFail}); continue }
            await sock.groupParticipantsUpdate(id, [demoted], "promote").catch(()=>{})
            await new Promise(r=>setTimeout(r,800))
            if(author && author!==demoted && isProtected){
              await sock.groupParticipantsUpdate(id, [author], "demote").catch(()=>{})
              await sock.sendMessage(id, {text: R.protecDemote(demoted, author), mentions:[demoted, author]})
            }
          }
        }
      }
    }catch(e){ console.log("PROTEC ERR", e) }
  })
}
startBot()
app.listen(PORT, '0.0.0.0', ()=>console.log("BLACK GOKU LIVE CHROME - LOG CLEAN "+PORT))
