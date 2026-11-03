// web.js - BLACK GOKU V102.1 - OWNER FIX + FULL REPONSES + WELCOME/BYE PHOTO
const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, downloadMediaMessage } = require('@whiskeysockets/baileys')
const P = require('pino')
const fs = require('fs')
const express = require('express')
const NodeCache = require('node-cache')
const axios = require('axios')
const app = express()
const PORT = process.env.PORT || 10000
const OWNER_NUMBER = "5551982215198"
const PREFIX = "₩"
const DB_FILE = './black_db.json'
const msgRetryCounterCache = new NodeCache()
process.on('uncaughtException', e => console.log('uncaught', e.message))
process.on('unhandledRejection', e => console.log('unhandled', e))

let db = { amis:{}, saved:[], pro:[], protec:[], chut:{}, blockadmin:[], godmode:[], kaio:[], antilink:[], antisticker:[], welcome:[], welcomeTexts:{}, bye:[], byeTexts:{}, ghost:[], ghostCache:{}, antibod:{}, curse:{}, antilock:[], antidemote:[], clans:{}, zenkai:[], zenkaiUsers:{}, boy:[], boyUsers:[], ownerLids:[], privateMode:false, botOff:false, activity:{}, groupCache:{} }
if(fs.existsSync(DB_FILE)){ try{ let o=JSON.parse(fs.readFileSync(DB_FILE)); db={...db,...o}; if(!db.clans) db.clans={}; if(!db.welcomeTexts) db.welcomeTexts={}; if(!db.byeTexts) db.byeTexts={}; if(!db.bye) db.bye=[]; if(!Array.isArray(db.ownerLids)) db.ownerLids=[]; }catch{} }
const saveDB = ()=>fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2))
let sock, status="Demarrage...", lastCode="pas encore", latestQR=null, BOT_START=Date.now()
let messageStore = {}, fullMessageStore = {}

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
┃ ₩𝒘𝒂𝒊𝒇𝒖1
┃ ₩𝒘𝒂𝒊𝒇𝒖2
┃ ₩𝒊𝒔𝒄𝒐𝒎
┃ ₩𝒕𝒊𝒎𝒆
┃ ₩𝒓𝒅𝒎
┃ ₩𝒈𝒕
┃ ₩𝒊𝒏𝒂𝒄𝒕𝒊𝒇𝒔
┃ ₩𝒕𝒓𝒂𝒅
┃ ₩𝒂𝒄𝒕
┃ ₩𝒏𝒐𝒂𝒄𝒕
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

