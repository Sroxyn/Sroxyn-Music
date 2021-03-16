exports.run = async (client, message, args) => {
  const  db  = require('quick.db')
    const player = message.client.music.get(message.guild.id);
    if (!player) return message.reply("Herhangi Bir şarkı çalmıyor");

    const { channel } = message.member.voice;
    if (!channel) return message.reply("");
    const np = player.queue.current

    try{
    let mesaj = await message.channel.messages.fetch(await db.get(`track.${np.title}`))
    mesaj.delete()
    }catch{player.stop()}
    //if (channel.id !== player.voice.channel) return message.reply("Başka bir ses kanalında kullanamassın");
    player.stop();
};
exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['skip'],
    permLevel: 0
  }
  exports.help = {
    name: 'geç',
    description: `Sonraki şarkıya geçersin`
  }

  