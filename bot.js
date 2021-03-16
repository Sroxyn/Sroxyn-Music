const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const ayarlar = require('./ayarlar.json');
const chalk = require('chalk');
require('./Util/eventloader')(client);
/**
 * 
 * @param {Message} message 
 */
//---------------------------------------------------------------------------------------


//---------------------------- DOKUNMA ------------------------------------

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./commands/', (err, files) => {
  if (err) console.error(err);
  files.forEach(dir => {
    fs.readdir(`./commands/${dir}`, (err, files) => {
      if(err) return console.error(err);
      files.forEach(files => {
          
  let props = require(`./commands/${dir}/${files}`);
  console.log(`${chalk.green.inverse(`>`)}[Succesful]: ${chalk.white.bold(props.help.name)}`)
   client.commands.set(props.help.name, props);
  props.conf.aliases.forEach(alias => {
    
    client.aliases.set(alias, props.help.name);
      });
  });
 });
});
});
//------------------------------------------
//-------------------------------------------

client.elevation = message => {
  if(!message.guild) {
    return; }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.id) permlvl = 4;
  return permlvl;
};
client.login(ayarlar.token).catch(err => console.error(`Bot giriş yapamadı Tokeni kontrol edin | Hata: ` + err));
//---------------------------------------------