// TON OBJET R FULL ORIGINAL - TOUCHE PLUS
const R = {
noPerm:"😈 𝑺𝑬𝑼𝑳 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 𝑷𝑬𝑼𝑻 𝑼𝑻𝑰𝑳𝑰𝑺𝑬𝑹 𝑪𝑬 𝑩𝑶𝑻 𝑻𝑶𝑰 𝑴𝑰𝑺𝑬𝑹𝑨𝑩𝑳𝑬 𝑴𝑶𝑹𝑻𝑬𝑳 𝑻𝑼 𝑹𝑬𝑮𝑨𝑹𝑫𝑬 𝑬𝑻 𝑻𝑼 𝑶𝑩𝑬𝑰𝑺 😈😈",
needTag:"😈 𝑻𝑨𝑮 𝑼𝑵 𝑴𝑶𝑹𝑻𝑬𝑳!",
creatorProtect:"👑🔥 𝑰𝑴𝑷𝑶𝑺𝑺𝑰𝑩𝑳𝑬 𝑫𝑬 𝑻𝑶𝑼𝑪𝑯𝑬𝑹 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼!",
ban:(j)=>`💀 𝑯𝑨𝑲𝑨𝑰! @${j.split('@')[0]} 𝒆𝒇𝒇𝒂𝒄é!`,
promote:(j)=>`👑 @${j.split('@')[0]} é𝒍𝒆𝒗é 𝑫𝒊𝒆𝒖!`,
demote:(j)=>`💔 @${j.split('@')[0]} 𝒅é𝒄𝒉𝒖!`,
mute:"🤫 𝑺𝑰𝑳𝑬𝑵𝑪𝑬 𝑨𝑩𝑺𝑶𝑳𝑼!", unmute:"🔊 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 𝒗𝒐𝒖𝒔 𝒂𝒖𝒕𝒐𝒓𝒊𝒔𝒆!",
chut:(j)=>`🔇 @${j.split('@')[0]} 𝒄𝒐𝒏𝒅𝒂𝒎𝒏é!`, unchut:(j)=>`🔓 @${j.split('@')[0]} 𝒔𝒆𝒄𝒐𝒏𝒅𝒆 𝒄𝒉𝒂𝒏𝒄𝒆!`,
blockadminOn:"⛓️ 𝑩𝑳𝑶𝑪𝑲𝑨𝑫𝑴𝑰𝑵 𝑶𝑵!", reiniOk:(j)=>`♻️ @${j.split('@')[0]} 𝒓é𝒊𝒏𝒊𝒕𝒊𝒂𝒍𝒊𝒔é!`,
neantStart:(c)=>`💀 ${c} 𝒎𝒔𝒈𝒔 𝒆𝒇𝒇𝒂𝒄é𝒔!`, goatStart:(n)=>`🔥 ${n} 𝑭𝑨𝑰𝑩𝑳𝑬𝑺 - 𝑮𝑶𝑨𝑻 𝑫𝑬𝑻𝑹𝑼𝑰𝑻 𝑻𝑶𝑼𝑻!`, goatEnd:(n)=>`💀 ${n} 𝑬𝑭𝑭𝑨𝑪É𝑺 - 𝑺𝑬𝑼𝑳 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 𝑹𝑬𝑺𝑻𝑬!`,
save:(j)=>`🛡️ @${j.split('@')[0]} 𝒎𝒂𝒓𝒒𝒖é!`, protec:(j)=>`👑🔥 𝑷𝑹𝑶𝑻𝑬𝑪 @${j.split('@')[0]}!`,
zenkai:(j)=>`⚡ @${j.split('@')[0]} 𝒁𝑬𝑵𝑲𝑨𝑰.`, zenkaiOn:"⚡ 𝒁𝑬𝑵𝑲𝑨𝑰 𝑶𝑵 - 𝑷𝒓𝒐𝒕è𝒈𝒆 𝒌𝒊𝒄𝒌 + 𝒓𝒆𝒗𝒐𝒒𝒖𝒆 𝒂𝒅𝒎𝒊𝒏!", zenkaiOff:"𝒁𝑬𝑵𝑲𝑨𝑰 𝑶𝑭𝑭",
antilink:"🔗 𝑨𝑵𝑻𝑰𝑳𝑰𝑵𝑲 𝑶𝑵", antilinkoff:"𝑶𝑭𝑭", antilock:"𝑨𝑵𝑻𝑰𝑳𝑶𝑪𝑲 𝑶𝑵", antilockoff:"𝑶𝑭𝑭",
antidemote:"𝑨𝑵𝑻𝑰𝑫𝑬𝑴𝑶𝑻𝑬 𝑶𝑵", antidemoteoff:"𝑶𝑭𝑭",
welcome:"👋 𝑾𝑬𝑳𝑪𝑶𝑴𝑬 𝑶𝑵", welcomeoff:"𝑶𝑭𝑭", byeOn:"👋 𝑩𝒀𝑬 𝑶𝑵", byeOff:"𝑶𝑭𝑭",
ghost:"👻 𝑮𝑯𝑶𝑺𝑻 𝑶𝑵", ghostoff:"𝑶𝑭𝑭", boyOn:"💀 𝑩𝑶𝒀 𝑶𝑵", boyOff:"𝑶𝑭𝑭",
amis:(j)=>`✅ 𝑨𝑴𝑰 @${j.split('@')[0]}!`, noami:(j)=>`❌ 𝑩𝑨𝑵𝑵𝑰 @${j.split('@')[0]}!`,
botOffMsg:"💤 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 𝑺'𝑬𝑵𝑫𝑶𝑹𝑻...", botOnMsg:"🤖🔥 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 𝑺𝑬 𝑹É𝑽𝑬𝑰𝑳𝑳𝑬!",
gokuMsg:"👑 𝑪'𝒆𝒔𝒕 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼, 𝒗𝒐𝒕𝒓𝒆 𝑫𝒊𝒆𝒖.", kaioMsg:"🔥 𝑪'𝒆𝒔𝒕 𝑲𝑨𝑰𝑶.", kaioOn:"🔥 𝑲𝑨𝑰𝑶 𝑶𝑵 - Je vois tout!", kaioOff:"𝑲𝑨𝑰𝑶 𝑶𝑭𝑭",
vqOk:"👁️🔥 𝑽𝑼𝑬 𝑫É𝑽𝑶𝑰𝑳É𝑬!", vqNeed:"😈 𝑹é𝒑𝒐𝒏𝒅𝒔 à 𝒖𝒏𝒆 𝒗𝒖𝒆 𝒖𝒏𝒊𝒒𝒖𝒆!", sNeed:"😈 𝑹é𝒑𝒐𝒏𝒅𝒔 𝒊𝒎𝒂𝒈𝒆!", stNeed:"😈 𝑹é𝒑𝒐𝒏𝒅𝒔 𝒔𝒕𝒂𝒕𝒖𝒕!", stOk:"👁️ 𝑺𝒕𝒂𝒕𝒖𝒕 𝒗𝒐𝒍é",
rdmOk:(j)=>`🎲 @${j.split('@')[0]}!`, timeEnd:"⏰ 𝑻𝑰𝑴𝑬 𝑭𝑰𝑵𝑰!",
protecTriggered:(prot, att)=>`☯️🔥 𝑷𝑹𝑶𝑻𝑬𝑪! @${att.split('@')[0]} 𝒂 𝒃𝒂𝒏𝒏𝒊 @${prot.split('@')[0]}!`, protecFail:"⚠️ 𝑴𝑬𝑻𝑻𝑬𝒁 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 𝑨𝑫𝑴𝑰𝑵!",
welcomeMsg:(j, g, custom)=> custom ? custom.replace(/@user/g, `@${j.split('@')[0]}`).replace(/@group/g, g) : `꧁༒☬ 𝑩𝑰𝑬𝑵𝑽𝑬𝑵𝑼𝑬 ☬༒꧂\n👑 @${j.split('@')[0]} 𝒅𝒂𝒏𝒔 *${g}*.\n*😁`,
byeMsg:(j, g, custom)=> custom ? custom.replace(/@user/g, `@${j.split('@')[0]}`).replace(/@group/g, g) : `꧁༒☬ 𝑨𝑫𝑰𝑬𝑼 ☬༒꧂\n💀 @${j.split('@')[0]} 𝒂 𝒒𝒖𝒊𝒕𝒕é *${g}*.\n𝑸𝒖𝒆 𝒍𝒆 𝒏é𝒂𝒏𝒕 𝒍'𝒆𝒎𝒑𝒐𝒓𝒕𝒆.`,
clanCreate:(n, chef)=>`👑🔥 𝑪𝑳𝑨𝑵 *${n}* 𝑪𝑹ÉÉ!\n👑 𝑪𝒉𝒆𝒇: @${chef.split('@')[0]}\n📅 ${new Date().toLocaleDateString('fr-FR')}`,
clanAdd:(u, n)=>`✅ @${u.split('@')[0]} 𝒂𝒋𝒐𝒖𝒕é 𝒅𝒂𝒏𝒔 *${n}* !`, clanRetire:(u, n)=>`🚪 @${u.split('@')[0]} 𝒓𝒆𝒕𝒊𝒓é 𝒅𝒖 𝒄𝒍𝒂𝒏 *${n}* !`, clanDel:(n)=>`🗑️ 𝑪𝒍𝒂𝒏 *${n}* 𝒔𝒖𝒑𝒑𝒓𝒊𝒎é!`,
clanNotFound:(n)=>`❌ 𝑪𝒍𝒂𝒏 *${n}* 𝒊𝒏𝒕𝒓𝒐𝒖𝒗𝒂𝒃𝒍𝒆!`, clanExists:(n)=>`❌ 𝑪𝒍𝒂𝒏 *${n}* 𝒆𝒙𝒊𝒔𝒕𝒆 𝒅é𝒋à!`,
apocalypseEnd:(n)=>`💀 𝑨𝑷𝑶𝑪𝑨𝑳𝒀𝑷𝑺𝑬 𝑻𝑬𝑹𝑴𝑰𝑵É𝑬! ${n} â𝒎𝒆𝒔 𝒆𝒇𝒇𝒂𝒄é𝒆𝒔!`, hellEnd:(n)=>`🔥 𝑯𝑬𝑳𝑳 𝑻𝑬𝑹𝑴𝑰𝑵É! ${n} 𝒄𝒐𝒏𝒅𝒂𝒎𝒏é𝒔!`, voidEnd:()=>`🌌 𝑽𝑶𝑰𝑫 𝑨𝑪𝑯𝑬𝑽É!`, soulpurgeEnd:(n)=>`💀 𝑺𝑶𝑼𝑳𝑷𝑼𝑹𝑮𝑬 ${n} â𝒎𝒆𝒔!`,
}

