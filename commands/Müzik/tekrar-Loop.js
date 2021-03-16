exports.run = async(client, message, args) => {
    const player = message.client.music.get(message.guild.id);
    if (!player) return message.reply("Herhangi bir şarkı çalmıyor");

    if (args.length && /playlist/i.test(args[0])) {
        player.setQueueRepeat(!player.queueRepeat);
        const queueRepeat = player.queueRepeat ? "Aktif" : "Kapalı";
        return message.reply(`**Playlist Tekrarı :** \`${queueRepeat}\``);
      }
  
      player.setTrackRepeat(!player.trackRepeat);
      const trackRepeat = player.trackRepeat ? "Aktif" : "Kapalı";
      return message.reply(`**Şuanki şarkı tekrarı :** \`${trackRepeat}\``);

};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['tekrar'],
    permLevel: 0
  }
  exports.help = {
    name: 'loop',
    description: `Şarkyı/Playlisti Döngü haline alır`
  }