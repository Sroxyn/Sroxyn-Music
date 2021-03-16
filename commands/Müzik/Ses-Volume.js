const {MessageEmbed, Message} = require('discord.js');
/**
 * @param {Message} message
 * @param {Client} client
 * @param {String[]} args
 */

 exports.run = async (client,message,args) => {

    const player = message.client.music.get(message.guild.id);
    if (!player) return message.reply("herhangi bir şarkı açık değil");

    let volume_level = args[0]
    if(volume_level > 200)return message.channel.send("Ses Maksimum 200 Olmak zorunda")

    player.node.send({
        op: "volume",
        guildId: message.guild.id,
        volume: volume_level
    });

    if(args[0] === 'normal' || args[0] === 'kapat' || args[0] === 'off'){
        player.node.send({
            op: "volume",
            guildId: message.guild.id,
            volume: 100
        });
        message.react("🔊")
    }

};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['volume'],
    permLevel: 0
  }
  exports.help = {
    name: 'ses',
    description: `Şarkı Sesini Ayarlarsınız`
  }
  