function normalizeJid(j){ return j?.split(':')[0].split('@')[0].replace(/[^0-9]/g,'')||"" }
function getRealNumberFromLid(lidJid, meta){
  if(!meta || !lidJid) return null
  try{
    for(let p of meta.participants){
      if(p.id===lidJid && p.phoneNumber) return normalizeJid(p.phoneNumber)
      if(p.lid===lidJid && p.phoneNumber) return normalizeJid(p.phoneNumber)
      if(p.phoneNumber) {
        let n = normalizeJid(p.phoneNumber)
        if(db.ownerLids.includes(p.id) || db.ownerLids.includes(p.lid)) return n
      }
    }
    let f = meta.participants.find(x=> x.id===lidJid || x.lid===lidJid)
    if(f?.phoneNumber) return normalizeJid(f.phoneNumber)
  }catch{} return null
}
function isCreator(jid, meta){
  if(!jid) return false
  let n = normalizeJid(jid)
  if(n===OWNER_NUMBER) return true
  if(db.ownerLids.includes(jid) || db.ownerLids.includes(n)) return true
  if(jid===OWNER_NUMBER+"@s.whatsapp.net") return true
  if(n===OWNER_NUMBER) return true
  if(jid.includes('@lid') && meta){
    let real = getRealNumberFromLid(jid, meta)
    if(real===OWNER_NUMBER){
      if(!db.ownerLids.includes(jid)) { db.ownerLids.push(jid); saveDB(); }
      return true
    }
    // FIX CRITIQUE : si on a déjà vu ce LID comme owner, on le laisse passer même sans phoneNumber
    if(db.ownerLids.includes(jid)) return true
  }
  return false
}
function isProtectedForKick(jid, meta){
  if(isCreator(jid, meta)) return true
  let n = normalizeJid(jid)
  if(meta && jid && jid.includes('@lid')){
    let real = getRealNumberFromLid(jid, meta)
    if(real && (db.saved.includes(real) || db.protec.includes(real) || db.pro.includes(real))) return true
  }
  return db.saved.includes(jid) || db.protec.includes(jid) || db.pro.includes(jid) || db.godmode.includes(jid) || db.saved.includes(n) || db.protec.includes(n)
}
async function makeStickerBuffer(b){ try{ const sharp=require('sharp'); return await sharp(b).resize(512,512,{fit:'contain', background:{r:0,g:0,b:0,alpha:0}}).webp({quality:90}).toBuffer() }catch{ return b } }

