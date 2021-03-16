const { MessageEmbed, Message } = require('discord.js');
/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 * @param {Args[]} args 
 */

exports.run = async (client, message, args) => {

if(!message.member.voice.channel)return message.channel.send("Lütfen bir ses kanalına giriniz")
  if(!args[0])return message.channel.send("Lütfen Bir şarkı arayınız");
  const playerr = message.client.music.get(message.guild.id);
  const { channel } = message.member.voice;
  //if (channel.id !== playerr.voice.channel) return message.reply("Botla Atnı kanalda Olmalısın");

  const player = message.client.music.create({
    guild: message.guild.id,
    voiceChannel: channel.id,
    textChannel: message.channel.id,
    volume: 70,
    selfDeafen: true
  });
  player.connect();


client.music.search(args.join(" "), message.author).then(async res => {
    switch (res.loadType) {
      case 'NO_MATCHES':
        if (!player.queue.current) player.destroy();
        message.reply('hiçbir sonuç bulunamadı.');
        break;
        case "SEARCH_RESULT":
          let max = 5, collected, filter = (m) => m.author.id === message.author.id && /^(\d+|end)$/i.test(m.content);
          if (res.tracks.length < max) max = res.tracks.length;
  
          const results = res.tracks
              .slice(0, max)
              .map((track, index) => `${++index} - \`${track.title}\``)
              .join('\n');
          const resultss = new MessageEmbed()
              .setDescription(results)
              .setColor(message.guild.me.displayColor)
              .setFooter("Seçmek için 30 saniyeni var | İptal için 'İptal' yazınız")
          let mesaj = await message.channel.send(resultss);
  
          try {
            collected = await message.channel.awaitMessages(filter, { max: 1, time: 30e3, errors: ['time'] });
          } catch (e) {
            if (!player.queue.current) player.destroy();
            return message.reply("Bir seçim sağlamadınız.");
          }
          const first = collected.first().content;
          if (first.toLowerCase() === 'iptal') {
            if (!player.queue.current) player.destroy();
            return message.channel.send('Seçim iptal edildi.');
          }
          const index = Number(first) - 1;
          if (index < 0 || index > max - 1) return message.reply(`numara çok küçük veya çok büyük (1-${max}).`);
  
          const track = res.tracks[index];
          player.queue.add(track);
          mesaj.delete()
          message.delete()
          message.channel.send(`\`${track.title}\` Adlı şarkı Sıraya Eklendi`);
          if(!player.playing) player.play();

          break;
    }
})
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['ara'],
    permLevel: 0
  }
  exports.help = {
    name: 'search',
    description: `Şarkı Ararsın`
  }
  
  