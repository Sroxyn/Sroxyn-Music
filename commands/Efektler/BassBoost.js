exports.run = async (client, message, args) => {

    const kademeler = {
        kapat: 0.0,
        düşük: 0.10,
        orta: 0.15,
        yüksek: 0.99,
        ultra: 9.00
      };

    const player = message.client.music.get(message.guild.id);
    if (!player) return message.reply("Herhangi bir şarkı çalmıyor");

    const { channel } = message.member.voice;
    
    if (!channel) return message.reply("Herhangi bir ses kanalına girmelisin");
    if (channel.id !== player.voiceChannel) return message.reply("Bot ile aynı kanalda olmalısın");

    let level = "kapat";
    if (args.length && args[0].toLowerCase() in kademeler) level = args[0].toLowerCase();

    const bands = new Array(3)
      .fill(null)
      .map((_, i) =>
        ({ band: i, gain: kademeler[level] })
      );
    player.setEQ(...bands);

    return message.reply(`Bass ${level} olarak ayarlandı`);

};
exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: 0
  }
  exports.help = {
    name: 'bass',
    description: `Şarkıya Bass Efekti uygular`
  }
  
  