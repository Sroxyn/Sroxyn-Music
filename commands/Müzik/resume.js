exports.run = async (client, message, args) => {
    const player = message.client.music.get(message.guild.id);
    if (!player) return message.reply("Herhangi Bir şarkı çalmıyor");

    const { channel } = message.member.voice;
    if (!channel) return message.reply("Herhangi bir ses kanalında Değilsin");
    //if (channel.id !== player.voice.channel) return message.reply("Başka bir ses kanalında kullanamassın");
    player.pause(false);
    message.react("▶️")
};
exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['resume'],
    permLevel: 0
  }
  exports.help = {
    name: 'resume',
    description: `Sonraki şarkıya geçersin`
  }

  