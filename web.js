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
let db = { amis:{}, saved:[], pro:[], protec:[], chut:{}, blockadmin:[], godmode:[], kaio:[], antilink:[], antisticker:[], antistatus:[], welcome:[], pt:[], ghost:[], muted:[], ghostCache:{}, antibod:{}, curse:{}, antilock:[], antidemote:[], clans:{}, autoreply:{}, autoreplyOn:[], autoreplyAll:[], zenkai:[], zenkaiUsers:{}, boy:[], boyUsers:[], sceau:{}, privateMode:false, botOff:false, activity:{}, groupCache:{} }
if(fs.existsSync(DB_FILE)){ try{ let o=JSON.parse(fs.readFileSync(DB_FILE)); db={...db,...o} }catch{} }
const saveDB = ()=>fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2))
let sock, status="Demarrage...", lastCode="pas encore", latestQR=null, BOT_START=Date.now()
let messageStore = {}, fullMessageStore = {}

const OWNER_TRIGGERS = ["goat", "black goku", "blackgoku", "jean", "stevenson", "the goat", "boss", "vilmar", "stevenson-code", "jean vilmar", "sondji"]
const PV_TRIGGERS = ["slt","cc","yo","oi","bom dia","bomdia","salut","wesh","bjr","bonjour","coucou","hello","yo"]
const GOAT_REPLIES = [
  "Yo 😎 oui c'est moi, tu m'as appelé? Je suis là frère.",
  "Wesh 😁 je suis là! Qu'est-ce qu'il y a?",
  "Oui mon reuf? Tu as besoin de quelque chose? 👊",
  "Je suis là frère, dis-moi tout",
  "Présent! On est là, c'est comment? 😎",
  "BLACK GOKU est occupé pour le moment!",
  "Oui oui je t'écoute, Qu'est-ce qu'il y'a? 🔥",
  "je suis là! 💪"
]
const getRandomGoatReply = ()=> GOAT_REPLIES[Math.floor(Math.random()*GOAT_REPLIES.length)]

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
┃ ₩𝒘𝒂𝒊𝒇𝒖3
┃ ₩𝒘𝒂𝒊𝒇𝒖4
┃ ₩𝒊𝒔𝒄𝒐𝒎
┃ ₩𝒕𝒊𝒎𝒆
┃ ₩𝒓𝒅𝒎
┃ ₩𝒈𝒕
┃ ₩𝒊𝒏𝒂𝒄𝒕𝒊𝒇𝒔
┃ ₩𝒕𝒓𝒂𝒅
┃ ₩𝒂𝒄𝒕
┃ ₩𝒏𝒐𝒂𝒄𝒕
┗━━━━━━━━━━━━━━┛
┏━ ✦ 𝑷𝑼𝑵𝑰𝑻𝑰𝑶𝑵𝑺 ✦ ━┓
┃ ₩𝒄𝒉𝒖𝒕
┃ ₩𝒖𝒏𝒄𝒉𝒖𝒕
┃ ₩𝒃𝒍𝒐𝒄𝒌𝒂𝒅𝒎𝒊𝒏
┃ ₩𝒓𝒆𝒊𝒏𝒊
┃ ₩𝒄𝒖𝒓𝒔𝒆
┃ ₩𝒏𝒆𝒂𝒏𝒕
┃ ₩𝒈𝒐𝒂𝒕
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
┃ ₩𝒂𝒖𝒕𝒐𝒓𝒆𝒑𝒍𝒚 𝒐𝒇𝒇
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
mute:"🤫 𝑺𝑰𝑳𝑬𝑵𝑪𝑬 𝑨𝑩𝑺𝑶𝑳𝑼!",
unmute:"🔊 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 𝒗𝒐𝒖𝒔 𝒂𝒖𝒕𝒐𝒓𝒊𝒔𝒆!",
chut:(j)=>`🔇 @${j.split('@')[0]} 𝒄𝒐𝒏𝒅𝒂𝒎𝒏é!`,
unchut:(j)=>`🔓 @${j.split('@')[0]} 𝒔𝒆𝒄𝒐𝒏𝒅𝒆 𝒄𝒉𝒂𝒏𝒄𝒆!`,
blockadminOn:"⛓️ 𝑩𝑳𝑶𝑪𝑲𝑨𝑫𝑴𝑰𝑵 𝑶𝑵!",
curseOn:(j)=>`☬ @${j.split('@')[0]} 𝒎𝒂𝒖𝒅𝒊𝒕!`,
reiniOk:(j)=>`♻️ @${j.split('@')[0]} 𝒓é𝒊𝒏𝒊𝒕𝒊𝒂𝒍𝒊𝒔é!`,
neantStart:(c)=>`💀 ${c} 𝒎𝒔𝒈𝒔 𝒆𝒇𝒇𝒂𝒄é𝒔!`,
goatStart:(n)=>`🔥 ${n} 𝑭𝑨𝑰𝑩𝑳𝑬𝑺 - 𝑮𝑶𝑨𝑻 𝑫𝑬𝑻𝑹𝑼𝑰𝑻 𝑻𝑶𝑼𝑻!`,
goatEnd:(n)=>`💀 ${n} 𝑬𝑭𝑭𝑨𝑪É𝑺 - 𝑺𝑬𝑼𝑳 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 𝑹𝑬𝑺𝑻𝑬!`,
save:(j)=>`🛡️ @${j.split('@')[0]} 𝒎𝒂𝒓𝒒𝒖é!`,
protec:(j)=>`👑🔥 𝑷𝑹𝑶𝑻𝑬𝑪 @${j.split('@')[0]}!`,
zenkai:(j)=>`⚡ @${j.split('@')[0]} 𝒁𝑬𝑵𝑲𝑨𝑰.`,
nozenkai:(j)=>`𝒁𝑬𝑵𝑲𝑨𝑰 𝒓𝒆𝒕𝒊𝒓é.`,
zenkaiOn:"⚡ 𝒁𝑬𝑵𝑲𝑨𝑰 𝑶𝑵 - 𝑷𝒓𝒐𝒕è𝒈𝒆 𝒌𝒊𝒄𝒌 + 𝒓𝒆𝒗𝒐𝒒𝒖𝒆 𝒂𝒅𝒎𝒊𝒏!",
zenkaiOff:"𝒁𝑬𝑵𝑲𝑨𝑰 𝑶𝑭𝑭",
antilink:"🔗 𝑨𝑵𝑻𝑰𝑳𝑰𝑵𝑲 𝑶𝑵", antilinkoff:"𝑶𝑭𝑭",
antilock:"𝑨𝑵𝑻𝑰𝑳𝑶𝑪𝑲 𝑶𝑵", antilockoff:"𝑶𝑭𝑭",
antidemote:"𝑨𝑵𝑻𝑰𝑫𝑬𝑴𝑶𝑻𝑬 𝑶𝑵", antidemoteoff:"𝑶𝑭𝑭",
welcome:"👋 𝑾𝑬𝑳𝑪𝑶𝑴𝑬 𝑶𝑵", welcomeoff:"𝑶𝑭𝑭",
ghost:"👻 𝑮𝑯𝑶𝑺𝑻 𝑶𝑵", ghostoff:"𝑶𝑭𝑭",
boyOn:"💀 𝑩𝑶𝒀 𝑶𝑵", boyOff:"𝑶𝑭𝑭",
amis:(j)=>`✅ 𝑨𝑴𝑰 @${j.split('@')[0]}!`,
noami:(j)=>`❌ 𝑩𝑨𝑵𝑵𝑰 @${j.split('@')[0]}!`,
botOffMsg:"💤 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 𝑺'𝑬𝑵𝑫𝑶𝑹𝑻...", botOnMsg:"🤖🔥 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 𝑺𝑬 𝑹É𝑽𝑬𝑰𝑳𝑳𝑬!",
gokuMsg:"👑 𝑪'𝒆𝒔𝒕 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼, 𝒗𝒐𝒕𝒓𝒆 𝑫𝒊𝒆𝒖.",
kaioMsg:"🔥 𝑪'𝒆𝒔𝒕 𝑲𝑨𝑰𝑶.", kaioOn:"🔥 𝑲𝑨𝑰𝑶 𝑶𝑵 - Je vois tout!", kaioOff:"𝑲𝑨𝑰𝑶 𝑶𝑭𝑭",
vqOk:"👁️🔥 𝑽𝑼𝑬 𝑫É𝑽𝑶𝑰𝑳É𝑬!", vqNeed:"😈 𝑹é𝒑𝒐𝒏𝒅𝒔 à 𝒖𝒏𝒆 𝒗𝒖𝒆 𝒖𝒏𝒊𝒒𝒖𝒆!",
sNeed:"😈 𝑹é𝒑𝒐𝒏𝒅𝒔 𝒊𝒎𝒂𝒈𝒆!", stNeed:"😈 𝑹é𝒑𝒐𝒏𝒅𝒔 𝒔𝒕𝒂𝒕𝒖𝒕!", stOk:"👁️ 𝑺𝒕𝒂𝒕𝒖𝒕 𝒗𝒐𝒍é",
rdmOk:(j)=>`🎲 @${j.split('@')[0]}!`, timeEnd:"⏰ 𝑻𝑰𝑴𝑬 𝑭𝑰𝑵𝑰!", timEnd:"⏰ 𝑻𝑰𝑴 𝑭𝑰𝑵𝑰!",
onlyOwner:"👑🔥 𝑺𝑬𝑼𝑳 𝑳𝑬 𝑫𝑰𝑬𝑼 𝑺𝑼𝑷𝑹Ê𝑴𝑬!",
protecTriggered:(prot, att)=>`☯️🔥 𝑷𝑹𝑶𝑻𝑬𝑪! @${att.split('@')[0]} 𝒂 𝒃𝒂𝒏𝒏𝒊 @${prot.split('@')[0]}!`,
protecDemote:(prot, att)=>`☯️ 𝑨𝑵𝑻𝑰-𝑫𝑬𝑴𝑶𝑻𝑬! @${att.split('@')[0]} 𝒂 𝒅𝒆𝒎𝒐𝒕𝒆 @${prot.split('@')[0]}!`,
protecFail:"⚠️ 𝑴𝑬𝑻𝑻𝑬𝒁 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 𝑨𝑫𝑴𝑰𝑵!",
godmode:"☯️ 𝑮𝑶𝑫𝑴𝑶𝑫𝑬 𝑶𝑵", godmodeoff:"𝑶𝑭𝑭",
welcomeMsg:(j, g)=>`꧁༒☬ 𝑩𝑰𝑬𝑵𝑽𝑬𝑵𝑼𝑬 ☬༒꧂\n👑 @${j.split('@')[0]} 𝒅𝒂𝒏𝒔 *${g}*.\n*😁`,
}
function normalizeJid(jid){ return jid? jid.split(':')[0].split('@')[0].replace(/[^0-9]/g,'') : "" }
function isCreator(jid){ return normalizeJid(jid)===OWNER_NUMBER }
function isProtectedForKick(jid){ return isCreator(jid) || db.saved.includes(jid) || db.protec.includes(jid) || db.pro.includes(jid) || db.godmode.includes(jid) || db.saved.includes(normalizeJid(jid)) || db.protec.includes(normalizeJid(jid)); }
function isZenkaiProtected(jid, groupId){
  let n = normalizeJid(jid)
  if(groupId && db.zenkai.includes(groupId)) return true
  if(db.zenkaiUsers[n] === groupId || db.zenkaiUsers[jid] === groupId) return true
  if(Object.keys(db.zenkaiUsers).includes(n)) return true
  return isProtectedForKick(jid)
}
async function askHyper(q){ try{ let r=await axios.get(`https://text.pollinations.ai/${encodeURIComponent(q)}`,{timeout:20000}); return typeof r.data==='string'?r.data.trim():JSON.stringify(r.data) }catch{ return "𝑰𝑨 𝒊𝒏𝒅𝒊𝒔𝒑𝒐𝒏𝒊𝒃𝒍𝒆" } }
async function safeRemove(gid, jids){ let ok=0; for(let j of jids){ try{ await sock.groupParticipantsUpdate(gid,[j],"remove"); ok++; await new Promise(r=>setTimeout(r,1200)); }catch{} } return ok; }
async function translateText(text, to='fr'){
  to = to.toLowerCase()
  if(to==='français') to='fr'
  if(to==='portugais' || to==='portugais br' || to==='br') to='pt'
  if(to==='francais') to='fr'
  if(!['fr','pt','en','es'].includes(to)) to='fr'
  try{
    let r=await axios.get(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=auto|${to}`,{timeout:8000});
    if(r.data?.responseData?.translatedText && r.data.responseData.translatedText.length>1) return r.data.responseData.translatedText
  }catch{} return text
}
function findWaifuFile(num){
  try{
    let files = fs.readdirSync('./')
    let target = String(num).trim()
    for(let f of files){
      let low = f.toLowerCase()
      if(!low.includes('waifu')) continue
      let extOk = low.endsWith('.jpg')||low.endsWith('.jpeg')||low.endsWith('.png')||low.endsWith('.webp')
      if(!extOk) continue
      if(low.match(new RegExp(`waifu\\s*${target}\\.`))) return './'+f
      if(low.match(new RegExp(`waifu[^0-9]*${target}`))){
        let m = low.match(/waifu[^0-9]*(\d+)/)
        if(m && m[1]===target) return './'+f
      }
    }
    let tries = [`./waifu ${target}.jpg`,`./waifu${target}.jpg`,`./Waifu ${target}.jpg`]
    for(let p of tries) if(fs.existsSync(p)) return p
    if(target==='1' && fs.existsSync('./waifu.jpg')) return './waifu.jpg'
  }catch{} return null
}
async function makeStickerBuffer(mediaBuffer){
  try{
    const sharp = require('sharp')
    return await sharp(mediaBuffer).resize(512,512,{fit:'contain', background:{r:0,g:0,b:0,alpha:0}}).webp({quality:90}).toBuffer()
  }catch{ return mediaBuffer }
}
function getGroupProtections(gid){
  let p=[]
  if(db.antilink.includes(gid)) p.push("antilink")
  if(db.antilock.includes(gid)) p.push("antilock")
  if(db.antidemote.includes(gid)) p.push("antidemote")
  if(db.welcome.includes(gid)) p.push("welcome")
  if(db.ghost.includes(gid)) p.push("ghost")
  if(db.kaio.includes(gid)) p.push("kaio")
  if(db.zenkai.includes(gid)) p.push("zenkai")
  if(db.godmode.includes(gid)) p.push("godmode")
  if(db.boy.includes(gid)) p.push("boy")
  if(db.blockadmin.includes(gid)) p.push("blockadmin")
  if(db.autoreplyOn.includes(gid)) p.push("autoreply")
  if(db.antisticker.includes(gid)) p.push("antisticker")
  if(db.antibod[gid]) p.push("antibod")
  return p
}
app.get('/', (req,res)=> res.send(`<h1>${status}</h1><p>CODE:${lastCode}</p><a href="/pair?num=${OWNER_NUMBER}">PAIR</a> | <a href="/qr">QR</a> | <a href="/clear">CLEAR</a>`))
app.get('/clear', (req,res)=>{ try{ if(fs.existsSync('auth2')) fs.rmSync('auth2',{recursive:true,force:true}); latestQR=null; messageStore={}; fullMessageStore={}; res.send('CLEAR OK') }catch(e){ res.send(e.message) } })
app.get('/pair', async(req,res)=>{ if(!sock) return res.send('Bot demarre...'); let num=(req.query.num||'').replace(/[^0-9]/g,'')||OWNER_NUMBER; try{ let code=await sock.requestPairingCode(num); lastCode=code; res.send(`<h1 style="font-size:60px">${code}</h1>`) }catch(e){ res.send('Erreur: '+e.message) } })
app.get('/qr', async(req,res)=>{ if(!latestQR) return res.send('Pas de QR'); try{ const QRCode=require('qrcode'); res.send(`<img src="${await QRCode.toDataURL(latestQR)}" style="width:300px">`) }catch(e){ res.send(e.message) } })
app.listen(PORT,'0.0.0.0',()=>console.log("BLACK GOKU V81 LIVE "+PORT))
async function startBot(){
  const { version } = await fetchLatestBaileysVersion()
  const { state, saveCreds } = await useMultiFileAuthState('auth2')
  sock = makeWASocket({ version, auth:{creds:state.creds, keys:makeCacheableSignalKeyStore(state.keys, P({level:'silent'}))}, logger:P({level:'silent'}), browser:["BLACK GOKU","Chrome","1.0"], markOnlineOnConnect:false, syncFullHistory:false, fireInitQueries:false, shouldSyncHistoryMessage:()=>false, msgRetryCounterCache, getMessage: async(k)=> messageStore[k.id]? {conversation:messageStore[k.id].text}: undefined })
  sock.ev.on('creds.update', saveCreds)
  sock.ev.on('connection.update', async(u)=>{ if(u.qr) latestQR=u.qr; if(u.connection==='open'){ status="BLACK GOKU ACTIF ✅"; latestQR=null; BOT_START=Date.now(); messageStore={}; console.log("BLACK GOKU LIVE") } if(u.connection==='close'){ let c=u.lastDisconnect?.error?.output?.statusCode; if(c===401 && fs.existsSync('auth2')) fs.rmSync('auth2',{recursive:true,force:true}); setTimeout(startBot,3000) } })
  sock.ev.on('messages.upsert', async({messages,type})=>{
    if(type!=='notify') return; const m=messages[0]; if(!m?.message) return
    if(m.messageTimestamp){ const age=Date.now()/1000 - Number(m.messageTimestamp); if(age>20) return }
    if(Date.now()-BOT_START<5000) return
    const from=m.key.remoteJid; const sender=m.key.participant||from
    let txtForCache=m.message.conversation||m.message.extendedTextMessage?.text||m.message.imageMessage?.caption||m.message.videoMessage?.caption||""
    let textAll=m.message.conversation||m.message.extendedTextMessage?.text||m.message.imageMessage?.caption||m.message.videoMessage?.caption||""
    const senderNum=normalizeJid(sender); const isMe=m.key.fromMe;
    let isOwner=isMe||senderNum.includes(OWNER_NUMBER)
    if(!isOwner){
      let sc=db.amis[senderNum]||db.amis[sender]
      if(sc){
        if(sc==="PV_ONLY" && !from.endsWith('@g.us')) isOwner=true
        else if(sc===from) isOwner=true
        else if(sc===true) isOwner=true
        else if(typeof sc==="string" && sc.endsWith('@g.us') && sc===from) isOwner=true
      }
    }
    if(txtForCache){
      if(from.endsWith('@g.us')){
        if(!db.activity[from]) db.activity[from]={}
        db.activity[from][sender]=(db.activity[from][sender]||0)+1
        if(!fullMessageStore[from]) fullMessageStore[from]=[]
        fullMessageStore[from].push({key:m.key, text:txtForCache, time:Date.now()})
        if(fullMessageStore[from].length>200) fullMessageStore[from].shift()
      }
      if(db.kaio.includes(from)) messageStore[m.key.id]={text:txtForCache,sender,from,id:m.key.id}
      if(from.endsWith('@g.us') && db.ghost.includes(from)){ if(!db.ghostCache[from]) db.ghostCache[from]=[]; db.ghostCache[from].push({sender,text:txtForCache,time:Date.now()}); if(db.ghostCache[from].length>500) db.ghostCache[from].shift(); saveDB(); }
      if(!textAll.startsWith(PREFIX)){
        let low = textAll.toLowerCase().trim()
        if(from.endsWith('@g.us')){
          let enGroup = db.autoreplyOn.includes(from) || db.autoreplyAll.includes(from) || db.autoreplyAll.includes('all')
          if(enGroup){
            for(let trig of OWNER_TRIGGERS){ if(low.includes(trig)){ await sock.sendMessage(from,{text:getRandomGoatReply()}); break } }
            for(let k in db.autoreply){ if(low.includes(k.toLowerCase())){ await sock.sendMessage(from,{text:db.autoreply[k]}); break } }
          }
        } else {
          let isPVTrigger = PV_TRIGGERS.some(t=> low===t || low.startsWith(t+" ") || low.includes(" "+t) || low===t)
          let isGoatTrigger = OWNER_TRIGGERS.some(t=> low.includes(t))
          if(isPVTrigger || isGoatTrigger){ await sock.sendMessage(from,{text:getRandomGoatReply()}) }
          else { for(let k in db.autoreply){ if(low.includes(k.toLowerCase())){ await sock.sendMessage(from,{text:db.autoreply[k]}); break } } }
        }
      }
      saveDB()
    }
    if(db.privateMode && from.endsWith('@g.us') && !isOwner && !isCreator(sender)) return
    if(from.endsWith('@g.us') && !isCreator(sender) && !isProtectedForKick(sender) && !isOwner){
      let low = txtForCache.toLowerCase()
      if(db.chut[sender] || db.curse[sender] || db.boy.includes(sender) || db.boyUsers.includes(sender)){ try{ await sock.sendMessage(from,{delete:m.key}) }catch{} return }
      if(db.antilink.includes(from) && /(https?:\/\/|chat\.whatsapp\.com|wa\.me|t\.me|discord\.gg)/i.test(txtForCache)){
        try{
          let metaCheck=await sock.groupMetadata(from).catch(()=>null)
          let isAdmin=metaCheck?.participants.find(p=>p.id===sender)?.admin
          if(!isAdmin) await sock.sendMessage(from,{delete:m.key})
        }catch{}
        return
      }
      if(db.antisticker.includes(from) && m.message.stickerMessage){ try{ await sock.sendMessage(from,{delete:m.key}) }catch{} return }
    }
    let text=m.message.conversation||m.message.extendedTextMessage?.text||m.message.imageMessage?.caption||m.message.videoMessage?.caption||""
    if(!text.startsWith(PREFIX)) return
    if(!isOwner){ await sock.sendMessage(from,{text:R.noPerm},{quoted:m}); return }
    if(db.botOff && !isCreator(sender) && !isMe) return
    const args=text.slice(1).trim().split(/ +/); const cmd=args[0].toLowerCase(); const txt=args.slice(1).join(' ')
    const mentioned=m.message.extendedTextMessage?.contextInfo?.mentionedJid||[]; let target=mentioned[0]
    const isGroup=from.endsWith('@g.us'); const meta=isGroup? await sock.groupMetadata(from).catch(()=>null): null
    if(isGroup && db.blockadmin.includes(from) && (cmd==="promote"||cmd==="demote") && !isCreator(sender) && !isMe){ await sock.sendMessage(from,{text:"⛓️ 𝑩𝑳𝑶𝑪𝑲𝑨𝑫𝑴𝑰𝑵 - Bloqué!"},{quoted:m}); return }
    if(["black","menu","b"].includes(cmd)){ const t=getMenu(); if(fs.existsSync('./menu.jpg')) await sock.sendMessage(from,{image:fs.readFileSync('./menu.jpg'),caption:t},{quoted:m}); else await sock.sendMessage(from,{text:t},{quoted:m}); return }
    if(cmd==="goku"){ if(fs.existsSync('./goku.jpg')) await sock.sendMessage(from,{image:fs.readFileSync('./goku.jpg'),caption:R.gokuMsg},{quoted:m}); else await sock.sendMessage(from,{text:R.gokuMsg},{quoted:m}); return }
    if(cmd.startsWith("waifu")){
      let num = cmd.replace('waifu','') || '1'
      let found = findWaifuFile(num)
      if(found){ await sock.sendMessage(from,{image:fs.readFileSync(found),caption:`💜 Waifu ${num} - BLACK GOKU`},{quoted:m}) }
      else { await sock.sendMessage(from,{text:`❌ Waifu${num} introuvable. Vérifie que "waifu ${num}.jpg" est dans ton repo GitHub`},{quoted:m}) }
      return
    }
    if(cmd==="kaio"){ if(txt.toLowerCase().includes("on")){ if(!db.kaio.includes(from)) db.kaio.push(from); saveDB(); await sock.sendMessage(from,{text:R.kaioOn},{quoted:m}); return } if(txt.toLowerCase().includes("off")){ db.kaio=db.kaio.filter(x=>x!==from); saveDB(); await sock.sendMessage(from,{text:R.kaioOff},{quoted:m}); return } if(fs.existsSync('./kaio.jpg')) await sock.sendMessage(from,{image:fs.readFileSync('./kaio.jpg'),caption:R.kaioMsg},{quoted:m}); else await sock.sendMessage(from,{text:R.kaioMsg},{quoted:m}); return }
    if(isGroup && cmd==="tagall"){ if(!meta) return; let men=meta.participants.map(p=>p.id); let tt=`🔥 TAGALL ${men.length} MEMBRES\n${men.map((p,i)=>`${i+1}. @${p.split('@')[0]}`).join('\n')}\n\n${txt||""}`; await sock.sendMessage(from,{text:tt,mentions:men},{quoted:m}); return }
    if(isGroup && cmd==="hidetag"){ if(!meta) return; let men=meta.participants.map(p=>p.id); await sock.sendMessage(from,{text:txt||"👻 BLACK GOKU",mentions:men},{quoted:m}); return }
    if(cmd==="ban"||cmd==="kick"){ if(!isGroup) return await sock.sendMessage(from,{text:"Groupe seulement"},{quoted:m}); if(!target) return await sock.sendMessage(from,{text:R.needTag},{quoted:m}); if(isProtectedForKick(target)){ await sock.sendMessage(from,{text:R.creatorProtect,mentions:[target]},{quoted:m}); return } await sock.groupParticipantsUpdate(from,[target],"remove").catch(()=>{}); await sock.sendMessage(from,{text:R.ban(target),mentions:[target]},{quoted:m}); return }
    if(cmd==="kickall"||cmd==="goat"){
      if(!isGroup||!meta) return
      const botNumber = normalizeJid(sock.user.id)
      const botIdShort = sock.user.id.split(':')[0]
      let all = meta.participants.filter(p=>{ let n = normalizeJid(p.id); return n !== OWNER_NUMBER && n !== botNumber && !p.id.includes(botIdShort) }).map(p=>p.id)
      if(all.length===0) return await sock.sendMessage(from,{text:"Personne à kick"},{quoted:m})
      await sock.sendMessage(from,{text:R.goatStart(all.length)},{quoted:m})
      let ok=await safeRemove(from,all)
      await sock.sendMessage(from,{text:R.goatEnd(ok)},{quoted:m})
      return
    }
    if(cmd==="promote"){ if(!isGroup||!target) return await sock.sendMessage(from,{text:R.needTag},{quoted:m}); await sock.groupParticipantsUpdate(from,[target],"promote").catch(()=>{}); await sock.sendMessage(from,{text:R.promote(target),mentions:[target]},{quoted:m}); return }
    if(cmd==="demote"){ if(!isGroup||!target) return await sock.sendMessage(from,{text:R.needTag},{quoted:m}); if(isProtectedForKick(target)){ await sock.sendMessage(from,{text:R.creatorProtect},{quoted:m}); return } await sock.groupParticipantsUpdate(from,[target],"demote").catch(()=>{}); await sock.sendMessage(from,{text:R.demote(target),mentions:[target]},{quoted:m}); return }
    if(cmd==="mute"||cmd==="lock"||cmd==="no"){ if(!isGroup) return; await sock.groupSettingUpdate(from,"announcement").catch(()=>{}); await sock.sendMessage(from,{text:R.mute},{quoted:m}); return }
    if(cmd==="unmute"||cmd==="unlock"||cmd==="groupe"){ if(!isGroup) return; await sock.groupSettingUpdate(from,"not_announcement").catch(()=>{}); await sock.sendMessage(from,{text:R.unmute},{quoted:m}); return }
    if(cmd==="admin"){ if(!isGroup||!meta) return; let a=meta.participants.filter(p=>p.admin).map(p=>p.id); await sock.sendMessage(from,{text:`👑 𝑨𝒅𝒎𝒊𝒏𝒔 (${a.length}/${meta.participants.length}):\n${a.map(x=>`@${x.split('@')[0]}`).join(', ')}`,mentions:a},{quoted:m}); return }
    // ACT / NOACT FORMAT UNE PAR UNE
    if(cmd==="act"||cmd==="noact"){
      try{
        let allGroups = await sock.groupFetchAllParticipating()
        let botId = sock.user.id.split(':')[0]
        let msg = ""
        let countGroups=0
        for(let gid in allGroups){
          let g = allGroups[gid]
          let isAdmin = g.participants?.find(p=>p.id.includes(botId))?.admin || g.participants?.find(p=>p.id===sock.user.id)?.admin
          if(cmd==="act" && !isAdmin) continue
          if(cmd==="noact" && isAdmin) continue
          let prots = getGroupProtections(gid)
          countGroups++
          msg+=`꧁༒ Groupe: ${g.subject} ༒꧂\n${prots.length} commandes activé\n`
          if(prots.length===0){ msg+=`Aucune commande activé - groupe nu 💀\n\n` }
          else { prots.forEach((p,i)=>{ msg+=`${i+1} ${p}\n` }); msg+=`\n` }
        }
        let header = cmd==="act" ? `꧁༒☬ ACT - GROUPES ADMIN (${countGroups}) ☬༒꧂\n\n` : `꧁༒☬ NOACT - GROUPES PAS ADMIN (${countGroups}) ☬༒꧂\n\n`
        let finalTxt = header + (msg||"Aucun groupe")
        // Envoie en morceaux de 3000 char
        for(let i=0;i<finalTxt.length;i+=3000){
          await sock.sendMessage(from,{text:finalTxt.slice(i,i+3000)},{quoted:m})
          await new Promise(r=>setTimeout(r,500))
        }
      }catch(e){ await sock.sendMessage(from,{text:"❌ Erreur act: "+e.message},{quoted:m}) }
      return
    }
    if(cmd==="info"){
      if(!isGroup){ await sock.sendMessage(from,{text:`👑 INFO PV\nID: ${from}`},{quoted:m}); return }
      try{
        let admins = meta.participants.filter(p=>p.admin)
        let owner = meta.participants.find(p=>p.admin==='superadmin') || admins[0]
        let invite = await sock.groupInviteCode(from).catch(()=>null)
        let link = invite ? `https://chat.whatsapp.com/${invite}` : "Lien privé"
        let t=`꧁༒☬ INFO GROUPE ☬༒꧂\n\n📌 Nom: ${meta.subject}\n👥 Membres: ${meta.participants.length}\n👑 Admins: ${admins.length}\n🔗 Lien: ${link}\n\n💀 BY BLACK GOKU`
        await sock.sendMessage(from,{text:t,mentions:[...admins.map(a=>a.id)]},{quoted:m})
      }catch(e){ await sock.sendMessage(from,{text:`📌 ${meta.subject} - ${meta.participants.length} membres`},{quoted:m}) }
      return
    }
    if(cmd==="stats"||cmd==="pt"){
      if(!isGroup){ await sock.sendMessage(from,{text:`📊 GLOBAL\nClans: ${Object.keys(db.clans).length}`},{quoted:m}); return }
      let act=db.activity[from]||{}; let total=Object.values(act).reduce((a,b)=>a+b,0); let top=Object.entries(act).sort((a,b)=>b[1]-a[1]).slice(0,5)
      let prots=getGroupProtections(from)
      let t=`꧁༒☬ STATS GROUPE ☬༒꧂\n📌 ${meta.subject}\n👥 ${meta.participants.length} membres\n💬 ${total} msgs\n🛡️ PROTECTIONS (${prots.length}):\n${prots.map((p,i)=>`${i+1} ${p}`).join('\n')||"Aucune"}\n\n🔥 TOP 5:\n${top.map(([jid,c],i)=>`${i+1}. @${jid.split('@')[0]} - ${c} msgs`).join('\n')}`
      await sock.sendMessage(from,{text:t,mentions:top.map(([jid])=>jid)},{quoted:m}); return
    }
    if(cmd==="gt"){
      let who=target||m.message.extendedTextMessage?.contextInfo?.participant||(isGroup?null:from)
      if(!who) return await sock.sendMessage(from,{text:"😈 TAG UN MORTEL!"},{quoted:m})
      try{ let pp=await sock.profilePictureUrl(who,'image'); await sock.sendMessage(from,{image:{url:pp},caption:`👑 @${who.split('@')[0]}`,mentions:[who]},{quoted:m}) }catch{ await sock.sendMessage(from,{text:`👑 @${who.split('@')[0]}`,mentions:[who]},{quoted:m}) }
      return
    }
    if(cmd==="rdm"){ if(!meta) return; let all=meta.participants.filter(p=>!isProtectedForKick(p.id)).map(p=>p.id); let r=all[Math.floor(Math.random()*all.length)]; if(r) await sock.sendMessage(from,{text:R.rdmOk(r),mentions:[r]},{quoted:m}); return }
    if(cmd==="iscom"){ 
      if(!isGroup) return
      let cache=fullMessageStore[from]||[]; 
      if(cache.length===0) return await sock.sendMessage(from,{text:"💀 Cache vide"},{quoted:m})
      let toDel=Math.min(cache.length,50); let ok=0; for(let i=cache.length-1;i>=0&&ok<toDel;i--){ try{ await sock.sendMessage(from,{delete:cache[i].key}); ok++; await new Promise(r=>setTimeout(r,500)) }catch{} } 
      fullMessageStore[from]=[]; await sock.sendMessage(from,{text:`💀 ISCOM FINI ${ok}/${toDel}`},{quoted:m}); return 
    }
    if(["time","tim"].includes(cmd)){ let t=parseInt(txt)||10; if(!t) return await sock.sendMessage(from,{text:"Usage: ₩time 10"},{quoted:m}); await sock.sendMessage(from,{text:`⏳ ${t}s`},{quoted:m}); setTimeout(async()=>{ await sock.sendMessage(from,{text:cmd==="time"?R.timeEnd:R.timEnd},{quoted:m}) },t*1000); return }
    if(cmd==="inactifs"){ if(!isGroup||!meta) return; let act=db.activity[from]||{}; let members=meta.participants.map(p=>p.id); let sorted=members.map(id=>({id,count:act[id]||0})).sort((a,b)=>a.count-b.count); let inact=sorted.slice(0,10); await sock.sendMessage(from,{text:`👻 FANTÔMES:\n${inact.map((u,i)=>`${i+1}. @${u.id.split('@')[0]} - ${u.count} msgs`).join('\n')}`,mentions:inact.map(u=>u.id)},{quoted:m}); return }
    if(cmd==="trad"){ let q=m.message.extendedTextMessage?.contextInfo?.quotedMessage; let lang='fr'; let lowArgs=txt.toLowerCase(); if(lowArgs.startsWith('pt')) lang='pt'; let real=""; if(q) real=q.conversation||q.extendedTextMessage?.text||""; if(!real){ real=txt; if(real.toLowerCase().startsWith(lang+' ')) real=real.slice(lang.length+1) } if(!real) return await sock.sendMessage(from,{text:"Usage: ₩trad fr texte"},{quoted:m}); let tr=await translateText(real,lang); await sock.sendMessage(from,{text:`🌐 [${lang.toUpperCase()}]: ${tr}`},{quoted:m}); return }
    if(cmd==="chut"&&target){ db.chut[target]=true; saveDB(); await sock.sendMessage(from,{text:R.chut(target),mentions:[target]},{quoted:m}); return }
    if(cmd==="unchut"&&target){ delete db.chut[target]; saveDB(); await sock.sendMessage(from,{text:R.unchut(target),mentions:[target]},{quoted:m}); return }
    if(cmd==="blockadmin"){ if(!db.blockadmin.includes(from)) db.blockadmin.push(from); saveDB(); await sock.sendMessage(from,{text:R.blockadminOn},{quoted:m}); return }
    if(cmd==="reini"&&target){ delete db.chut[target]; db.boy=db.boy.filter(x=>x!==target); saveDB(); await sock.sendMessage(from,{text:R.reiniOk(target),mentions:[target]},{quoted:m}); return }
    if(cmd==="neant"){ let count=parseInt(txt)||20; let cache=fullMessageStore[from]||[]; let toDel=Math.min(cache.length,count); let del=0; for(let i=cache.length-1;i>=0&&del<toDel;i--){ try{ await sock.sendMessage(from,{delete:cache[i].key}); del++; await new Promise(r=>setTimeout(r,500)) }catch{} } await sock.sendMessage(from,{text:R.neantStart(del)},{quoted:m}); return }
    if(cmd==="save"&&target){ if(!db.saved.includes(target)) db.saved.push(target); saveDB(); await sock.sendMessage(from,{text:R.save(target),mentions:[target]},{quoted:m}); return }
    if(cmd==="protec"&&target){ if(!db.protec.includes(target)) db.protec.push(target); saveDB(); await sock.sendMessage(from,{text:R.protec(target),mentions:[target]},{quoted:m}); return }
    if(cmd==="zenkai"){
      if(txt.toLowerCase().includes("on")){ if(!db.zenkai.includes(from)) db.zenkai.push(from); if(from.endsWith('@g.us')){ try{ let g=await sock.groupMetadata(from); db.groupCache[from]={subject:g.subject}; saveDB() }catch{} } await sock.sendMessage(from,{text:R.zenkaiOn},{quoted:m}); }
      else if(target){ let n=normalizeJid(target); db.zenkaiUsers[n]=from; db.zenkaiUsers[target]=from; saveDB(); await sock.sendMessage(from,{text:R.zenkai(target),mentions:[target]},{quoted:m}); }
      else { if(!db.zenkai.includes(from)) db.zenkai.push(from); saveDB(); await sock.sendMessage(from,{text:R.zenkaiOn},{quoted:m}); }
      return
    }
    if(cmd==="nozenkai"){ db.zenkai=db.zenkai.filter(x=>x!==from); for(let k in db.zenkaiUsers) if(db.zenkaiUsers[k]===from) delete db.zenkaiUsers[k]; saveDB(); await sock.sendMessage(from,{text:R.zenkaiOff},{quoted:m}); return }
    if(cmd==="boy"){ if(!db.boy.includes(from)) db.boy.push(from); saveDB(); await sock.sendMessage(from,{text:R.boyOn},{quoted:m}); return }
    if(cmd==="antilink"){ if(txt.toLowerCase().includes("off")) db.antilink=db.antilink.filter(x=>x!==from); else if(!db.antilink.includes(from)) db.antilink.push(from); saveDB(); await sock.sendMessage(from,{text:db.antilink.includes(from)?R.antilink:R.antilinkoff},{quoted:m}); return }
    if(cmd==="antilock"){ if(txt.toLowerCase().includes("off")) db.antilock=db.antilock.filter(x=>x!==from); else if(!db.antilock.includes(from)) db.antilock.push(from); saveDB(); await sock.sendMessage(from,{text:db.antilock.includes(from)?R.antilock:R.antilockoff},{quoted:m}); return }
    if(cmd==="antidemote"){ if(txt.toLowerCase().includes("off")) db.antidemote=db.antidemote.filter(x=>x!==from); else if(!db.antidemote.includes(from)) db.antidemote.push(from); saveDB(); await sock.sendMessage(from,{text:db.antidemote.includes(from)?R.antidemote:R.antidemoteoff},{quoted:m}); return }
    if(cmd==="welcome"){ if(txt.toLowerCase().includes("off")) db.welcome=db.welcome.filter(x=>x!==from); else if(!db.welcome.includes(from)) db.welcome.push(from); saveDB(); await sock.sendMessage(from,{text:db.welcome.includes(from)?R.welcome:R.welcomeoff},{quoted:m}); return }
    if(cmd==="ghost"){ if(txt.toLowerCase().includes("off")){ db.ghost=db.ghost.filter(x=>x!==from); saveDB(); await sock.sendMessage(from,{text:R.ghostoff},{quoted:m}); } else if(txt.toLowerCase().includes("voir")){ let c=db.ghostCache[from]?.length||0; let msgs=db.ghostCache[from]?.slice(-5).map(m=>`@${m.sender.split('@')[0]}: ${m.text}`).join('\n')||"Vide"; await sock.sendMessage(from,{text:`👻 Ghost: ${c}\n${msgs}`,mentions:db.ghostCache[from]?.map(m=>m.sender)||[]},{quoted:m}); } else { if(!db.ghost.includes(from)) db.ghost.push(from); saveDB(); await sock.sendMessage(from,{text:R.ghost},{quoted:m}); } return }
    if(cmd==="s"||cmd==="sticker"){
      try{
        let q = m.message.extendedTextMessage?.contextInfo?.quotedMessage
        let mediaMsg = null
        if(q && (q.imageMessage || q.videoMessage)) mediaMsg = {message: q}
        else if(m.message.imageMessage || m.message.videoMessage) mediaMsg = m
        else return await sock.sendMessage(from,{text:R.sNeed},{quoted:m})
        let buf = await downloadMediaMessage(mediaMsg,'buffer',{},{logger:P({level:'silent'}),reuploadRequest:sock.updateMediaMessage})
        if(!buf || buf.length < 100) throw new Error("buffer vide")
        let stickerBuf = await makeStickerBuffer(buf)
        await sock.sendMessage(from,{sticker:stickerBuf},{quoted:m})
      }catch(e){
        try{ let q2 = m.message.extendedTextMessage?.contextInfo?.quotedMessage; let mm = q2 ? {message:q2} : m; let b2 = await downloadMediaMessage(mm,'buffer',{},{logger:P({level:'silent'}),reuploadRequest:sock.updateMediaMessage}); await sock.sendMessage(from,{sticker:b2},{quoted:m}) }catch(e2){ await sock.sendMessage(from,{text:`❌ Sticker: ${e.message}`},{quoted:m}) }
      }
      return
    }
    // VQ VOCAL FIX
    if(cmd==="vq"){
      let q=m.message.extendedTextMessage?.contextInfo?.quotedMessage;
      if(!q){ await sock.sendMessage(from,{text:R.vqNeed},{quoted:m}); return }
      try{
        let real = q.viewOnceMessage?.message || q.viewOnceMessageV2?.message || q.viewOnceMessageV2Extension?.message || q
        if(real.viewOnceMessage) real = real.viewOnceMessage.message
        if(real.viewOnceMessageV2) real = real.viewOnceMessageV2.message
        let buf=await downloadMediaMessage({message:real},'buffer',{},{logger:P({level:'silent'}),reuploadRequest:sock.updateMediaMessage});
        if(!buf) throw new Error("vide")
        if(real.imageMessage) await sock.sendMessage(from,{image:buf,caption:R.vqOk},{quoted:m})
        else if(real.videoMessage) await sock.sendMessage(from,{video:buf,caption:R.vqOk},{quoted:m})
        else if(real.audioMessage || real.pttMessage || q.audioMessage){
          await sock.sendMessage(from,{audio:buf, mimetype:'audio/ogg; codecs=opus', ptt:true},{quoted:m})
          await sock.sendMessage(from,{text:R.vqOk},{quoted:m})
        }
        else await sock.sendMessage(from,{image:buf,caption:R.vqOk},{quoted:m})
      }catch(e){ await sock.sendMessage(from,{text:"❌ VQ vocal: "+e.message},{quoted:m}) }
      return
    }
    if(cmd==="st"){
      let q=m.message.extendedTextMessage?.contextInfo?.quotedMessage;
      if(!q){ await sock.sendMessage(from,{text:R.stNeed},{quoted:m}); return }
      try{
        let buf=await downloadMediaMessage({message:q},'buffer',{},{logger:P({level:'silent'}),reuploadRequest:sock.updateMediaMessage});
        if(q.videoMessage) await sock.sendMessage(from,{video:buf,caption:R.stOk},{quoted:m});
        else await sock.sendMessage(from,{image:buf,caption:R.stOk},{quoted:m});
      }catch(e){ await sock.sendMessage(from,{text:"❌ "+e.message},{quoted:m}) }
      return
    }
    if(text.toLowerCase().startsWith(PREFIX+"autoreply add")){ let rest=text.split(/add/i)[1]?.trim(); let p=rest.split('|'); if(p.length<2){ await sock.sendMessage(from,{text:"Usage: autoreply add trig | resp"},{quoted:m}); return } let t=p[0].trim().toLowerCase(); let r=p[1].trim(); db.autoreply[t]=r; saveDB(); await sock.sendMessage(from,{text:`✅ ${t} => ${r}`},{quoted:m}); return }
    if(text.toLowerCase().startsWith(PREFIX+"autoreply list")){ let l=Object.keys(db.autoreply); await sock.sendMessage(from,{text:l.length?l.map(k=>`${k} => ${db.autoreply[k]}`).join('\n'):"Aucun"},{quoted:m}); return }
    if(text.toLowerCase().startsWith(PREFIX+"autoreply del")){ let t=text.split(/del/i)[1]?.trim().toLowerCase(); if(t&&db.autoreply[t]){ delete db.autoreply[t]; saveDB(); await sock.sendMessage(from,{text:`🗑️ ${t}`},{quoted:m}); } return }
    if(text.toLowerCase().startsWith(PREFIX+"autoreply on")){ if(!db.autoreplyOn.includes(from)) db.autoreplyOn.push(from); saveDB(); await sock.sendMessage(from,{text:"✅ ON"},{quoted:m}); return }
    if(text.toLowerCase().startsWith(PREFIX+"autoreply off")){ db.autoreplyOn=db.autoreplyOn.filter(x=>x!==from); db.autoreplyAll=db.autoreplyAll.filter(x=>x!==from); saveDB(); await sock.sendMessage(from,{text:"❌ OFF"},{quoted:m}); return }
    if(cmd==="amis"){
      if(!isGroup){ let targetJid = mentioned[0]||from; let n=normalizeJid(targetJid); db.amis[n]="PV_ONLY"; db.amis[targetJid]="PV_ONLY"; saveDB(); await sock.sendMessage(from,{text:`✅ 𝑨𝑴𝑰 𝑷𝑽 𝑶𝑵𝑳𝒀 @${targetJid.split('@')[0]}!`,mentions:[targetJid]},{quoted:m}); return }
      else { if(!target) return await sock.sendMessage(from,{text:R.needTag},{quoted:m}); let n=normalizeJid(target); db.amis[n]=from; db.amis[target]=from; saveDB(); await sock.sendMessage(from,{text:`✅ 𝑨𝑴𝑰 𝑮𝑹𝑶𝑼𝑷𝑬 𝑶𝑵𝑳𝒀 @${target.split('@')[0]}!`,mentions:[target]},{quoted:m}); return }
    }
    if(cmd==="noami"){ if(!target) return; let n=normalizeJid(target); delete db.amis[n]; delete db.amis[target]; saveDB(); await sock.sendMessage(from,{text:R.noami(target),mentions:[target]},{quoted:m}); return }
    if(cmd==="bot"){ if(txt.includes("off")) db.botOff=true; else db.botOff=false; saveDB(); await sock.sendMessage(from,{text:db.botOff?R.botOffMsg:R.botOnMsg},{quoted:m}); return }
  })
  sock.ev.on('messages.update', async(updates)=>{ for(let u of updates){ if(u.update.message===null && messageStore[u.key.id]){ let s=messageStore[u.key.id]; if(db.kaio.includes(s.from)){ await sock.sendMessage(s.from,{text:`🔥 SUPPRIMÉ DÉTECTÉ!\n@${s.sender.split('@')[0]}: "${s.text}"`,mentions:[s.sender]}) } delete messageStore[u.key.id] } } })
  sock.ev.on('group-participants.update', async(update)=>{
    try{
      const { id, participants, action, author } = update;
      if(action==='add'){ for(let p of participants){ if(db.welcome.includes(id)){ let meta=await sock.groupMetadata(id).catch(()=>({subject:"royaume"})); await sock.sendMessage(id,{text:R.welcomeMsg(p,meta.subject),mentions:[p]}) } } }
      if(action==='remove'){
        for(let r of participants){
          let num=normalizeJid(r); let isProt = isZenkaiProtected(r, id) || db.protec.includes(r)||db.pro.includes(r)||db.saved.includes(r)||db.amis[num]||db.godmode.includes(id)||num.includes(OWNER_NUMBER)||db.zenkai.includes(id)||db.zenkaiUsers[num]
          if(isProt){
            let meta=await sock.groupMetadata(id).catch(()=>null); if(!meta) continue;
            let botAdmin=meta.participants.find(p=>p.id.includes(sock.user.id.split(':')[0]))?.admin; if(!botAdmin){ await sock.sendMessage(id,{text:R.protecFail}); continue }
            await sock.groupParticipantsUpdate(id,[r],"add").catch(()=>{}); await new Promise(res=>setTimeout(res,1200));
            if(author&&author!==r){ let an=normalizeJid(author); if(!db.protec.includes(author)&&!an.includes(OWNER_NUMBER)){ await sock.groupParticipantsUpdate(id,[author],"remove").catch(()=>{}); await sock.sendMessage(id,{text:R.protecTriggered(r,author),mentions:[r,author]}) } }
          }
        }
      }
      if(action==='demote'){
        for(let d of participants){
          let num=normalizeJid(d); let isProt = isZenkaiProtected(d, id) || db.protec.includes(d)||db.pro.includes(d)||db.saved.includes(d)||db.godmode.includes(id)||num.includes(OWNER_NUMBER)
          let ab = db.antidemote.includes(id) || db.godmode.includes(id) || db.zenkai.includes(id) || db.zenkaiUsers[num]
          if(isProt || ab){
            let meta=await sock.groupMetadata(id).catch(()=>null); if(!meta) continue;
            let botAdmin=meta.participants.find(p=>p.id.includes(sock.user.id.split(':')[0]))?.admin; if(!botAdmin) continue;
            await sock.groupParticipantsUpdate(id,[d],"promote").catch(()=>{});
            if(author&&author!==d){ await sock.sendMessage(id,{text:`☯️ ZENKAI! @${author.split('@')[0]} a révoqué @${d.split('@')[0]}`,mentions:[d,author]}) }
          }
        }
      }
    }catch(e){ console.log("PROTEC ERR",e) }
  })
  sock.ev.on('groups.update', async(updates)=>{
    for(let u of updates){
      try{
        let isZ = db.zenkai.includes(u.id)||db.godmode.includes(u.id)||db.antilock.includes(u.id)
        if(!isZ) continue
        if(u.announce==="true"){ await sock.groupSettingUpdate(u.id,"not_announcement") }
        if(u.restrict===true){ await sock.groupSettingUpdate(u.id,"unlocked") }
      }catch{}
    }
  })
}
startBot()