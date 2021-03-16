const { MessageEmbed } = require('discord.js');
const { Utils } = require('erela.js')
const ms = require('ms')
var { getData, getPreview } = require("spotify-url-info");
//const ColorThief = require('colorthief');
const  db  = require('quick.db')

exports.run = async (client, message, args) => {

if(!message.member.voice.channel)return message.channel.send("Lütfen bir ses kanalına giriniz")
  if(!args[0])return message.channel.send("Lütfen Bir şarkı arayınız");
  const playerr = message.client.music.get(message.guild.id);
  const { channel } = message.member.voice;

  const player = message.client.music.create({
    guild: message.guild.id,
    voiceChannel: channel.id,
    textChannel: message.channel.id,
    volume: 70,
    selfDeafen: true
  });

  player.connect();
  player.setTextChannel(message.channel.id)
  
if (channel.id !== player.voiceChannel) return message.reply("Botla Aynı kanalda Olmalısın");

let searching = args.join(" ")
.replace("( )","")
.replace("[ ]", )

if(message.mentions.users.first()){
let user = message.mentions.users.first()
const activity = user.presence.activities.find(activity => activity.type === "LISTENING" && activity.name === "Spotify");
if (!activity) return message.channel.send(`Spotify Açık değil`); 

searching = `https://open.spotify.com/track/${activity.syncID}`
message.channel.send(`${user.username} Kişisinin Dinlediği şarkı Açılıyor`)
}else {
  searching = searching;
}

//console.log(searching)

client.music.search(`${searching}`, message.author).then(async res => {
    switch (res.loadType) {
      case 'NO_MATCHES':
        db.delete(`sarki_isim.${message.guild.id}`)
        if (!player.queue.current) player.destroy();
        message.reply('hiçbir sonuç bulunamadı.');
        break;
        
        case "TRACK_LOADED":
          db.set(`sarki_isim.${message.guild.id}`, res.tracks[0].title)
            player.queue.add(res.tracks[0]);
            message.channel.send(`\`${res.tracks[0].title}\` Adlı şarkı Kuyruğa Eklendi`);
            if (!player.playing) player.play()
            break;
        
        case "SEARCH_RESULT":
          db.set(`sarki_isim.${message.guild.id}`, args.join(" "))
          const track = res.tracks[0];
          player.queue.add(track)
          message.channel.send(`\`${track.title}\` Adlı şarkı Sıraya Eklendi`);
          if(!player.playing) player.play();

            break;
        case "PLAYLIST_LOADED":
          db.delete(`sarki_isim.${message.guild.id}`)
          player.queue.add(res.tracks)
          if (!player.playing && !player.paused && player.queue.size === res.tracks.length) player.play();
          let playlist_uzunluk = ms(res.playlist.duration)
          .replace("h", " Saat")
          .replace("m", " Dakika")
          .replace("s", " Saniye")

          if(args.join(" ").includes("spotify")){
            let spo_data = await getPreview(args.join(" "))
            //console.log(spo_data)
            //let renk = await ColorThief.getColor(spo_data.image)
            let embed = new MessageEmbed()
            .setColor(message.guild.me.displayColor)
            .setAuthor('Spotify','https://www.freepnglogos.com/uploads/spotify-logo-png/file-spotify-logo-png-4.png')
            .setDescription(`**Playlist Adı :** \`${res.playlist.name}\`
            **Playlist Uzunluğu :** \`${playlist_uzunluk}\`
            **Şarkı Uzunluğu :** \`${res.tracks.length} Şarkı\``)
            .setThumbnail(spo_data.image)
            message.channel.send(embed)
          }

            if(args.join(" ").includes("youtube")){
              //let renkk = await ColorThief.getColor(`https://img.youtube.com/vi/${res.tracks[0].identifier}/maxresdefault.jpg`)
              let emb = new MessageEmbed()
              .setColor(message.guild.me.displayColor)
              .setAuthor('Youtube','https://assets.stickpng.com/images/580b57fcd9996e24bc43c545.png')
              .setDescription(`**Playlist Adı :** \`${res.playlist.name}\`
              **Playlist Uzunluğu :** \`${playlist_uzunluk}\`
              **Şarkı Uzunluğu :** \`${res.tracks.length} Şarkı\``)
              .setThumbnail(`https://img.youtube.com/vi/${res.tracks[0].identifier}/maxresdefault.jpg`)
              message.channel.send(emb)
            }

            message.channel.send(`\`${res.playlist.name}\` Adlı playlist Kuyruğa eklendi \`${res.tracks.length}\` Şarkı içeriyor`);
            if(!player.playing) player.play()
            break;
    }
})
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: 0
  }
  exports.help = {
    name: 'p',
    description: `Şarkı yada playlist oynatırsın`
  }
  
  