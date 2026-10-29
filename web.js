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
let db = { amis:{}, saved:[], pro:[], protec:[], chut:{}, blockadmin:[], godmode:[], kaio:[], antilink:[], antisticker:[], antistatus:[], welcome:[], pt:[], ghost:[], muted:[], ghostCache:{}, antibod:{}, curse:{}, antilock:[], antidemote:[], clans:{}, autoreply:{}, autoreplyOn:[], autoreplyAll:[], zenkai:[], zenkaiUsers:{}, boy:[], boyUsers:[], privateMode:false, botOff:false, activity:{} }
if(fs.existsSync(DB_FILE)){ try{ let o=JSON.parse(fs.readFileSync(DB_FILE)); db={...db,...o} }catch{} }
const saveDB = ()=>fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2))
let sock, status="Demarrage...", lastCode="pas encore", latestQR=null, BOT_START=Date.now()
let messageStore = {}
let fullMessageStore = {}
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
┃ ₩𝒊𝒏𝒂𝒄𝒕𝒊𝒇𝒔
┃ ₩𝒕𝒓𝒂𝒅
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
*₩𝑪𝑹ÉÉ 𝑷𝑨𝑹 𝑻𝑯𝑬 𝑮𝑶𝑨𝑻 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼₩*`;
const R = { 
  noPerm:"꧁༒☬ 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 ☬༒꧂\n\n😈 𝑴𝑶𝑹𝑻𝑬𝑳 𝑰𝑵𝑺𝑶𝑳𝑬𝑵𝑻...\n𝑻𝒖 𝒐𝒔𝒆𝒔 𝒊𝒏𝒗𝒐𝒒𝒖𝒆𝒓 𝒍𝒆 𝑫𝑰𝑬𝑼 𝑫𝑬 𝑳𝑨 𝑫𝑬𝑺𝑻𝑹𝑼𝑪𝑻𝑰𝑶𝑵 𝒔𝒂𝒏𝒔 𝒎𝒐𝒏 𝒔𝒄𝒆𝒂𝒖?\n\n👑 𝑺𝒆𝒖𝒍𝒔 𝒎𝒆𝒔 É𝑳𝑼𝑺 𝒑𝒆𝒖𝒗𝒆𝒏𝒕 𝒑𝒓𝒐𝒏𝒐𝒏𝒄𝒆𝒓 𝒍𝒆 ₩.\n💀 𝑨𝒈𝒆𝒏𝒐𝒖𝒊𝒍𝒍𝒆-𝒕𝒐𝒊, 𝒂𝒕𝒕𝒆𝒏𝒅𝒔 𝒒𝒖𝒆 𝑻𝑯𝑬 𝑮𝑶𝑨𝑻 𝒕𝒆 𝒋𝒖𝒈𝒆 𝒅𝒊𝒈𝒏𝒆.",
  needTag:"😈 𝑻𝑨𝑮 𝑼𝑵 𝑴𝑶𝑹𝑻𝑬𝑳!", creatorProtect:"👑🔥 𝑰𝑴𝑷𝑶𝑺𝑺𝑰𝑩𝑳𝑬 𝑫𝑬 𝑻𝑶𝑼𝑪𝑯𝑬𝑹 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼!", ban:(j)=>`💀 𝑯𝑨𝑲𝑨𝑰! @${j.split('@')[0]} 𝒆𝒇𝒇𝒂𝒄é!`, promote:(j)=>`👑 @${j.split('@')[0]} é𝒍𝒆𝒗é 𝑫𝒊𝒆𝒖!`, demote:(j)=>`💔 @${j.split('@')[0]} 𝒅é𝒄𝒉𝒖!`, mute:"🤫 𝑺𝑰𝑳𝑬𝑵𝑪𝑬 𝑨𝑩𝑺𝑶𝑳𝑼!", unmute:"🔊 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 𝒗𝒐𝒖𝒔 𝒂𝒖𝒕𝒐𝒓𝒊𝒔𝒆!", chut:(j)=>`🔇 @${j.split('@')[0]} 𝒄𝒐𝒏𝒅𝒂𝒎𝒏é!`, unchut:(j)=>`🔓 @${j.split('@')[0]} 𝒔𝒆𝒄𝒐𝒏𝒅𝒆 𝒄𝒉𝒂𝒏𝒄𝒆!`, blockadminOn:"⛓️ 𝑩𝑳𝑶𝑪𝑲𝑨𝑫𝑴𝑰𝑵 𝑶𝑵!", blockadminOff:"🔓 𝑶𝑭𝑭", curseOn:(j)=>`☬ @${j.split('@')[0]} 𝒎𝒂𝒖𝒅𝒊𝒕!`, curseOff:(j)=>`𝑳𝒆𝒗é𝒆 @${j.split('@')[0]}`, reiniOk:(j)=>`♻️ @${j.split('@')[0]} 𝒓é𝒊𝒏𝒊𝒕𝒊𝒂𝒍𝒊𝒔é!`, neantStart:(c)=>`💀 ${c} 𝒎𝒔𝒈𝒔 𝒆𝒇𝒇𝒂𝒄é𝒔!`, goatStart:(n)=>`🔥 ${n} 𝑭𝑨𝑰𝑩𝑳𝑬𝑺!`, goatEnd:(n)=>`💀 ${n} 𝑬𝑭𝑭𝑨𝑪É𝑺!`, save:(j)=>`🛡️ @${j.split('@')[0]} 𝒎𝒂𝒓𝒒𝒖é!`, unsave:(j)=>`🛡️ 𝑴𝒂𝒓𝒒𝒖𝒆 𝒓𝒆𝒕𝒊𝒓é𝒆 @${j.split('@')[0]}.`, protec:(j)=>`👑🔥 𝑷𝑹𝑶𝑻𝑬𝑪 @${j.split('@')[0]}!`, unprotec:(j)=>`💀 𝑷𝑹𝑶𝑻𝑬𝑪 𝒓𝒆𝒕𝒊𝒓é𝒆 @${j.split('@')[0]}.`, zenkai:(j)=>`⚡ @${j.split('@')[0]} 𝒁𝑬𝑵𝑲𝑨𝑰.`, nozenkai:(j)=>`𝒁𝑬𝑵𝑲𝑨𝑰 𝒓𝒆𝒕𝒊𝒓é.`, zenkaiOn:"⚡ 𝒁𝑬𝑵𝑲𝑨𝑰 𝑶𝑵", zenkaiOff:"𝒁𝑬𝑵𝑲𝑨𝑰 𝑶𝑭𝑭", antilink:"🔗 𝑨𝑵𝑻𝑰𝑳𝑰𝑵𝑲 𝑶𝑵", antilinkoff:"𝑶𝑭𝑭", antibodOn:(m)=>`𝑨𝑵𝑻𝑰𝑩𝑶𝑫 ${m} 𝑶𝑵`, antibodOff:"𝑶𝑭𝑭", antilock:"𝑨𝑵𝑻𝑰𝑳𝑶𝑪𝑲 𝑶𝑵", antilockoff:"𝑶𝑭𝑭", antidemote:"𝑨𝑵𝑻𝑰𝑫𝑬𝑴𝑶𝑻𝑬 𝑶𝑵", antidemoteoff:"𝑶𝑭𝑭", antisticker:"🖼️ 𝑨𝑵𝑻𝑰𝑺𝑻𝑰𝑪𝑲𝑬𝑹 𝑶𝑵", antistickeroff:"𝑶𝑭𝑭", antistatus:"👁️ 𝑨𝑵𝑻𝑰𝑺𝑻𝑨𝑻𝑼𝑺 𝑶𝑵", antistatusoff:"𝑶𝑭𝑭", welcome:"👋 𝑾𝑬𝑳𝑪𝑶𝑴𝑬 𝑶𝑵", welcomeoff:"𝑶𝑭𝑭", ghost:"👻 𝑮𝑯𝑶𝑺𝑻 𝑶𝑵", ghostoff:"𝑶𝑭𝑭", boyOn:"💀 𝑩𝑶𝒀 𝑶𝑵", boyOff:"𝑶𝑭𝑭", amis:(j)=>`✅ 𝑨𝑴𝑰 @${j.split('@')[0]}!`, noami:(j)=>`❌ 𝑩𝑨𝑵𝑵𝑰 @${j.split('@')[0]}!`, botOffMsg:"💤 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 𝑺'𝑬𝑵𝑫𝑶𝑹𝑻...", botOnMsg:"🤖🔥 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 𝑺𝑬 𝑹É𝑽𝑬𝑰𝑳𝑳𝑬!", privateOn:"🔒 𝑷𝑹𝑰𝑽É 𝑶𝑵", privateOff:"𝑶𝑭𝑭", gokuMsg:"👑 𝑪'𝒆𝒔𝒕 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼, 𝒗𝒐𝒕𝒓𝒆 𝑫𝒊𝒆𝒖.", kaioMsg:"🔥 𝑪'𝒆𝒔𝒕 𝑲𝑨𝑰𝑶.", kaioOn:"🔥 𝑲𝑨𝑰𝑶 𝑶𝑵 - Je vois tout!", kaioOff:"𝑲𝑨𝑰𝑶 𝑶𝑭𝑭", vqOk:"👁️🔥 𝑽𝑼𝑬 𝑫É𝑽𝑶𝑰𝑳É𝑬!", vqNeed:"😈 𝑹é𝒑𝒐𝒏𝒅𝒔 à 𝒖𝒏𝒆 𝒗𝒖𝒆 𝒖𝒏𝒊𝒒𝒖𝒆!", sNeed:"😈 𝑹é𝒑𝒐𝒏𝒅𝒔 𝒊𝒎𝒂𝒈𝒆!", stNeed:"😈 𝑹é𝒑𝒐𝒏𝒅𝒔 𝒔𝒕𝒂𝒕𝒖𝒕!", stOk:"👁️ 𝑺𝒕𝒂𝒕𝒖𝒕 𝒗𝒐𝒍é", rdmOk:(j)=>`🎲 @${j.split('@')[0]}!`, timeEnd:"⏰ 𝑻𝑰𝑴𝑬 𝑭𝑰𝑵𝑰!", timEnd:"⏰ 𝑻𝑰𝑴 𝑭𝑰𝑵𝑰!", onlyOwner:"👑🔥 𝑺𝑬𝑼𝑳 𝑳𝑬 𝑫𝑰𝑬𝑼 𝑺𝑼𝑷𝑹Ê𝑴𝑬!", protecTriggered:(prot, att)=>`☯️🔥 𝑷𝑹𝑶𝑻𝑬𝑪! @${att.split('@')[0]} 𝒂 𝒃𝒂𝒏𝒏𝒊 @${prot.split('@')[0]}!`, protecDemote:(prot, att)=>`☯️ 𝑨𝑵𝑻𝑰-𝑫𝑬𝑴𝑶𝑻𝑬! @${att.split('@')[0]} 𝒂 𝒅𝒆𝒎𝒐𝒕𝒆 @${prot.split('@')[0]}!`, protecFail:"⚠️ 𝑴𝑬𝑻𝑻𝑬𝒁 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 𝑨𝑫𝑴𝑰𝑵!", godmode:"☯️ 𝑮𝑶𝑫𝑴𝑶𝑫𝑬 𝑶𝑵", godmodeoff:"𝑶𝑭𝑭", welcomeMsg:(j, g)=>`꧁༒☬ 𝑩𝑰𝑬𝑵𝑽𝑬𝑵𝑼𝑬 ☬༒꧂\n👑 @${j.split('@')[0]} 𝒅𝒂𝒏𝒔 *${g}*.\n*𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼* 💀🔥`,
}
function normalizeJid(jid){ return jid? jid.split(':')[0].split('@')[0].replace(/[^0-9]/g,'') : "" }
function isCreator(jid){ return normalizeJid(jid)===OWNER_NUMBER }
function isProtectedForKick(jid){ return isCreator(jid) || db.saved.includes(jid) || db.protec.includes(jid) || db.pro.includes(jid) || db.godmode.includes(jid) || db.saved.includes(normalizeJid(jid)) || db.protec.includes(normalizeJid(jid)); }
async function askHyper(q){ try{ let r=await axios.get(`https://text.pollinations.ai/${encodeURIComponent(q)}`,{timeout:20000}); return typeof r.data==='string'?r.data.trim():JSON.stringify(r.data) }catch{ return "𝑰𝑨 𝒊𝒏𝒅𝒊𝒔𝒑𝒐𝒏𝒊𝒃𝒍𝒆" } }
async function safeRemove(gid, jids){ let ok=0; for(let j of jids){ try{ await sock.groupParticipantsUpdate(gid,[j],"remove"); ok++; await new Promise(r=>setTimeout(r,1200)); }catch{} } return ok; }
async function translateText(text, to='fr'){ try{ let r=await axios.get(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=auto|${to}`,{timeout:8000}); return r.data.responseData.translatedText||text }catch{ return text } }
app.get('/', (req,res)=> res.send(`<h1>${status}</h1><p>CODE:${lastCode}</p><a href="/pair?num=${OWNER_NUMBER}">PAIR</a> | <a href="/qr">QR</a> | <a href="/clear">CLEAR</a>`))
app.get('/clear', (req,res)=>{ try{ if(fs.existsSync('auth2')) fs.rmSync('auth2',{recursive:true,force:true}); latestQR=null; messageStore={}; fullMessageStore={}; res.send('CLEAR OK') }catch(e){ res.send(e.message) } })
app.get('/pair', async(req,res)=>{ if(!sock) return res.send('Bot demarre... attends 10s et refresh'); let num=(req.query.num||'').replace(/[^0-9]/g,'')||OWNER_NUMBER; try{ let code=await sock.requestPairingCode(num); lastCode=code; res.send(`<h1 style="font-size:60px">${code}</h1>`) }catch(e){ res.send('Erreur: '+e.message) } })
app.get('/qr', async(req,res)=>{ if(!latestQR) return res.send('Pas de QR'); try{ const QRCode=require('qrcode'); const dataUrl=await QRCode.toDataURL(latestQR); res.send(`<img src="${dataUrl}" style="width:300px">`) }catch(e){ res.send(e.message) } })
app.listen(PORT,'0.0.0.0',()=>console.log("BLACK GOKU V73 100% LIVE "+PORT))
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
    const senderNum=normalizeJid(sender); const isMe=m.key.fromMe; const isOwner=isMe||senderNum.includes(OWNER_NUMBER)||db.amis[senderNum]||db.amis[sender]
    if(from.endsWith('@g.us') && txtForCache){
      if(!db.activity[from]) db.activity[from]={}
      db.activity[from][sender]=(db.activity[from][sender]||0)+1
      if(!fullMessageStore[from]) fullMessageStore[from]=[]
      fullMessageStore[from].push({key:m.key, text:txtForCache, time:Date.now()})
      if(fullMessageStore[from].length>200) fullMessageStore[from].shift()
      if(db.kaio.includes(from)) messageStore[m.key.id]={text:txtForCache,sender,from,id:m.key.id}
      if(db.ghost.includes(from)){ if(!db.ghostCache[from]) db.ghostCache[from]=[]; db.ghostCache[from].push({sender,text:txtForCache,time:Date.now()}); if(db.ghostCache[from].length>500) db.ghostCache[from].shift(); saveDB(); }
      if(!textAll.startsWith(PREFIX)){ let en = db.autoreplyOn.includes(from) || db.autoreplyAll.includes(from) || db.autoreplyAll.includes('all'); if(en){ let low=textAll.toLowerCase(); for(let k in db.autoreply){ if(low.includes(k.toLowerCase())){ await sock.sendMessage(from,{text:db.autoreply[k]}); break; } } } }
      saveDB()
    }
    if(db.privateMode && from.endsWith('@g.us') && !isOwner && !isCreator(sender)) return
    if(from.endsWith('@g.us') && !isCreator(sender) && !isProtectedForKick(sender) && !isOwner){
      let low = txtForCache.toLowerCase()
      if(db.chut[sender] || db.curse[sender] || db.boy.includes(sender) || db.boyUsers.includes(sender)){ try{ await sock.sendMessage(from,{delete:m.key}) }catch{} return }
      if(db.antilink.includes(from) && /(https?:\/\/|chat\.whatsapp\.com|wa\.me|t\.me|discord\.gg)/i.test(txtForCache)){ try{ await sock.sendMessage(from,{delete:m.key}) }catch{} return }
      if(db.antisticker.includes(from) && m.message.stickerMessage){ try{ await sock.sendMessage(from,{delete:m.key}) }catch{} return }
      if(db.antistatus.includes(from) && (low.includes("status") || m.message.protocolMessage)){ try{ await sock.sendMessage(from,{delete:m.key}) }catch{} return }
      if(db.antibod[from] && (low.includes("bot") || m.message.listResponseMessage || m.message.buttonsResponseMessage || low.startsWith("/") || low.startsWith("!") || low.startsWith("."))){ try{ await sock.sendMessage(from,{delete:m.key}) }catch{} return }
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
    if(cmd==="kaio"){ if(txt.toLowerCase().includes("on")){ if(!db.kaio.includes(from)) db.kaio.push(from); saveDB(); await sock.sendMessage(from,{text:R.kaioOn},{quoted:m}); return } if(txt.toLowerCase().includes("off")){ db.kaio=db.kaio.filter(x=>x!==from); saveDB(); await sock.sendMessage(from,{text:R.kaioOff},{quoted:m}); return } if(fs.existsSync('./kaio.jpg')) await sock.sendMessage(from,{image:fs.readFileSync('./kaio.jpg'),caption:R.kaioMsg},{quoted:m}); else await sock.sendMessage(from,{text:R.kaioMsg},{quoted:m}); return }
    if(isGroup && cmd==="tagall"){ let men=meta.participants.map(p=>p.id); let tt=`🔥 ${men.map((p,i)=>`${i+1}. @${p.split('@')[0]}`).join('\n')}\n\n${txt||""}`; await sock.sendMessage(from,{text:tt,mentions:men},{quoted:m}); return }
    if(isGroup && cmd==="hidetag"){ let men=meta.participants.map(p=>p.id); await sock.sendMessage(from,{text:txt||"👻",mentions:men},{quoted:m}); return }
    if(cmd==="ban"||cmd==="kick"){ if(!target) return await sock.sendMessage(from,{text:R.needTag},{quoted:m}); if(isProtectedForKick(target)){ await sock.sendMessage(from,{text:R.creatorProtect,mentions:[target]},{quoted:m}); return } await sock.groupParticipantsUpdate(from,[target],"remove").catch(()=>{}); await sock.sendMessage(from,{text:R.ban(target),mentions:[target]},{quoted:m}); return }
    if(cmd==="kickall"||cmd==="goat"){ let all=meta?.participants.filter(p=>!isProtectedForKick(p.id)&&normalizeJid(p.id)!==normalizeJid(sock.user?.id)).map(p=>p.id)||[]; await sock.sendMessage(from,{text:R.goatStart(all.length)},{quoted:m}); let ok=await safeRemove(from,all); await sock.sendMessage(from,{text:R.goatEnd(ok)},{quoted:m}); return }
    if(cmd==="promote"){ if(!target) return; await sock.groupParticipantsUpdate(from,[target],"promote").catch(()=>{}); await sock.sendMessage(from,{text:R.promote(target),mentions:[target]},{quoted:m}); return }
    if(cmd==="demote"){ if(!target) return; if(isProtectedForKick(target)){ await sock.sendMessage(from,{text:R.creatorProtect},{quoted:m}); return } await sock.groupParticipantsUpdate(from,[target],"demote").catch(()=>{}); await sock.sendMessage(from,{text:R.demote(target),mentions:[target]},{quoted:m}); return }
    if(cmd==="mute"||cmd==="lock"||cmd==="no"){ await sock.groupSettingUpdate(from,"announcement").catch(()=>{}); await sock.sendMessage(from,{text:R.mute},{quoted:m}); return }
    if(cmd==="unmute"||cmd==="unlock"||cmd==="groupe"){ await sock.groupSettingUpdate(from,"not_announcement").catch(()=>{}); await sock.sendMessage(from,{text:R.unmute},{quoted:m}); return }
    if(cmd==="admin"&&meta){ let a=meta.participants.filter(p=>p.admin).map(p=>p.id); await sock.sendMessage(from,{text:`👑 𝑨𝒅𝒎𝒊𝒏𝒔: ${a.map(x=>`@${x.split('@')[0]}`).join(', ')}`,mentions:a},{quoted:m}); return }
    if(cmd==="info"&&meta){ await sock.sendMessage(from,{text:`📌 ${meta.subject}\n👥 ${meta.participants.length}`},{quoted:m}); return }
    if(cmd==="stats"&&meta){ await sock.sendMessage(from,{text:`📊 𝑪𝒍𝒂𝒏𝒔:${Object.keys(db.clans).length}`},{quoted:m}); return }
    if(cmd==="gt"){ if(!target){ await sock.sendMessage(from,{text:"😈 𝑻𝑨𝑮 𝑼𝑵 𝑴𝑶𝑹𝑻𝑬𝑳!\nEx: ₩gt @user"},{quoted:m}); return } try{ let url=await sock.profilePictureUrl(target,'image'); await sock.sendMessage(from,{image:{url},caption:`👑 @${target.split('@')[0]}`,mentions:[target]},{quoted:m}) }catch{ await sock.sendMessage(from,{text:"❌ Pas de pp"},{quoted:m}) } return }
    if(cmd==="rdm"){ let all=meta?.participants.filter(p=>!isProtectedForKick(p.id)).map(p=>p.id)||[]; let r=all[Math.floor(Math.random()*all.length)]; if(r) await sock.sendMessage(from,{text:R.rdmOk(r),mentions:[r]},{quoted:m}); return }
    if(cmd==="iscom"){ let cache=fullMessageStore[from]||[]; let toDel=Math.min(cache.length,50); await sock.sendMessage(from,{text:`💀 ISCOM ${toDel} msgs...`},{quoted:m}); let ok=0; for(let i=cache.length-1;i>=0&&ok<toDel;i--){ try{ await sock.sendMessage(from,{delete:cache[i].key}); ok++; await new Promise(r=>setTimeout(r,500)) }catch{} } fullMessageStore[from]=[]; await sock.sendMessage(from,{text:`💀 ISCOM FINI ${ok}`},{quoted:m}); return }
    if(["time","tim"].includes(cmd)){ let t=parseInt(txt)||10; await sock.sendMessage(from,{text:`⏳ ${t}s`},{quoted:m}); setTimeout(async()=>{ await sock.sendMessage(from,{text:cmd==="time"?R.timeEnd:R.timEnd},{quoted:m}) },t*1000); return }
    // COMMANDE 2 - INACTIFS - SEUL LE BOT PEUT FAIRE
    if(cmd==="inactifs"||cmd==="fantomes"||cmd==="ghostlist"){
      if(!isGroup) return
      let act=db.activity[from]||{}
      let members=meta.participants.map(p=>p.id)
      let sorted=members.map(id=>({id, count:act[id]||0})).sort((a,b)=>a.count-b.count)
      let inactifs=sorted.slice(0,10)
      let text=`👻 𝑭𝑨𝑵𝑻Ô𝑴𝑬𝑺 𝑫𝑼 𝑮𝑹𝑶𝑼𝑷𝑬 👻\n\nLes 10 qui ne parlent JAMAIS:\n\n${inactifs.map((u,i)=>`${i+1}. @${u.id.split('@')[0]} - ${u.count} msgs`).join('\n')}\n\n💀 𝑩𝑳𝑨𝑪𝑲 𝑮𝑶𝑲𝑼 𝒂 𝒕𝒐𝒖𝒕 𝒗𝒖!`
      await sock.sendMessage(from,{text,mentions:inactifs.map(u=>u.id)},{quoted:m})
      return
    }
    // COMMANDE 5 - TRAD - TRADUCTION INSTANT
    if(cmd==="trad"||cmd==="translate"){
      let q=m.message.extendedTextMessage?.contextInfo?.quotedMessage
      let toTrad=q? (q.conversation||q.extendedTextMessage?.text||"") : txt
      let lang=args[0]?.length==2? args[0] : 'fr'
      let realText = q? (q.conversation||q.extendedTextMessage?.text||"") : args.slice(lang.length==2?1:0).join(' ')
      if(!realText){ await sock.sendMessage(from,{text:"😈 Réponds à un message avec ₩trad fr / en / pt / es"},{quoted:m}); return }
      let translated=await translateText(realText, lang)
      await sock.sendMessage(from,{text:`🌐 𝑻𝑹𝑨𝑫 [${lang.toUpperCase()}]:\n\n${translated}`},{quoted:m})
      return
    }
    if(cmd==="chut"&&target){ db.chut[target]=true; saveDB(); await sock.sendMessage(from,{text:R.chut(target),mentions:[target]},{quoted:m}); return }
    if(cmd==="unchut"&&target){ delete db.chut[target]; saveDB(); await sock.sendMessage(from,{text:R.unchut(target),mentions:[target]},{quoted:m}); return }
    if(cmd==="blockadmin"){ if(!target){ if(!db.blockadmin.includes(from)) db.blockadmin.push(from); saveDB(); await sock.sendMessage(from,{text:R.blockadminOn},{quoted:m}); } else { if(!db.blockadmin.includes(target)) db.blockadmin.push(target); saveDB(); await sock.sendMessage(from,{text:R.blockadminOn,mentions:[target]},{quoted:m}); } return }
    if(cmd==="unblockadmin"){ if(!target){ db.blockadmin=db.blockadmin.filter(x=>x!==from); saveDB(); await sock.sendMessage(from,{text:R.blockadminOff},{quoted:m}); } else { db.blockadmin=db.blockadmin.filter(x=>x!==target); saveDB(); await sock.sendMessage(from,{text:R.blockadminOff},{quoted:m}); } return }
    if(cmd==="curse"&&target){ db.curse[target]=true; saveDB(); await sock.sendMessage(from,{text:R.curseOn(target),mentions:[target]},{quoted:m}); return }
    if(cmd==="uncurse"&&target){ delete db.curse[target]; saveDB(); await sock.sendMessage(from,{text:R.curseOff(target),mentions:[target]},{quoted:m}); return }
    if(cmd==="reini"&&target){ delete db.chut[target]; delete db.curse[target]; db.boy=db.boy.filter(x=>x!==target); db.boyUsers=db.boyUsers.filter(x=>x!==target); saveDB(); await sock.sendMessage(from,{text:R.reiniOk(target),mentions:[target]},{quoted:m}); return }
    if(cmd==="neant"){ let count=parseInt(txt)||20; let cache=fullMessageStore[from]||[]; let toDel=Math.min(cache.length,count); let del=0; for(let i=cache.length-1;i>=0&&del<toDel;i--){ try{ await sock.sendMessage(from,{delete:cache[i].key}); del++; await new Promise(r=>setTimeout(r,500)) }catch{} } await sock.sendMessage(from,{text:R.neantStart(del)},{quoted:m}); return }
    if(text.toLowerCase().startsWith(PREFIX+"crée clan")||text.toLowerCase().startsWith(PREFIX+"cree clan")){ let n=text.split(/clan/i)[1]?.trim(); if(!n){ await sock.sendMessage(from,{text:"Usage: ₩crée clan <nom>"},{quoted:m}); return } if(db.clans[n]){ await sock.sendMessage(from,{text:`Existe déjà`},{quoted:m}); return } db.clans[n]={owner:senderNum,members:[],created:Date.now()}; saveDB(); await sock.sendMessage(from,{text:`✅ Clan ${n} créé`},{quoted:m}); return }
    if(cmd==="ajouter"){ let cn=txt.split(' ').pop(); if(!target||!cn){ await sock.sendMessage(from,{text:"Usage: ₩ajouter @user clan"},{quoted:m}); return } if(!db.clans[cn]){ await sock.sendMessage(from,{text:"Clan inexistant"},{quoted:m}); return } let nid=normalizeJid(target); if(!db.clans[cn].members.includes(nid)) db.clans[cn].members.push(nid); saveDB(); await sock.sendMessage(from,{text:`✅ @${target.split('@')[0]} ajouté à ${cn}`,mentions:[target]},{quoted:m}); return }
    if(cmd==="retirer"){ let cn=txt.split(' ').pop(); if(!target||!cn) return; if(!db.clans[cn]) return; let nid=normalizeJid(target); db.clans[cn].members=db.clans[cn].members.filter(x=>x!==nid); saveDB(); await sock.sendMessage(from,{text:`✅ retiré`},{quoted:m}); return }
    if(text.toLowerCase().startsWith(PREFIX+"clan list")||(cmd==="clan"&&txt.includes("list"))){ let l=Object.keys(db.clans); await sock.sendMessage(from,{text:l.length?`Clans: ${l.join(', ')}`:"Aucun clan"},{quoted:m}); return }
    if(text.toLowerCase().startsWith(PREFIX+"clan info")){ let cn=text.split(/info/i)[1]?.trim(); let c=db.clans[cn]; if(!c){ await sock.sendMessage(from,{text:"Inexistant"},{quoted:m}); return } await sock.sendMessage(from,{text:`${cn} owner:${c.owner} membres:${c.members.length}`},{quoted:m}); return }
    if(text.toLowerCase().startsWith(PREFIX+"supprimer clan")){ let cn=text.split(/clan/i)[1]?.trim(); if(db.clans[cn]){ delete db.clans[cn]; saveDB(); await sock.sendMessage(from,{text:`🗑️ ${cn} supprimé`},{quoted:m}); } return }
    if(cmd==="save"&&target){ if(!db.saved.includes(target)) db.saved.push(target); saveDB(); await sock.sendMessage(from,{text:R.save(target),mentions:[target]},{quoted:m}); return }
    if(cmd==="unsave"&&target){ db.saved=db.saved.filter(x=>x!==target); saveDB(); await sock.sendMessage(from,{text:R.unsave(target),mentions:[target]},{quoted:m}); return }
    if(cmd==="protec"&&target){ if(!db.protec.includes(target)) db.protec.push(target); saveDB(); await sock.sendMessage(from,{text:R.protec(target),mentions:[target]},{quoted:m}); return }
    if((cmd==="unprotect"||cmd==="unprotec")&&target){ db.protec=db.protec.filter(x=>x!==target); saveDB(); await sock.sendMessage(from,{text:R.unprotec(target),mentions:[target]},{quoted:m}); return }
    if(cmd==="zenkai"){ if(txt.toLowerCase().includes("on")){ if(!db.zenkai.includes(from)) db.zenkai.push(from); saveDB(); await sock.sendMessage(from,{text:R.zenkaiOn},{quoted:m}); } else if(target){ db.zenkaiUsers[normalizeJid(target)]=from; saveDB(); await sock.sendMessage(from,{text:R.zenkai(target),mentions:[target]},{quoted:m}); } return }
    if(cmd==="nozenkai"){ if(txt.toLowerCase().includes("off")||!target){ db.zenkai=db.zenkai.filter(x=>x!==from); saveDB(); await sock.sendMessage(from,{text:R.zenkaiOff},{quoted:m}); } else { delete db.zenkaiUsers[normalizeJid(target)]; saveDB(); await sock.sendMessage(from,{text:R.nozenkai(target),mentions:[target]},{quoted:m}); } return }
    if(cmd==="boy"){ if(target){ if(!db.boy.includes(target)) db.boy.push(target); if(!db.boyUsers.includes(target)) db.boyUsers.push(target); saveDB(); await sock.sendMessage(from,{text:R.boyOn,mentions:[target]},{quoted:m}); return } if(txt.toLowerCase().includes("off")){ db.boy=db.boy.filter(x=>x!==from); db.boyUsers=[]; saveDB(); await sock.sendMessage(from,{text:R.boyOff},{quoted:m}); } else { if(!db.boy.includes(from)) db.boy.push(from); saveDB(); await sock.sendMessage(from,{text:R.boyOn},{quoted:m}); } return }
    if(cmd==="godmode"){ if(txt.toLowerCase().includes("off")){ db.godmode=db.godmode.filter(x=>x!==from); saveDB(); await sock.sendMessage(from,{text:R.godmodeoff},{quoted:m}); } else { if(!db.godmode.includes(from)) db.godmode.push(from); saveDB(); await sock.sendMessage(from,{text:R.godmode},{quoted:m}); } return }
    if(cmd==="antilink"){ if(txt.toLowerCase().includes("off")) db.antilink=db.antilink.filter(x=>x!==from); else if(!db.antilink.includes(from)) db.antilink.push(from); saveDB(); await sock.sendMessage(from,{text:db.antilink.includes(from)?R.antilink:R.antilinkoff},{quoted:m}); return }
    if(cmd==="antibod"){ if(txt.toLowerCase().includes("off")) delete db.antibod[from]; else db.antibod[from]=txt||"on"; saveDB(); await sock.sendMessage(from,{text:db.antibod[from]?R.antibodOn(db.antibod[from]):R.antibodOff},{quoted:m}); return }
    if(cmd==="antilock"){ if(txt.toLowerCase().includes("off")) db.antilock=db.antilock.filter(x=>x!==from); else if(!db.antilock.includes(from)) db.antilock.push(from); saveDB(); await sock.sendMessage(from,{text:db.antilock.includes(from)?R.antilock:R.antilockoff},{quoted:m}); return }
    if(cmd==="antidemote"){ if(txt.toLowerCase().includes("off")) db.antidemote=db.antidemote.filter(x=>x!==from); else if(!db.antidemote.includes(from)) db.antidemote.push(from); saveDB(); await sock.sendMessage(from,{text:db.antidemote.includes(from)?R.antidemote:R.antidemoteoff},{quoted:m}); return }
    if(cmd==="antisticker"){ if(txt.toLowerCase().includes("off")) db.antisticker=db.antisticker.filter(x=>x!==from); else if(!db.antisticker.includes(from)) db.antisticker.push(from); saveDB(); await sock.sendMessage(from,{text:db.antisticker.includes(from)?R.antisticker:R.antistickeroff},{quoted:m}); return }
    if(cmd==="antistatus"){ if(txt.toLowerCase().includes("off")) db.antistatus=db.antistatus.filter(x=>x!==from); else if(!db.antistatus.includes(from)) db.antistatus.push(from); saveDB(); await sock.sendMessage(from,{text:db.antistatus.includes(from)?R.antistatus:R.antistatusoff},{quoted:m}); return }
    if(cmd==="welcome"){ if(txt.toLowerCase().includes("off")) db.welcome=db.welcome.filter(x=>x!==from); else if(!db.welcome.includes(from)) db.welcome.push(from); saveDB(); await sock.sendMessage(from,{text:db.welcome.includes(from)?R.welcome:R.welcomeoff},{quoted:m}); return }
    if(cmd==="ghost"){ if(txt.toLowerCase().includes("off")){ db.ghost=db.ghost.filter(x=>x!==from); saveDB(); await sock.sendMessage(from,{text:R.ghostoff},{quoted:m}); } else if(txt.toLowerCase().includes("voir")){ let c=db.ghostCache[from]?.length||0; let msgs=db.ghostCache[from]?.slice(-5).map(m=>`@${m.sender.split('@')[0]}: ${m.text}`).join('\n')||"Vide"; await sock.sendMessage(from,{text:`👻 Ghost: ${c}\n${msgs}`,mentions:db.ghostCache[from]?.map(m=>m.sender)||[]},{quoted:m}); } else { if(!db.ghost.includes(from)) db.ghost.push(from); saveDB(); await sock.sendMessage(from,{text:R.ghost},{quoted:m}); } return }
    if(cmd==="s"||cmd==="sticker"){ let q=m.message.extendedTextMessage?.contextInfo?.quotedMessage; let mm=q?{message:q}:m; try{ let buf=await downloadMediaMessage(mm,'buffer',{},{logger:P({level:'silent'}),reuploadRequest:sock.updateMediaMessage}); await sock.sendMessage(from,{sticker:buf},{quoted:m}); }catch{ await sock.sendMessage(from,{text:R.sNeed},{quoted:m}) } return }
    if(cmd==="vq"){ let q=m.message.extendedTextMessage?.contextInfo?.quotedMessage; if(!q){ await sock.sendMessage(from,{text:R.vqNeed},{quoted:m}); return } try{ let v=q.viewOnceMessage||q.viewOnceMessageV2||q.viewOnceMessageV2Extension; if(v?.message) v=v.message; let buf=await downloadMediaMessage({message:v||q},'buffer',{},{logger:P({level:'silent'}),reuploadRequest:sock.updateMediaMessage}); await sock.sendMessage(from,{image:buf,caption:R.vqOk},{quoted:m}); }catch(e){ await sock.sendMessage(from,{text:"❌ "+e.message},{quoted:m}) } return }
    if(cmd==="st"){ let q=m.message.extendedTextMessage?.contextInfo?.quotedMessage; if(!q){ await sock.sendMessage(from,{text:R.stNeed},{quoted:m}); return } try{ let buf=await downloadMediaMessage({message:q},'buffer',{},{logger:P({level:'silent'}),reuploadRequest:sock.updateMediaMessage}); await sock.sendMessage(from,{image:buf,caption:R.stOk},{quoted:m}); }catch{} return }
    if(text.toLowerCase().startsWith(PREFIX+"autoreply add")){ let rest=text.split(/add/i)[1]?.trim(); let p=rest.split('|'); if(p.length<2){ await sock.sendMessage(from,{text:"Usage: autoreply add trig | resp"},{quoted:m}); return } let t=p[0].trim().toLowerCase(); let r=p[1].trim(); db.autoreply[t]=r; saveDB(); await sock.sendMessage(from,{text:`✅ ${t} => ${r}`},{quoted:m}); return }
    if(text.toLowerCase().startsWith(PREFIX+"autoreply list")){ let l=Object.keys(db.autoreply); await sock.sendMessage(from,{text:l.length?l.map(k=>`${k} => ${db.autoreply[k]}`).join('\n'):"Aucun"},{quoted:m}); return }
    if(text.toLowerCase().startsWith(PREFIX+"autoreply del")){ let t=text.split(/del/i)[1]?.trim().toLowerCase(); if(t&&db.autoreply[t]){ delete db.autoreply[t]; saveDB(); await sock.sendMessage(from,{text:`🗑️ ${t}`},{quoted:m}); } return }
    if(text.toLowerCase().startsWith(PREFIX+"autoreply on all")){ if(!db.autoreplyAll.includes(from)) db.autoreplyAll.push(from); saveDB(); await sock.sendMessage(from,{text:"✅ ON ALL"},{quoted:m}); return }
    if(text.toLowerCase().startsWith(PREFIX+"autoreply on")){ if(!db.autoreplyOn.includes(from)) db.autoreplyOn.push(from); saveDB(); await sock.sendMessage(from,{text:"✅ ON"},{quoted:m}); return }
    if(text.toLowerCase().startsWith(PREFIX+"autoreply off")){ db.autoreplyOn=db.autoreplyOn.filter(x=>x!==from); db.autoreplyAll=db.autoreplyAll.filter(x=>x!==from); saveDB(); await sock.sendMessage(from,{text:"❌ OFF"},{quoted:m}); return }
    if(cmd==="ai"||cmd==="gpt"){ let ans=await askHyper(txt||"Salut"); await sock.sendMessage(from,{text:ans},{quoted:m}); return }
    if(cmd==="amis"){ if(!target){ await sock.sendMessage(from,{text:"TAG"},{quoted:m}); return } if(!senderNum.includes(OWNER_NUMBER)&&!isMe){ return await sock.sendMessage(from,{text:R.onlyOwner},{quoted:m}) } let n=normalizeJid(target); db.amis[n]=true; db.amis[target]=true; saveDB(); await sock.sendMessage(from,{text:R.amis(target),mentions:[target]},{quoted:m}); return }
    if(cmd==="noami"){ if(!target) return; if(!senderNum.includes(OWNER_NUMBER)&&!isMe){ return await sock.sendMessage(from,{text:R.onlyOwner},{quoted:m}) } let n=normalizeJid(target); delete db.amis[n]; delete db.amis[target]; saveDB(); await sock.sendMessage(from,{text:R.noami(target),mentions:[target]},{quoted:m}); return }
    if(cmd==="bot"){ if(txt.includes("off")) db.botOff=true; else db.botOff=false; saveDB(); await sock.sendMessage(from,{text:db.botOff?R.botOffMsg:R.botOnMsg},{quoted:m}); return }
    if(cmd==="private"){ if(txt.includes("on")) db.privateMode=true; else db.privateMode=false; saveDB(); await sock.sendMessage(from,{text:db.privateMode?R.privateOn:R.privateOff},{quoted:m}); return }
  })
  sock.ev.on('messages.update', async(updates)=>{ for(let u of updates){ if(u.update.message===null && messageStore[u.key.id]){ let s=messageStore[u.key.id]; if(db.kaio.includes(s.from)){ await sock.sendMessage(s.from,{text:`🔥 SUPPRIMÉ DÉTECTÉ!\n@${s.sender.split('@')[0]}: "${s.text}"`,mentions:[s.sender]}) } delete messageStore[u.key.id] } } })
  sock.ev.on('group-participants.update', async(update)=>{ try{ const { id, participants, action, author } = update; if(action==='add'){ for(let p of participants){ let meta=await sock.groupMetadata(id).catch(()=>({subject:"royaume"})); if(db.welcome.includes(id)) await sock.sendMessage(id,{text:R.welcomeMsg(p,meta.subject),mentions:[p]}) } } if(action==='remove'){ for(let r of participants){ let num=normalizeJid(r); let prot=db.protec.includes(r)||db.pro.includes(r)||db.saved.includes(r)||db.amis[num]||db.godmode.includes(id)||num.includes(OWNER_NUMBER)||db.zenkai.includes(id)||db.zenkaiUsers[num]; if(prot){ let meta=await sock.groupMetadata(id).catch(()=>null); if(!meta) continue; let botAdmin=meta.participants.find(p=>p.id.includes(sock.user.id.split(':')[0]))?.admin; if(!botAdmin){ await sock.sendMessage(id,{text:R.protecFail}); continue } await sock.groupParticipantsUpdate(id,[r],"add").catch(()=>{}); await new Promise(res=>setTimeout(res,1200)); if(author&&author!==r){ let an=normalizeJid(author); if(!db.protec.includes(author)&&!an.includes(OWNER_NUMBER)){ await sock.groupParticipantsUpdate(id,[author],"remove").catch(()=>{}); await sock.sendMessage(id,{text:R.protecTriggered(r,author),mentions:[r,author]}) } } } } } if(action==='demote'){ for(let d of participants){ let num=normalizeJid(d); let prot=db.protec.includes(d)||db.pro.includes(d)||db.saved.includes(d)||db.godmode.includes(id)||num.includes(OWNER_NUMBER); let ab=db.antibod[id]||db.antidemote.includes(id)||db.godmode.includes(id); if(prot||ab){ let meta=await sock.groupMetadata(id).catch(()=>null); if(!meta) continue; let botAdmin=meta.participants.find(p=>p.id.includes(sock.user.id.split(':')[0]))?.admin; if(!botAdmin) continue; await sock.groupParticipantsUpdate(id,[d],"promote").catch(()=>{}); if(author&&author!==d&&prot){ await sock.groupParticipantsUpdate(id,[author],"demote").catch(()=>{}); await sock.sendMessage(id,{text:R.protecDemote(d,author),mentions:[d,author]}) } } } } }catch(e){ console.log("PROTEC ERR",e) } })
  sock.ev.on('groups.update', async(updates)=>{ for(let u of updates){ try{ if(u.announce!==undefined && db.antilock.includes(u.id)){ if(u.announce==="true"){ await sock.groupSettingUpdate(u.id,"not_announcement"); await sock.sendMessage(u.id,{text:"🔓 𝑨𝑵𝑻𝑰𝑳𝑶𝑪𝑲 - Groupe réouvert!"}) } } if(db.godmode.includes(u.id) && u.announce==="true"){ await sock.groupSettingUpdate(u.id,"not_announcement") } }catch{} } })
}
startBot()
