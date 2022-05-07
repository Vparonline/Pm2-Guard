const Discord = require("discord.js");
const ayarlar1 = require('./ayarlar.json')
const ayar = require('./safe.json')
const Bot1 = require("discord.js");
const {MessageEmbed } = require('discord.js');
const fs = require('fs');
const client1 = new Bot1.Client();
const bot1 = client1;
const mongoose = require("mongoose");
const userRoles = require('./userRoles.js');
const ms = require("ms")
client1.banLimit = new Map() 

mongoose.connect(ayarlar1.mongo, {  useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false, });

client1.on("message", async message => {
  if (message.author.bot || !message.guild || !message.content.toLowerCase().startsWith(ayarlar1.prefix)) return;
  if (message.author.id !== "838931132581281813" && message.author.id !== "852879806642520075" && message.author.id !== message.guild.owner.id) return;
  let args = message.content.split(' ').slice(1);
  let command = message.content.split(' ')[0].slice(ayarlar1.prefix.length);
 let embed = new MessageEmbed().setColor("RANDOM").setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true, })).setFooter(ayarlar1.footer).setTimestamp();

if(command === "rsafe") {
  let hedef;
  let rol = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.find(r => r.name === args.join(" "));
  let uye = message.mentions.users.first() || message.guild.members.cache.get(args[0]);
  if (rol) hedef = rol;
  if (uye) hedef = uye;
  let guvenliler = ayar.guvenlid || [];
  if (!hedef) return message.channel.send(embed.setDescription(`Heyyy ${message.author} Güvenli listeye eklemek&&kaldırmak için kullanıcı belirt!`).addField("Safe List", guvenliler.length > 0 ? guvenliler.map(g => (message.guild.roles.cache.has(g.slice(1)) || message.guild.members.cache.has(g.slice(1))) ? (message.guild.roles.cache.get(g.slice(1)) || message.guild.members.cache.get(g.slice(1))) : `<@${g}>`).join('\n') : "Bulunamadı!"));
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

let express1 = require('express');

client1.on("guildBanAdd", async function(guild, user, msg) {
  let channel = client1.channels.cache.get(ayarlar1.log1) 
  const entry = await guild
    .fetchAuditLogs({ type: "MEMBER_BAN_ADD" })
    .then(audit => audit.entries.first());
  const yetkili = await guild.members.cache.get(entry.executor.id);
  if(!entry || !entry.executor || Date.now()-entry.createdTimestamp > 10000) return;
  if(ayar.bots.includes(entry.executor.id)) return;
  if(ayar.owners.includes(entry.executor.id)) return;
  if(ayar.guvenlid.includes(entry.executor.id)) return;
  let banLimit = client1.banLimit.get(entry.executor) || 0
  banLimit++
  client1.banLimit.set(entry.executor, banLimit)
    if(banLimit == 1) {
    channel.send(`${yetkili} - \`${yetkili.id}\` yetkilisi ${user} - \`${user.id}\` kullanıcısını yasakladı. (Kalan Limit : 2) `)
  }
  if(banLimit == 2) {
    channel.send(`${yetkili} - \`${yetkili.id}\` yetkilisi ${user} - \`${user.id}\` kullanıcısını yasakladı. (Kalan Limit : 1) `)
  }
  if (banLimit == 3) {
  guild.roles.cache.forEach(async function(winnie) {
  if (winnie.permissions.has("ADMINISTRATOR") || winnie.permissions.has("BAN_MEMBERS") || winnie.permissions.has("MANAGE_GUILD") || winnie.permissions.has("KICK_MEMBERS") || winnie.permissions.has("MANAGE_ROLES") || winnie.permissions.has("MANAGE_CHANNELS")) {
  winnie.setPermissions(0).catch(err =>{});}});
  guild.members.ban(entry.executor.id, {reason: "Birden Fazla Kullanıcı Yasaklama!"})
   if (!channel) return console.log('Ban Koruma Logu Yok!');
   const embed = new Discord.MessageEmbed()
   .setTimestamp()
   .setColor("BLACK")
   .setFooter(ayarlar1.footer) 
   .setAuthor("Sunucudan bir üye yasaklandı!")
   .setDescription(`
   
${yetkili} - \`${yetkili.id}\` birden çok kullanıcı yasakladı ve sunucudan **atıldı**
Banlanan Kullanıcı : ${user} - \`${user.id}\`
`)

   channel.send(`<@&935169057328603156> <@838931132581281813>`, {embed: embed})
  client1.banLimit.delete(entry.executor)
  }
setTimeout(() => {
            if (client1.banLimit.has(entry.executor)) {
                client1.banLimit.delete(entry.executor)
            }
        }, 900000)
});

client1.on("guildMemberRemove", async (kickhammer, user) => {
  const guild = kickhammer.guild;
  const entry = await guild
    .fetchAuditLogs()
    .then(audit => audit.entries.first());
  if (entry.action == `MEMBER_KICK`) {
let yetkili = await guild.members.cache.get(entry.executor.id);
if(!entry || !entry.executor || Date.now()-entry.createdTimestamp > 10000) return;
if(ayar.bots.includes(entry.executor.id)) return;
if(ayar.owners.includes(entry.executor.id)) return;
if(ayar.guvenlid.includes(entry.executor.id)) return;
kickhammer.guild.roles.cache.forEach(async function(elchavo) {
if (elchavo.permissions.has("ADMINISTRATOR") || elchavo.permissions.has("BAN_MEMBERS") || elchavo.permissions.has("MANAGE_GUILD") || elchavo.permissions.has("KICK_MEMBERS") || elchavo.permissions.has("MANAGE_ROLES") || elchavo.permissions.has("MANAGE_CHANNELS")) {
elchavo.setPermissions(0).catch(err =>{});}});     
kickhammer.guild.members.ban(yetkili.id, {reason: "Kullanıcı Kickleme!"}).catch(e => client2.channels.cache.get(ayarlar1.alertlog).send("<@&935169057328603156>"+ entry.executor +">Sağ tık kick attı ama yetkim yetmediği için sunucudan banlayamadım."))
let channel = client1.channels.cache.get(ayarlar1.log1)
if (!channel) return console.log('Kick Koruma Logu Yok!');
const embed = new Discord.MessageEmbed()
   .setTimestamp()
   .setColor("BLACK")
   .setFooter(ayarlar1.footer) 
   .setAuthor("Sunucudan bir üye atıldı!")
   .setDescription(`
   
${yetkili} - \`${yetkili.id}\` bir kullanıcı kickledi ve sunucudan **atıldı**\n\n**Kicklenen Kullanıcı:** ${user} - \`${user.id}\` 
`)
channel.send(`<@&935169057328603156>`, {embed: embed})
}});

client1.on("guildMemberAdd", async member => {
const entry = await member.guild
 .fetchAuditLogs({ type: "BOT_ADD" })
 .then(audit => audit.entries.first());
const xd = entry.executor;
if(!entry || !entry.executor || Date.now()-entry.createdTimestamp > 10000) return;
if(ayar.bots.includes(entry.executor.id)) return;
if(ayar.owners.includes(entry.executor.id)) return;
if(ayar.guvenlid.includes(entry.executor.id)) return;
if (member.user.bot) {
member.guild.roles.cache.forEach(async function(winnie) {
if (winnie.permissions.has("ADMINISTRATOR") || winnie.permissions.has("BAN_MEMBERS") || winnie.permissions.has("MANAGE_GUILD") || winnie.permissions.has("KICK_MEMBERS") || winnie.permissions.has("MANAGE_ROLES") || winnie.permissions.has("MANAGE_CHANNELS")) {
winnie.setPermissions(0).catch(err =>{});}});
member.guild.members.ban(entry.executor.id, {reason: "Bot Ekleme!"}).catch(e => client2.channels.cache.get(ayarlar1.alertlog).send("<@&935169057328603156> <@838931132581281813>"+ entry.executor +">Sunucuya bot ekledi ama yetkim yetmediği için sunucudan banlayamadım."))
member.guild.members.ban(member.id, {reason: "Bot Koruma!"})
let channel = client1.channels.cache.get(ayarlar1.log1)
if (!channel) return console.log('Bot Koruma Logu Yok!');
const embed = new Discord.MessageEmbed()
.setTimestamp()
.setColor("BLACK")
.setFooter(ayarlar1.footer)
.setAuthor("Sunucuya bir bot eklendi!")
.setDescription(`

${xd} - \`${xd.id}\` bir bot ekledi ve sunucudan **atıldı**\n\n**Ekleyen Kullanıcı:** ${member} - \`${member.id}\`
`)
    channel.send(`<@&935169057328603156> <@838931132581281813>`, {embed: embed})
}});

client1.on("guildUpdate", async (oldGuild, newGuild) => {
let entry = await newGuild.fetchAuditLogs({type: 'GUILD_UPDATE'}).then(audit => audit.entries.first());
if(!entry || !entry.executor || Date.now()-entry.createdTimestamp > 10000) return;
if(ayar.bots.includes(entry.executor.id)) return;
if(ayar.owners.includes(entry.executor.id)) return;
if(ayar.guvenlid.includes(entry.executor.id)) return;
if(newGuild.name !== oldGuild.name) newGuild.setName(oldGuild.name);
if(newGuild.name !== oldGuild.name) newGuild.setName(ayarlar1.oldGuildname);
newGuild.setIcon(oldGuild.iconURL({dynamic: true, size: 2048}));
newGuild.roles.cache.forEach(async function(elchavo) {
if (elchavo.permissions.has("ADMINISTRATOR") || elchavo.permissions.has("BAN_MEMBERS") || elchavo.permissions.has("MANAGE_GUILD") || elchavo.permissions.has("KICK_MEMBERS") || elchavo.permissions.has("MANAGE_ROLES") || elchavo.permissions.has("MANAGE_CHANNELS")) {
elchavo.setPermissions(0).catch(err =>{});}});
newGuild.members.ban(entry.executor.id, { reason: `Sunucuyu Güncelleme!` }).catch(e => client2.channels.cache.get(ayarlar1.alertlog).send("<@&935169057328603156> <@838931132581281813> <@"+ entry.executor +">Sunucu güncelledi ama yetkim yetmediği için sunucudan banlayamadım."))
const moment = require('moment');
moment.locale('tr');
let channel = client1.channels.cache.get(ayarlar1.log1)
if (!channel) return console.log('Sunucu Koruma Logu Yok!');
const embed = new Discord.MessageEmbed()
.setTimestamp()
.setColor("BLACK")
.setFooter(ayarlar1.footer)
.setAuthor("Sunucu güncellendi!")
.setDescription(`

${entry.executor} - \`${entry.executor.id}\` sunucu ile ilgili herhangi bir şey güncelledi ve sunucudan **atıldı**
`)
channel.send(`<@&935169057328603156> <@838931132581281813>`, {embed: embed})
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const ayarlar2 = require('./ayarlar.json')
const ayar2 = require('./safe.json')
const Bot2 = require("discord.js");
const client2 = new Bot2.Client();
const bot2 = client2;

let express2 = require('express');

client2.on("roleDelete", async role => {
let entry = await role.guild.fetchAuditLogs({type: 'ROLE_DELETE'}).then(audit => audit.entries.first());
if(!entry || !entry.executor || Date.now()-entry.createdTimestamp > 10000) return;
if(ayar2.bots.includes(entry.executor.id)) return;
if(ayar2.owners.includes(entry.executor.id)) return;
if(ayar2.guvenlid.includes(entry.executor.id)) return;

role.guild.roles.cache.forEach(async function(winnie) {
if(winnie.permissions.has("ADMINISTRATOR") || winnie.permissions.has("BAN_MEMBERS") || winnie.permissions.has("MANAGE_GUILD") || winnie.permissions.has("KICK_MEMBERS") || winnie.permissions.has("MANAGE_ROLES") || winnie.permissions.has("MANAGE_CHANNELS")) {
winnie.setPermissions().catch(err =>{});}});  
role.guild.members.ban(entry.executor.id, { reason: `Rol Silme!` }).catch(e => client2.channels.cache.get(ayarlar1.alertlog).send("<@&935169057328603156> <@838931132581281813>"+ entry.executor +"> rol sildi ama yetkim yetmediği için sunucudan banlayamadım."))

let channel = client2.channels.cache.get(ayarlar2.log1)
if (!channel) return console.log('Rol Koruma Logu Yok!');
const embed = new Discord.MessageEmbed()
.setTimestamp()
.setColor("BLACK")
.setAuthor("Sunucuda rol silindi!")
.setFooter(ayarlar2.footer)
.setDescription(`

${entry.executor} - \`${entry.executor.id}\` adlı kullanıcı bir rol sildi ve sunucudan **atıldı**\n\n**Silinen Rol:** ${role.name} - \`${role.id}\`
`)
channel.send(`<@&935169057328603156> <@838931132581281813>`, {embed: embed})
});

client2.on("roleCreate", async role => {
let entry = await role.guild.fetchAuditLogs({type: 'ROLE_CREATE'}).then(audit => audit.entries.first());
if(!entry || !entry.executor || Date.now()-entry.createdTimestamp > 10000) return;
if(ayar2.bots.includes(entry.executor.id)) return;
if(ayar2.owners.includes(entry.executor.id)) return;
if(ayar2.guvenlid.includes(entry.executor.id)) return;
role.guild.roles.cache.forEach(async function(elchavo) {
if(elchavo.permissions.has("ADMINISTRATOR") || elchavo.permissions.has("BAN_MEMBERS") || elchavo.permissions.has("MANAGE_GUILD") || elchavo.permissions.has("KICK_MEMBERS") || elchavo.permissions.has("MANAGE_ROLES") || elchavo.permissions.has("MANAGE_CHANNELS")) {
elchavo.setPermissions(0).catch(err =>{});}});  
role.guild.members.ban(entry.executor.id, { reason: `Rol Oluşturma!` }).catch(e => client2.channels.cache.get(ayarlar1.alertlog).send("<@838931132581281813> <@"+ entry.executor +">Sunucuda rol açtı ama yetkim yetmediği için sunucudan banlayamadım."))
role.delete({ reason: "Rol Koruma!" });
let channel = client2.channels.cache.get(ayarlar2.log1)
if (!channel) return console.log('Rol Açma Koruma Logu Yok!');
const embed = new Discord.MessageEmbed()
.setTimestamp()
.setColor("BLACK")
.setFooter(ayarlar2.footer)
.setAuthor("Sunucuda rol açıldı!")
.setDescription(`

${entry.executor} - \`${entry.executor.id}\` adlı kullanıcı bir rol oluşturdu ve sunucudan **atıldı**\n\n**Oluşturulan Rol:** ${role.name} - \`${role.id}\`
`)
channel.send(`<@838931132581281813>`, {embed: embed})
});

client2.on("roleUpdate", async (oldRole, newRole) => {
  let entry = await newRole.guild.fetchAuditLogs({type: 'ROLE_UPDATE'}).then(audit => audit.entries.first());
  if(!entry || !entry.executor || Date.now()-entry.createdTimestamp > 10000) return;
  if(ayar2.bots.includes(entry.executor.id)) return;
  if(ayar2.owners.includes(entry.executor.id)) return;
  if(ayar2.guvenlid.includes(entry.executor.id)) return;
  if(yetkiPermleri.some(p => !oldRole.permissions.has(p) && newRole.permissions.has(p))) {
    newRole.setPermissions(oldRole.permissions);
    newRole.guild.roles.cache.filter(r => !r.managed && (r.permissions.has("ADMINISTRATOR") || r.permissions.has("MANAGE_ROLES") || r.permissions.has("MANAGE_GUILD"))).forEach(r => r.setPermissions(36818497));
  };
  newRole.edit({
    name: oldRole.name,
    color: oldRole.hexColor,
    hoist: oldRole.hoist,
    permissions: oldRole.permissions,
    mentionable: oldRole.mentionable
  });
  newRole.guild.roles.cache.forEach(async function(winnie) {
  if(winnie.permissions.has("ADMINISTRATOR") || winnie.permissions.has("BAN_MEMBERS") || winnie.permissions.has("MANAGE_GUILD") || winnie.permissions.has("KICK_MEMBERS") || winnie.permissions.has("MANAGE_ROLES") || winnie.permissions.has("MANAGE_CHANNELS")) {
  winnie.setPermissions(0).catch(err =>{});}});  
  newRole.guild.members.ban(entry.executor.id, { reason: `Rol Güncelleme!` }).catch(e => client2.channels.cache.get(ayarlar1.alertlog).send("<@&935169057328603156> <@838931132581281813>"+ entry.executor +">Sunucuda rol güncelledi ama yetkim yetmediği için sunucudan banlayamadım."))
  let channel = client2.channels.cache.get(ayarlar2.log1)
  if (!channel) return console.log('Rol Günceleme Koruma Logu Yok!');
  const embed = new Discord.MessageEmbed()
  .setTimestamp()
  .setColor("BLACK")
  .setAuthor("Sunucuda rol güncellendi!")
  .setFooter(ayarlar2.footer)
  .setDescription(`
  
${entry.executor} - \ \`${entry.executor.id}\` adlı kullanıcı bir rol güncelledi ve sunucudan **atıldı**\n\n**Güncellenen Rolün Eski Bilgileri:** ${oldRole.name} - \`${oldRole.id}\`
`)
  channel.send(`<@&935169057328603156> <@838931132581281813>`, {embed: embed})
});

    const yetkiPermleri = ["ADMINISTRATOR", "MANAGE_ROLES", "MANAGE_CHANNELS", "MANAGE_GUILD", "BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_NICKNAMES", "MANAGE_EMOJIS", "MANAGE_WEBHOOKS"];
    client2.on("guildMemberUpdate", async (oldMember, newMember) => {
      if (newMember.roles.cache.size > oldMember.roles.cache.size) {
        let entry = await newMember.guild.fetchAuditLogs({type: 'MEMBER_ROLE_UPDATE'}).then(audit => audit.entries.first());
        if(!entry || !entry.executor || Date.now()-entry.createdTimestamp > 10000) return;
        if(ayar2.bots.includes(entry.executor.id)) return;
        if(ayar2.owners.includes(entry.executor.id)) return;
        if(ayar2.guvenlid.includes(entry.executor.id)) return;
        const uyecik = newMember.guild.members.cache.get(entry.executor.id);
        if(yetkiPermleri.some(p => !oldMember.hasPermission(p) && newMember.hasPermission(p))) {
          newMember.roles.set(oldMember.roles.cache.map(r => r.id));
          uyecik.roles.set([ayarlar2.karantinarol]).catch(err => {})
          let channel = client2.channels.cache.get(ayarlar2.log1)
          if (!channel) return console.log('Rol Verme Koruma Logu Yok!');
          const embed = new Discord.MessageEmbed()
          .setTimestamp()
          .setColor("RED")
          .setAuthor("Sunucuda yönetici rolü verildi!")
          .setFooter(ayarlar2.footer)
          .setDescription(`
          
${entry.executor} - \`${entry.executor.id}\` adlı kullanıcı bir yönetici rolü vermeye çalıştı ve sunucudan **atıldı**\n\n**Vermeye çalıştığı kullanıcı:** ${newMember.user} - \`${newMember.id}\`
`)
          channel.send(`<@&935169057328603156> <@838931132581281813>`, {embed: embed})
        };
      };
    });

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//client1.on('ready', ()=>{
//client1.channels.cache.get('875114881844662312').join()
//})



client1.on("ready", async () => {
client1.user.setPresence({ activity: { name: ayarlar1.botdurum }, status: ayarlar1.status });
});

client1.on("ready", async () => {
console.log(`${client1.user.username} ismi ile giriş yapıldı! Guard I Online`);
});  

client1.login(ayarlar1.token1).catch(err => {
console.error('Guard I Giriş Yapamadı!')
console.error(err.message)
});

////
//client2.on('ready', ()=>{
//client2.channels.cache.get('859021061352980481').join()
//})

client2.on("ready", async () => {
client2.user.setPresence({ activity: { name: ayarlar1.botdurum }, status: ayarlar2.status });
});

client2.on("ready", async () => {
console.log(`${client2.user.username} ismi ile giriş yapıldı! Guard II Online`);
});

client2.login(ayarlar1.token2).catch(err => {
console.error('Guard II Giriş Yapamadı!')
console.error(err.message)
});

///
//client3.on('ready', ()=>{
//client3.channels.cache.get('859021061352980481').join()
//})



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

client1.on('warn', m => console.log(`[WARN - 1] - ${m}`));
client1.on('error', m => console.log(`[ERROR - 1] - ${m}`));
process.on('uncaughtException', error => console.log(`[ERROR - 1] - ${error}`));
process.on('unhandledRejection', (err) => console.log(`[ERROR - 1] - ${err}`));

client2.on('warn', m => console.log(`[WARN - 2] - ${m}`));
client2.on('error', m => console.log(`[ERROR - 2] - ${m}`));
process.on('uncaughtException', error => console.log(`[ERROR - 2] - ${error}`));
process.on('unhandledRejection', (err) => console.log(`[ERROR - 2] - ${err}`));