app.get('/', (req,res)=> res.send(`<h1>${status}</h1><p>${lastCode}</p><a href="/pair?num=${OWNER_NUMBER}">PAIR</a> | <a href="/qr">QR</a>`))
app.get('/clear', (req,res)=>{ try{ if(fs.existsSync('auth2')) fs.rmSync('auth2',{recursive:true,force:true}); if(fs.existsSync(DB_FILE)) fs.unlinkSync(DB_FILE); res.send('CLEAR OK') }catch(e){ res.send(e.message) } })
app.get('/pair', async(req,res)=>{ if(!sock) return res.send('Demarre...'); try{ let code=await sock.requestPairingCode((req.query.num||OWNER_NUMBER).replace(/[^0-9]/g,'')); lastCode=code; res.send(`<h1 style="font-size:70px">${code}</h1>`) }catch(e){ res.send(e.message) } })
app.get('/qr', async(req,res)=>{ if(!latestQR) return res.send('Pas de QR'); const QRCode=require('qrcode'); res.send(`<img src="${await QRCode.toDataURL(latestQR)}" width="300">`) })
app.listen(PORT,'0.0.0.0',()=>console.log("BLACK GOKU V102.1 LIVE "+PORT))

async function startBot(){
  const { version } = await fetchLatestBaileysVersion()
  const { state, saveCreds } = await useMultiFileAuthState('auth2')
  sock = makeWASocket({ version, auth:{creds:state.creds, keys:makeCacheableSignalKeyStore(state.keys, P({level:'silent'}))}, logger:P({level:'silent'}), browser:["BLACK GOKU","Chrome","1.0"], msgRetryCounterCache, markOnlineOnConnect:false, getMessage: async(k)=> messageStore[k.id]? {conversation:messageStore[k.id].text}: undefined })
  sock.ev.on('creds.update', saveCreds)
  sock.ev.on('connection.update', async(u)=>{ if(u.qr) latestQR=u.qr; if(u.connection==='open'){ status="BLACK GOKU ACTIF ✅"; latestQR=null; BOT_START=Date.now(); console.log("LIVE") } if(u.connection==='close'){ if(u.lastDisconnect?.error?.output?.statusCode===401 && fs.existsSync('auth2')) fs.rmSync('auth2',{recursive:true,force:true}); setTimeout(startBot,3000) } })

  sock.ev.on('messages.upsert', async({messages,type})=>{
    if(type!=='notify') return; const m=messages[0]; if(!m?.message) return; if(m.key.fromMe) return
    if(m.messageTimestamp && (Date.now()/1000 - Number(m.messageTimestamp) > 30)) return
    if(Date.now()-BOT_START<5000) return
    const from=m.key.remoteJid; const sender=m.key.participant||from
    const isGroup=from.endsWith('@g.us')
    const meta=isGroup? await sock.groupMetadata(from).catch(()=>null): null
    let txtForCache=m.message.conversation||m.message.extendedTextMessage?.text||m.message.imageMessage?.caption||m.message.videoMessage?.caption||""
    let senderNum=normalizeJid(sender); let fromNum=normalizeJid(from)

    // FIX OWNER ULTIME - Si c'est toi, on force
    let isOwner=false
    if(senderNum===OWNER_NUMBER || fromNum===OWNER_NUMBER) isOwner=true
    else if(isCreator(sender, meta) || isCreator(from, meta)) isOwner=true
    else {
      let sc=db.amis[senderNum]||db.amis[fromNum]
      if(!sc && meta && sender.includes('@lid')){
        let real=getRealNumberFromLid(sender, meta)
        if(real) sc=db.amis[real] || (real===OWNER_NUMBER ? true : null)
      }
      if(sc) isOwner=true
    }
    // Sauvegarde auto LID owner
    if(isOwner && from.includes('@lid') && !db.ownerLids.includes(from)) { db.ownerLids.push(from); saveDB(); }
    if(isOwner && sender.includes('@lid') && !db.ownerLids.includes(sender)) { db.ownerLids.push(sender); saveDB(); }

    if(txtForCache){
      if(isGroup){ if(!db.activity[from]) db.activity[from]={}; db.activity[from][sender]=(db.activity[from][sender]||0)+1; if(!fullMessageStore[from]) fullMessageStore[from]=[]; fullMessageStore[from].push({key:m.key,text:txtForCache}); if(fullMessageStore[from].length>200) fullMessageStore[from].shift() }
      if(db.kaio.includes(from)) messageStore[m.key.id]={text:txtForCache,sender,from}
      if(isGroup&&db.ghost.includes(from)){ if(!db.ghostCache[from]) db.ghostCache[from]=[]; db.ghostCache[from].push({sender,text:txtForCache,time:Date.now()}); if(db.ghostCache[from].length>500) db.ghostCache[from].shift(); saveDB(); }
    }
    if(isGroup&&!isOwner&&!isProtectedForKick(sender,meta)){
      if(db.chut[sender]||db.boy.includes(from)){ try{ await sock.sendMessage(from,{delete:m.key}) }catch{} return }
      if(db.antilink.includes(from)&&/(https?:\/\/|chat\.whatsapp\.com|wa\.me)/i.test(txtForCache)){ try{ let isAdmin=meta?.participants.find(p=>p.id===sender)?.admin; if(!isAdmin) await sock.sendMessage(from,{delete:m.key}) }catch{} return }
    }

    let text=m.message.conversation||m.message.extendedTextMessage?.text||m.message.imageMessage?.caption||m.message.videoMessage?.caption||""
    if(!text.startsWith(PREFIX)) return
    if(!isOwner){ await sock.sendMessage(from,{text:R.noPerm},{quoted:m}); return }

    const args=text.slice(1).trim().split(/ +/); const cmd=args[0].toLowerCase(); const txt=args.slice(1).join(' ')
    const mentioned=m.message.extendedTextMessage?.contextInfo?.mentionedJid||[]; let target=mentioned[0]
    const rawLow=text.toLowerCase()

    if(cmd==="setwelcome"){ if(!txt) return await sock.sendMessage(from,{text:`📝 ${PREFIX}setwelcome Bienvenue @user dans @group\nActuel: ${db.welcomeTexts[from]||"défaut"}`},{quoted:m}); db.welcomeTexts[from]=txt; saveDB(); await sock.sendMessage(from,{text:`✅ Welcome:\n${txt}`},{quoted:m}); return }
    if(cmd==="setbye"){ if(!txt) return await sock.sendMessage(from,{text:`📝 ${PREFIX}setbye Au revoir @user de @group\nActuel: ${db.byeTexts[from]||"défaut"}`},{quoted:m}); db.byeTexts[from]=txt; saveDB(); await sock.sendMessage(from,{text:`✅ Bye:\n${txt}`},{quoted:m}); return }
    if(cmd==="welcome"){ if(txt.toLowerCase().includes("off")) db.welcome=db.welcome.filter(x=>x!==from); else if(!db.welcome.includes(from)) db.welcome.push(from); saveDB(); await sock.sendMessage(from,{text:db.welcome.includes(from)?R.welcome:R.welcomeoff},{quoted:m}); return }
    if(cmd==="bye"){ if(txt.toLowerCase().includes("off")) db.bye=db.bye.filter(x=>x!==from); else if(!db.bye.includes(from)) db.bye.push(from); saveDB(); await sock.sendMessage(from,{text:db.bye.includes(from)?R.byeOn:R.byeOff},{quoted:m}); return }
    if(cmd==="antilink"){ if(txt.toLowerCase().includes("off")) db.antilink=db.antilink.filter(x=>x!==from); else if(!db.antilink.includes(from)) db.antilink.push(from); saveDB(); await sock.sendMessage(from,{text:db.antilink.includes(from)?R.antilink:R.antilinkoff},{quoted:m}); return }
    if(cmd==="antilock"){ if(txt.toLowerCase().includes("off")) db.antilock=db.antilock.filter(x=>x!==from); else if(!db.antilock.includes(from)) db.antilock.push(from); saveDB(); await sock.sendMessage(from,{text:db.antilock.includes(from)?R.antilock:R.antilockoff},{quoted:m}); return }
    if(cmd==="antidemote"){ if(txt.toLowerCase().includes("off")) db.antidemote=db.antidemote.filter(x=>x!==from); else if(!db.antidemote.includes(from)) db.antidemote.push(from); saveDB(); await sock.sendMessage(from,{text:db.antidemote.includes(from)?R.antidemote:R.antidemoteoff},{quoted:m}); return }
    if(cmd==="ghost"){ if(txt.toLowerCase().includes("off")){ db.ghost=db.ghost.filter(x=>x!==from); saveDB(); await sock.sendMessage(from,{text:R.ghostoff},{quoted:m}); } else { if(!db.ghost.includes(from)) db.ghost.push(from); saveDB(); await sock.sendMessage(from,{text:R.ghost},{quoted:m}); } return }
    if(cmd==="boy"){ if(txt.toLowerCase().includes("off")){ db.boy=db.boy.filter(x=>x!==from); saveDB(); await sock.sendMessage(from,{text:R.boyOff},{quoted:m}); } else { if(!db.boy.includes(from)) db.boy.push(from); saveDB(); await sock.sendMessage(from,{text:R.boyOn},{quoted:m}); } return }
    if(cmd==="zenkai"){ if(txt.toLowerCase().includes("on")){ if(!db.zenkai.includes(from)) db.zenkai.push(from); saveDB(); await sock.sendMessage(from,{text:R.zenkaiOn},{quoted:m}); } else if(target){ let n=normalizeJid(target); db.zenkaiUsers[n]=from; saveDB(); await sock.sendMessage(from,{text:R.zenkai(target),mentions:[target]},{quoted:m}); } return }
    if(cmd==="nozenkai"){ db.zenkai=db.zenkai.filter(x=>x!==from); saveDB(); await sock.sendMessage(from,{text:R.zenkaiOff},{quoted:m}); return }
    if(["black","menu","b"].includes(cmd)){ await sock.sendMessage(from,{text:getMenu()},{quoted:m}); return }
    if(isGroup&&cmd==="tagall"){ let men=meta.participants.map(p=>p.id); await sock.sendMessage(from,{text:`🔥 TAGALL ${men.length}\n${txt}`,mentions:men},{quoted:m}); return }
    if(isGroup&&cmd==="hidetag"){ let men=meta.participants.map(p=>p.id); await sock.sendMessage(from,{text:txt||"👻 BLACK GOKU",mentions:men},{quoted:m}); return }
    if(cmd==="ban"||cmd==="kick"){ if(!target) return await sock.sendMessage(from,{text:R.needTag},{quoted:m}); if(isProtectedForKick(target,meta)) return await sock.sendMessage(from,{text:R.creatorProtect,mentions:[target]},{quoted:m}); await sock.groupParticipantsUpdate(from,[target],"remove"); await sock.sendMessage(from,{text:R.ban(target),mentions:[target]},{quoted:m}); return }
    if(cmd==="save"&&target){ if(!db.saved.includes(target)) db.saved.push(target); saveDB(); await sock.sendMessage(from,{text:R.save(target),mentions:[target]},{quoted:m}); return }
    if(cmd==="chut"&&target){ db.chut[target]=true; saveDB(); await sock.sendMessage(from,{text:R.chut(target),mentions:[target]},{quoted:m}); return }
    if(cmd==="unchut"&&target){ delete db.chut[target]; saveDB(); await sock.sendMessage(from,{text:R.unchut(target),mentions:[target]},{quoted:m}); return }
    if(cmd==="s"||cmd==="sticker"){ try{ let q=m.message.extendedTextMessage?.contextInfo?.quotedMessage; let mm=q&&(q.imageMessage||q.videoMessage)?{message:q}:m; let buf=await downloadMediaMessage(mm,'buffer',{},{logger:P({level:'silent'}),reuploadRequest:sock.updateMediaMessage}); let st=await makeStickerBuffer(buf); await sock.sendMessage(from,{sticker:st},{quoted:m}) }catch(e){ await sock.sendMessage(from,{text:"❌ "+e.message},{quoted:m}) } return }
    if(cmd==="vq"){ let q=m.message.extendedTextMessage?.contextInfo?.quotedMessage; if(!q) return await sock.sendMessage(from,{text:R.vqNeed},{quoted:m}); try{ let real=q.viewOnceMessage?.message||q.viewOnceMessageV2?.message||q.viewOnceMessageV2Extension?.message||q; if(real.viewOnceMessage) real=real.viewOnceMessage.message; if(real.viewOnceMessageV2) real=real.viewOnceMessageV2.message; let buf=await downloadMediaMessage({message:real},'buffer',{},{logger:P({level:'silent'}),reuploadRequest:sock.updateMediaMessage}); if(real.imageMessage) await sock.sendMessage(from,{image:buf,caption:R.vqOk},{quoted:m}); else await sock.sendMessage(from,{video:buf,caption:R.vqOk},{quoted:m}) }catch(e){ await sock.sendMessage(from,{text:"❌ VQ: "+e.message},{quoted:m}) } return }
    if(cmd==="bot"){ db.botOff=txt.includes("off"); saveDB(); await sock.sendMessage(from,{text:db.botOff?R.botOffMsg:R.botOnMsg},{quoted:m}); return }
    if(rawLow.startsWith(PREFIX+"crée clan")||rawLow.startsWith(PREFIX+"cree clan")){ let clanName=args[1]?.toLowerCase()==="clan"?args[2]?.toLowerCase():args[1]?.toLowerCase(); if(!clanName) return await sock.sendMessage(from,{text:"😈 NOM CLAN?"},{quoted:m}); if(db.clans[clanName]) return await sock.sendMessage(from,{text:R.clanExists(clanName)},{quoted:m}); db.clans[clanName]={name:clanName, chef:target||sender, members:[target||sender], createdAt:new Date().toISOString()}; saveDB(); await sock.sendMessage(from,{text:R.clanCreate(clanName, target||sender),mentions:[target||sender]},{quoted:m}); return }
  })

  sock.ev.on('group-participants.update', async(update)=>{
    try{
      const { id, participants, action, author } = update; const meta=await sock.groupMetadata(id).catch(()=>null)
      if(action==='add'){
        for(let p of participants){
          if(p===sock.user.id) continue;
          if(db.welcome.includes(id)){
            let pp; try{ pp=await sock.profilePictureUrl(p,'image') }catch{ pp=null }
            let custom=db.welcomeTexts[id]
            let finalMsg=R.welcomeMsg(p, meta?.subject||"royaume", custom)
            if(pp) await sock.sendMessage(id,{image:{url:pp}, caption:finalMsg, mentions:[p]})
            else await sock.sendMessage(id,{text:finalMsg, mentions:[p]})
          }
        }
      }
      if(action==='remove'){
        for(let r of participants){
          if(r===sock.user.id) continue;
          if(db.bye.includes(id)){
            let pp; try{ pp=await sock.profilePictureUrl(r,'image') }catch{ pp=null }
            let custom=db.byeTexts[id]
            let finalMsg=R.byeMsg(r, meta?.subject||"royaume", custom)
            if(pp) await sock.sendMessage(id,{image:{url:pp}, caption:finalMsg, mentions:[r]}).catch(()=>{})
            else await sock.sendMessage(id,{text:finalMsg, mentions:[r]}).catch(()=>{})
          }
          let num=normalizeJid(r); let isProt=db.protec.includes(r)||db.saved.includes(r)||db.amis[num]||db.godmode.includes(id)||num===OWNER_NUMBER||db.zenkai.includes(id);
          if(isProt){
            if(!meta) continue; let botAdmin=meta.participants.find(p=>p.id.includes(sock.user.id.split(':')[0]))?.admin;
            if(!botAdmin){ await sock.sendMessage(id,{text:R.protecFail}); continue }
            await sock.groupParticipantsUpdate(id,[r],"add").catch(()=>{}); await new Promise(res=>setTimeout(res,1200));
            if(author&&author!==r){ let an=normalizeJid(author); if(!an.includes(OWNER_NUMBER)){ await sock.groupParticipantsUpdate(id,[author],"remove").catch(()=>{}); await sock.sendMessage(id,{text:R.protecTriggered(r,author),mentions:[r,author]}) } }
          }
        }
      }
      if(action==='demote'){ for(let d of participants){ let num=normalizeJid(d); let ab=db.antidemote.includes(id)||db.godmode.includes(id)||db.zenkai.includes(id); let isProt=db.protec.includes(d)||db.saved.includes(d)||num===OWNER_NUMBER; if(isProt||ab){ if(!meta) continue; let botAdmin=meta.participants.find(p=>p.id.includes(sock.user.id.split(':')[0]))?.admin; if(!botAdmin) continue; await sock.groupParticipantsUpdate(id,[d],"promote").catch(()=>{}) } } }
    }catch(e){ console.log("ERR",e.message) }
  })
}
startBot()