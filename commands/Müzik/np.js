exports.run = async (client, message, args) => {
    const { MessageEmbed } = require('discord.js')
    const  db  = require('quick.db')
    const ms = require('ms')
    const moment = require('moment');
    //const ColorThief = require('colorthief')

    const player = message.client.music.get(message.guild.id);
    if(!player)return message.reply("herhangi bir şarkı açık değil");

    const np = player.queue.current
    if(!np)return message.reply("herhangi bir şarkı açık değil");

    const np_sure = ms(np.duration)
    .replace("m", " Dakika")
    .replace("h", " Hours")
    .replace("s", " Saniye")

    let start = db.get(`süre.${np.title}`)
    console.log(db.get(`süre.${np.title}`))
    let end = np.duration
    
    let progressBar = (value, maxValue, size) => {
    const percentage = value / maxValue;
    const progress = Math.round((size * percentage));
    const emptyProgress = size - progress;
  
    const progressText = '<:mid_light:768258403516416010>'.repeat(progress);
    const emptyProgressText = '<:mid_dark:768258403461496852>'.repeat(emptyProgress);
  
    const bar = `${moment(Date.now() - start).format("mm:ss")} <:start:768258403784720384>${progressText}${emptyProgressText}<:end:768258403205906433> ${moment(end).format("mm:ss")}`;
    return bar;
    };

    //let renk = await ColorThief.getColor(`https://img.youtube.com/vi/${np.identifier}/maxresdefault.jpg`)
    let embed = new MessageEmbed()
    .setColor(message.guild.me.displayColor)
    .setAuthor(np.title,`https://cdn.discordapp.com/emojis/754763541042561075.gif?v=1`, np.uri)
    .setDescription(`**Kanal:** \`${np.author}\`
    **Şarkıyı Açan:** **[**${np.requester}**]**

    ${progressBar(moment(Date.now() - start).format("mmss") / moment(end).format("mmss"),1,10)}
    `)
    .setThumbnail(`https://img.youtube.com/vi/${np.identifier}/maxresdefault.jpg`)
    message.channel.send(embed)
    console.log(Date.now())
    console.log(db.get(`süre.${np.title}`))
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: 0
  }
  exports.help = {
    name: 'np',
    description: `Şuan yürütülen şarkıyı gösterir`
  }
  