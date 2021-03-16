const {MessageEmbed, Message, Client} = require('discord.js');
/**
 * @param {Message} message
 * @param {Client} client
 * @param {String[]} args
 * 
 */

exports.run = async (client,message,args) => {
    const player = message.client.music.get(message.guild.id);
    //if (!player) return message.reply("Herhangi Bir şarkı çalmıyor");

    const { channel } = message.member.voice;
    if (!channel) return message.reply(" Bir ses kanalına girmen lazım");

    player.connect()
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['j'],
    permLevel: 0
  }
  exports.help = {
    name: 'join',
    description: `Eğer bot odada değilse çağırabilirsiniz`
  }

  
