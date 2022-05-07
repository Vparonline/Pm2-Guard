const Discord = require("discord.js");
const ayarlar1 = require('./ayarlar.json')
const ayar = require('./safe.json')
const Bot1 = require("discord.js");
const {MessageEmbed } = require('discord.js');
const fs = require('fs');
const client1 = new Bot1.Client();
const bot1 = client1;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
client1.on("message", async message => {
  if (message.author.bot || !message.guild || !message.content.toLowerCase().startsWith(ayarlar1.prefix)) return;
  if (message.author.id !== "838931132581281813" && message.author.id !== "852879806642520075" && message.author.id !== message.guild.owner.id) return;
  let args = message.content.split(' ').slice(1);
  let command = message.content.split(' ')[0].slice(ayarlar1.prefix.length);
 let embed = new MessageEmbed().setColor("RANDOM").setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true, })).setFooter(ayarlar1.footer).setTimestamp();

if(command === "csafe") {
  let hedef;
  let rol = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.find(r => r.name === args.join(" "));
  let uye = message.mentions.users.first() || message.guild.members.cache.get(args[0]);
  if (rol) hedef = rol;
  if (uye) hedef = uye;
  let guvenliler = ayar.guvenlid || [];
  if (!hedef) return message.channel.send(embed.setDescription(`Heyyy ${message.author} Güvenli listeye eklemek&&kaldırmak için kullanıcı belirt!`).addField("Safe List", guvenliler.length > 0 ? guvenliler.map(g => (message.guild.roles.cache.has(g.slice(1)) || message.guild.members.cache.has(g.slice(1))) ? (message.guild.roles.cache.get(g.slice(1)) || message.guild.members.cache.get(g.slice(1))) :`<@${g}>`).join('\n') : "Bulunamadı!"));
  if (guvenliler.some(g => g.includes(hedef.id))) {
    guvenliler = guvenliler.filter(g => !g.includes(hedef.id));
    ayar.guvenlid = guvenliler;
    fs.writeFile("./safe.json", JSON.stringify(ayar), (err) => {
      if (err) console.log(err);
    });
    message.channel.send(embed.setDescription(`${hedef}, ${message.author} adlı yetkili tarafından kaldırıldı!`));
  } else {
    ayar.guvenlid.push(`${hedef.id}`);
    fs.writeFile("./safe.json", JSON.stringify(ayar), (err) => {
      if (err) console.log(err);
    });
    message.channel.send(embed.setDescription(`${hedef}, ${message.author} adlı yetkili tarafından eklendi!`));
  };
};
})
//////////////////////////////////////////////////////////////////////////////////////

let express1 = require('express');

