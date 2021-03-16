const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args) => {

    const player = message.client.music.get(message.guild.id);
    if (!player) return message.reply("herhangi bir şarkı açık değil");

    const queue = player.queue;
    const embed = new MessageEmbed()
      .setAuthor(`${message.guild.name} Kişininin Playlisti`);


    const multiple = 10;
    const page = args.length && Number(args[0]) ? Number(args[0]) : 1;

    const end = page * multiple;
    const start = end - multiple;

    const tracks = queue.slice(start, end);

    /*if (!tracks.length) embed.setDescription(`No tracks in ${page > 1 ? `page ${page}` : "the queue"}.`);
    else embed.setDescription(tracks.map((track, i) => `${start + (++i)} - [${track.title}](${track.uri})`).join("\n"));
    */
   let sayi = 1
    return message.channel.send(`${message.author.tag} Kişininin Playlisti\n\n⬐ Şuanki Şarkı\n1) ${queue.current.title}\n⬑ Şuanki Şarkı\n\n${tracks.slice(0, 10).map((track,i) => { return `${sayi++}) ${track.title}`}).join("\n")}\n\n${queue.length > 10 ? `Ve ${queue.length - 10} Şarkı daha...` : ``}`.trim(),{code: "nim"})

};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: 0
  }
  exports.help = {
    name: 'q',
    description: `Şarkı Kuyruğunu görürsünüz`
  }
  