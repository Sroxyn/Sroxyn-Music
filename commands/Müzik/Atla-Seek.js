exports.run = async (client, message, args) => {

    const player = message.client.music.get(message.guild.id);
    if (!player) return message.reply("Herhangi Bir şarkı çalmıyor");

    const { channel } = message.member.voice;
    if (!channel) return message.reply(" Bir ses kanalına girmen lazım");

    let sıra = args[0]
    //if (channel.id !== player.voice.channel) return message.reply("Başka bir ses kanalında kullanamassın");
    player.seek(sıra)
};
exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['seek'],
    permLevel: 0
  }
  exports.help = {
    name: 'atla',
    description: `Belirttiğiniz Şarkıya Geçersiniz`
  }

  