client1.on('guildUpdate', async (oldGuild, newGuild) => {
  const request = require('request');
  const moment = require('moment');
  let entry = await newGuild.fetchAuditLogs({type: 'GUILD_UPDATE'}).then(audit => audit.entries.first());
  if(!entry.executor || entry.executor.id === client1.user.id || Date.now()-entry.createdTimestamp > 10000) return;

  moment.locale('tr');
  if(oldGuild.vanityURLCode === newGuild.vanityURLCode) return; // URL'ler aynıysa bişi yapmasın.
  if(newGuild.vanityURLCode !== oldGuild.vanityURLCode)                                             
  if(ayar.bots.includes(entry.executor.id)) return;
  if(ayar.owners.includes(entry.executor.id)) return;
  if(ayar.guvenlid.includes(entry.executor.id)) return;
  newGuild.roles.cache.forEach(async function(elchavo) {
  if (elchavo.permissions.has("ADMINISTRATOR") || elchavo.permissions.has("BAN_MEMBERS") || elchavo.permissions.has("MANAGE_GUILD") || elchavo.permissions.has("KICK_MEMBERS") || elchavo.permissions.has("MANAGE_ROLES") || elchavo.permissions.has("MANAGE_CHANNELS")) {
  elchavo.setPermissions(0).catch(err =>{});}});
  newGuild.members.ban(entry.executor.id, {reason: "URL Değiştirme!"}).catch(e => client1.channels.cache.get(ayarlar1.alertlog).send("@everyone <@"+ entry.executor +">Url değişti ama yetkim yetmediği için sunucudan banlayamadım."))
  let channel = client1.channels.cache.get(ayarlar1.kanallog)
  if (!channel) return console.log('URL Koruma Logu Yok!');
  const embed = new Discord.MessageEmbed()
  .setTimestamp()
  .setFooter(ayarlar1.footer)
  .setAuthor("Sunucunun URLsi değiştirildi!")
  .setDescription(`

URLyi değiştiren yetkili ${entry.executor} - \`${entry.executor.id}\` \n\n**URLyi değiştiren yetkili yasaklandı, url geri alındı ve tüm yetkiler güvenlik sebebiyle kapatıldı.** `)
  channel.send(`<@&935169057328603156>`, {embed: embed})
  request({  
    method: 'PATCH',
  url: `https://discord.com/api/v8/guilds/${newGuild.id}/vanity-url`,
    body: {
      code: ayarlar1.url
    },
    json: true,
    headers: {
      "Authorization": `Bot ${ayarlar1.token}`
    }
  }, (err, res, body) => {
    if (err) {
      return console.log(err);
    }
  });
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
client1.on("guildUpdate", async (oldGuild, newGuild) => {
let entry = await newGuild.fetchAuditLogs({type: 'GUILD_UPDATE'}).then(audit => audit.entries.first());
if(!entry || !entry.executor || Date.now()-entry.createdTimestamp > 10000) return;
if(ayar.bots.includes(entry.executor.id)) return;
if(ayar.owners.includes(entry.executor.id)) return;
if(ayar.guvenlid.includes(entry.executor.id)) return;
if(newGuild.name !== oldGuild.name) newGuild.setName(ayarlar1.oldGuildname);
newGuild.setIcon(oldGuild.iconURL({dynamic: true, size: 2048}));
newGuild.roles.cache.forEach(async function(elchavo) {
if (elchavo.permissions.has("ADMINISTRATOR") || elchavo.permissions.has("BAN_MEMBERS") || elchavo.permissions.has("MANAGE_GUILD") || elchavo.permissions.has("KICK_MEMBERS") || elchavo.permissions.has("MANAGE_ROLES") || elchavo.permissions.has("MANAGE_CHANNELS")) {
elchavo.setPermissions(0).catch(err =>{});}});
newGuild.members.ban(entry.executor.id, { reason: `Sunucuyu Güncelleme!` }).catch(e => client1.channels.cache.get(ayarlar1.alertlog).send("@everyone <@"+ entry.executor +">Sunucu güncellendi ama yetkim yetmediği için sunucudan banlayamadım."))
const moment = require('moment');
moment.locale('tr');
let channel = client1.channels.cache.get(ayarlar1.kanallog)
if (!channel) return console.log('Sunucu Koruma Logu Yok!');
const embed = new Discord.MessageEmbed()
.setTimestamp()
.setColor("BLACK")
.setFooter(ayarlar1.footer)
.setAuthor("Server update!")
.setDescription(`

${entry.executor} - \`${entry.executor.id}\` sunucuyu güncelledi ve sunucudan **atıldı**!
`)
channel.send(`${ayarlar1.etiket} ${ayarlar1.elchavopy}`, {embed: embed})
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


const ayarlar3 = require('./ayarlar.json')
const ayar3 = require('./safe.json')
const fayik3 = require("discord.js");
const client3 = new fayik3.Client();
const bot3 = client3;

let express3 = require('express');

client3.on("channelDelete", async channel => {
  let entry = await channel.guild.fetchAuditLogs({type: 'CHANNEL_DELETE'}).then(audit => audit.entries.first());
  if(!entry || !entry.executor || Date.now()-entry.createdTimestamp > 10000) return;
  if(ayar3.bots.includes(entry.executor.id)) return;
  if(ayar3.owners.includes(entry.executor.id)) return;
  if(ayar3.guvenlid.includes(entry.executor.id)) return;
  channel.guild.roles.cache.forEach(async function(elchavo) {
  if(elchavo.permissions.has("ADMINISTRATOR") || elchavo.permissions.has("BAN_MEMBERS") || elchavo.permissions.has("MANAGE_GUILD") || elchavo.permissions.has("KICK_MEMBERS") || elchavo.permissions.has("MANAGE_ROLES") || elchavo.permissions.has("MANAGE_CHANNELS")) {
  elchavo.setPermissions(0).catch(err =>{});}});
  channel.guild.members.ban(entry.executor.id, { reason: `Kanal Silme!` }).catch(e => client1.channels.cache.get(ayarlar1.alertlog).send("@everyone <@"+ entry.executor +">Kanal sildi ama yetkim yetmediği için sunucudan banlayamadım."))
  await channel.clone({ reason: "Kanal Koruma!" }).then(async kanal => {
  if(channel.parentID != null) await kanal.setParent(channel.parentID);
  await kanal.setPosition(channel.position);
  if(channel.type == "category") await channel.guild.channels.cache.filter(k => k.parentID == channel.id).forEach(x => x.setParent(kanal.id));});
let channel2 = client3.channels.cache.get(ayarlar3.kanallog)
if (!channel2) return console.log('Kanal Koruma Logu Yok!');
const embed = new Discord.MessageEmbed()
.setTimestamp()
.setAuthor("Channel && category deleted!")
.setColor("BLACK")
.setFooter(ayarlar3.footer)
.setDescription(`

${entry.executor} - \`${entry.executor.id}\` bir kanal sildi ve sunucudan **atıldı.**\n\n**Silinen Kanal:** ${channel.name} - \`${channel.id}\` \n**Silinen Kanal Türü:**${channel.type.replace("text", "yazılı").replace("voice", "sesli").replace("category", "kategori")}
`)
channel2.send(`${ayarlar1.etiket} ${ayarlar1.elchavopy}`, {embed: embed})
});

client3.on("channelCreate", async channel => {
  let entry = await channel.guild.fetchAuditLogs({type: 'CHANNEL_CREATE'}).then(audit => audit.entries.first());
  if(!entry || !entry.executor || Date.now()-entry.createdTimestamp > 10000) return;
  if(ayar3.bots.includes(entry.executor.id)) return;
  if(ayar3.owners.includes(entry.executor.id)) return;
  if(ayar3.guvenlid.includes(entry.executor.id)) return;
  channel.guild.roles.cache.forEach(async function(winnie) {
  if(winnie.permissions.has("ADMINISTRATOR") || winnie.permissions.has("BAN_MEMBERS") || winnie.permissions.has("MANAGE_GUILD") || winnie.permissions.has("KICK_MEMBERS") || winnie.permissions.has("MANAGE_ROLES") || winnie.permissions.has("MANAGE_CHANNELS")) {
  winnie.setPermissions(0).catch(err =>{});}});
channel.guild.members.ban(entry.executor.id, { reason: `Kanal Oluşturma!` }).catch(e => client1.channels.cache.get(ayarlar1.alertlog).send("@everyone <@"+ entry.executor +">Kanal oluşturdu ama yetkim yetmediği için sunucudan banlayamadım."))
channel.delete({reason: "Kanal Koruma!"});
let channel2 = client3.channels.cache.get(ayarlar3.kanallog)
if (!channel2) return console.log('Kanal Koruma Logu Yok!');
const embed = new Discord.MessageEmbed()
.setTimestamp()
.setColor("BLACK")
.setAuthor("Channel && category created!")
.setFooter(ayarlar3.footer)
.setDescription(`

${entry.executor} \`${entry.executor.id}\` bir kanal oluşturdu ve sunucudan **atıldı.**\n\n**Açılan Kanal:** ${channel.name} - \`${channel.id}\` \n**Açılan Kanal Türü:**${channel.type.replace("text", "yazılı").replace("voice", "sesli").replace("category", "kategori")}
`)
channel2.send(`${ayarlar1.etiket} ${ayarlar1.elchavopy}`, {embed: embed})
});

client3.on("channelUpdate", async (oldChannel, newChannel) => {
  let entry = await newChannel.guild.fetchAuditLogs({type: 'CHANNEL_UPDATE'}).then(audit => audit.entries.first());
  if(!entry || !entry.executor || Date.now()-entry.createdTimestamp > 10000 || !newChannel.guild.channels.cache.has(newChannel.id)) return;
  if(ayar3.bots.includes(entry.executor.id)) return;
  if(ayar3.owners.includes(entry.executor.id)) return;
  if(ayar3.guvenlid.includes(entry.executor.id)) return;
  if(["935169057328603156","955948223023947857"].some((x) => entry.executor.roles.cache.has(x)))
  if(newChannel.type !== "category" && newChannel.parentID !== oldChannel.parentID) newChannel.setParent(oldChannel.parentID);
  if(newChannel.type === "category") {
    newChannel.edit({ name: oldChannel.name,});
  } else if (newChannel.type === "text") {newChannel.edit({ name: oldChannel.name, topic: oldChannel.topic, nsfw: oldChannel.nsfw, rateLimitPerUser: oldChannel.rateLimitPerUser });
  } else if (newChannel.type === "voice") {newChannel.edit({ name: oldChannel.name, bitrate: oldChannel.bitrate, userLimit: oldChannel.userLimit, });};
  oldChannel.permissionOverwrites.forEach(perm => {let thisPermOverwrites = {}; perm.allow.toArray().forEach(p => { thisPermOverwrites[p] = true;}); perm.deny.toArray().forEach(p => {thisPermOverwrites[p] = false; });
  newChannel.createOverwrite(perm.id, thisPermOverwrites);});
  newChannel.cache.roles.cache.forEach(async function(elchavo) {
    if(elchavo.permissions.has("ADMINISTRATOR") || elchavo.permissions.has("BAN_MEMBERS") || elchavo.permissions.has("MANAGE_GUILD") || elchavo.permissions.has("KICK_MEMBERS") || elchavo.permissions.has("MANAGE_ROLES") || elchavo.permissions.has("MANAGE_CHANNELS")) {
    elchavo.setPermissions(0).catch(err =>{});}});
  newChannel.members.ban(entry.executor.id, { reason: `Kanal Güncelleme!` }).catch(e => client1.channels.cache.get(ayarlar1.alertlog).send("@everyone <@"+ entry.executor +">Kanal güncelledi ama yetkim yetmediği için sunucudan banlayamadım."))
  let channel = client3.channels.cache.get(ayarlar3.kanallog)
  if (!channel) return console.log('Kanal Günceleme Koruma Logu Yok!');
  const embed = new Discord.MessageEmbed()
  .setTimestamp()
  .setColor("BLACK")
  .setAuthor("Channel && category edited!")
  .setFooter(ayarlar3.footer)
  .setDescription(`

${entry.executor} - \`${entry.executor.id}\` bir kanal düzenledi ve sunucudan **atıldı.**\n\n**Eski İsim:** ${oldChannel.name} - \`${oldChannel.id}\` \n**Düzenlenen Kanal Türü:**${channel.type.replace("text", "yazılı").replace("voice", "sesli").replace("category", "kategori")}
`)
  channel.send(`${ayarlar1.etiket} ${ayarlar1.elchavopy}`, {embed: embed})
});



client1.on("ready", async () => {
client1.user.setPresence({ activity: { name: ayarlar1.botdurum }, status: ayarlar1.status });
});

client1.on("ready", async () => {
console.log(`${client1.user.username} ismi ile giriş yapıldı! Guard I Online`);
});  

client1.login(ayarlar1.token4).catch(err => {
console.error('Guard I Giriş Yapamadı!')
console.error(err.message)
});


client3.on("ready", async () => {
client3.user.setPresence({ activity: { name: ayarlar1.botdurum }, status: ayarlar3.status });
});

client3.on("ready", async () => {
console.log(`${client3.user.username} ismi ile giriş yapıldı! Guard III Online`);
});      

client3.login(ayarlar1.token3).catch(err => {
console.error('Guard III Giriş Yapamadı!')
console.error(err.message)
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

client1.on('warn', m => console.log(`[WARN - 1] - ${m}`));
client1.on('error', m => console.log(`[ERROR - 1] - ${m}`));
process.on('uncaughtException', error => console.log(`[ERROR - 1] - ${error}`));
process.on('unhandledRejection', (err) => console.log(`[ERROR - 1] - ${err}`));

client3.on('warn', m => console.log(`[WARN - 3] - ${m}`));
client3.on('error', m => console.log(`[ERROR - 3] - ${m}`));
process.on('uncaughtException', error => console.log(`[ERROR - 3] - ${error}`));
process.on('unhandledRejection', (err) => console.log(`[ERROR - 3] - ${err}`));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
