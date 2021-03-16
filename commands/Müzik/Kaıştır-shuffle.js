exports.run = async (client, message, args) => {

    const player = message.client.music.get(message.guild.id);
    if (!player) return message.reply("Herhangi Bir şarkı çalmıyor");

    const { channel } = message.member.voice;
    if (!channel) return message.reply(" Bir ses kanalına girmen lazım");
    //if (channel.id !== player.voice.channel) return message.reply("Başka bir ses kanalında kullanamassın");
    if(player.queue.shuffle === true){
      player.queue.shuffle(false)
      message.channel.send("Karıştırma kapalı")
    }else{
    player.queue.shuffle();
    message.channel.send("Karıştırma açık")
    }
};
exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['karıştır'],
    permLevel: 0
  }
  exports.help = {
    name: 'shuffle',
    description: `Playlisti karıştırısın`
  }

  