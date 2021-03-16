const { MessageEmbed } = require("discord.js");
const lyricsFinder = require("lyrics-finder");

exports.run = async (client,message,args) => {

    
    const player = message.client.music.get(message.guild.id);

    let title;
    let resim;
    let link;


    if(!args[0]){
        let queue = player.queue;
        title = queue.current.title
        resim = queue.current.thumbnail
        link = queue.current.uri
    }else {
        title = args.join(" ")
        resim;
        link;
    };


      lyrics = await lyricsFinder("",title);
      console.log(lyrics)
      if(!lyrics)return message.channel.send("İstediğiniz Lyrics Bulunamadı lütfen tekrar arama yapmayı deneyiniz yada kendiniz yazarak arayınız")

    let lyricsEmbed = new MessageEmbed()
      .setTitle(title)
      .setURL(link)
      .setThumbnail(resim)
      .setDescription(lyrics)
      .setColor(message.guild.me.displayColor)
      .setTimestamp();

    if (lyricsEmbed.description.length >= 2048)
    lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 2045)}...`;
    return message.channel.send(lyricsEmbed).catch(console.error);
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: 0
  }
  exports.help = {
    name: 'ly',
    description: `Şarkı Sözlerini Gösterir`
  }
