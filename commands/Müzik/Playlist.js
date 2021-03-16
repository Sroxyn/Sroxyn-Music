const Discord = require('discord.js');
const ayarlar = require('../../ayarlar.json');
const request = require('request');
const tinycolor = require('tinycolor2');
const { MessageEmbed, Permissions } = require('discord.js');
const convert = require("parse-ms");
var prefix = ayarlar.prefix;
const ms = require('ms')
var { getData, getPreview } = require("spotify-url-info");
var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Authorization': 'Basic ZGNiMDBlYzJkMDJjNGIwMmE2ZDFmOGM3ZTQwYzA0YzI6M2EwMGY4NWU4ODllNGMzNWFlODRiODdhOWQ3NDE3YzE='
    },
    form: {
      grant_type: 'client_credentials'
    },
    json: true
  };
exports.run = async (client, message, args) => {
    
    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
    
        // use the access token to access the Spotify Web API
        var token = body.access_token;
        var options = {
          url: `https://api.spotify.com/v1/search?q=${encodeURI(args.slice(0).join(' '))}&type=playlist&offset=0&limit=1`,
          headers: {
            'Authorization': 'Bearer ' + token
          },
          json: true
        };
        request.get(options, async function(error, response, body) {
            let res = body.playlists.items[0]
            let embed = new Discord.MessageEmbed()
            .setTitle(res.name)
            .setURL(res.external_urls.spotify)
            .addField(`> **Playlist sahibi:**`, res.owner.display_name)
            .addField(`> **Şarkı Sayısı:**`, res.tracks.total)
            .setThumbnail(res.images[0].url)
            .setImage(`https://scannables.scdn.co/uri/plain/png/000000/white/1080/spotify%3Aplaylist%3A${res.id}?width=1022&height=256`)
            message.channel.send(embed).then(async e => {
              await e.react('▶️')
              await e.react("❌")
  
              const oynat = (reaction, user) => reaction.emoji.name === '▶️' && user.id === message.author.id;
              const carpiFilter = (reaction, user) => reaction.emoji.name === '❌' && user.id === message.author.id;
        
            
              const oyna = e.createReactionCollector(oynat, { timer: 15000 });
            const carpi = e.createReactionCollector(carpiFilter, { timer: 15000 });
              
  
             oyna.on('collect', r => {
              const { channel } = message.member.voice;

              const player = message.client.music.create({
                guild: message.guild.id,
                voiceChannel: channel.id,
                textChannel: message.channel.id,
                volume: 70,
                selfDeafen: true
              });
            
              player.connect();

              client.music.search(`${res.external_urls.spotify}`, message.author).then(async ress => {
                switch (ress.loadType) {
                  case 'NO_MATCHES':
                    if (!player.queue.current) player.destroy();
                    //message.reply('hiçbir sonuç bulunamadı.');
                    break;
                    
                    case "PLAYLIST_LOADED":
                      //db.delete(`sarki_isim.${message.guild.id}`)
                      player.queue.add(ress.tracks)
                      if (!player.playing && !player.paused && player.queue.size === ress.tracks.length) player.play();
                      let playlist_uzunluk = ms(ress.playlist.duration)
                      .replace("h", " Saat")
                      .replace("m", " Dakika")
                      .replace("s", " Saniye")
            
                        let spo_data = await getPreview(res.external_urls.spotify)
                        //console.log(spo_data)
                        //let renk = await ColorThief.getColor(spo_data.image)
                        let embed = new MessageEmbed()
                        .setColor(message.guild.me.displayColor)
                        .setAuthor('Spotify','https://www.freepnglogos.com/uploads/spotify-logo-png/file-spotify-logo-png-4.png')
                        .setDescription(`**Playlist Adı :** \`${ress.playlist.name}\`
                        **Playlist Uzunluğu :** \`${playlist_uzunluk}\`
                        **Şarkı Uzunluğu :** \`${ress.tracks.length} Şarkı\``)
                        .setThumbnail(spo_data.image)
                        message.channel.send(embed)
                        ress.delete()
                        if(!player.playing) player.play()
                        break;
                      }
                })
                r.users.remove(message.author.id)
        })
            carpi.on("collect", r => {
              e.delete();
            })
      
      }).catch((error) => {
      })
           /*
            const ColorThief = require('colorthief');
            let renkcik2 = await ColorThief.getPalette(body.tracks.items[0].album.images[0].url , 5)
            function rgb_to_hex(red, green, blue) {
              const rgb = (red << 16) | (green << 8) | (blue << 0);
              return (0x1000000 + rgb).toString(16).slice(1);
            }     
            let deneme = rgb_to_hex(renkcik2[0], renkcik2[1], renkcik2[2])
            var colorcuk = tinycolor(deneme.toUpperCase());
            let color = '';
            if (colorcuk.isDark() === true) {
                color = 'white'
            }else if (colorcuk.isLight() === true) {
                color = 'black'
            }
            const ending = convert(body.tracks.items[0].duration_ms);
            let minutes = ending.minutes < 10 ? `0${ending.minutes}` : ending.minutes;
            let seconds = ending.seconds < 10 ? `0${ending.seconds}` : ending.seconds + ending.nanoseconds;
            let zaman = `${minutes}:${seconds}`;
            let embed = new Discord.MessageEmbed()
            .setColor(0x2F3136)  
            //.setThumbnail(body.tracks.items[0].images)
           .addField('Başlık' ,`[${body.tracks.items[0].name}](${body.tracks.items[0].external_urls.spotify})`)	
           .addField('Sanatçı', `[${body.tracks.items[0].album.artists[0].name}](${body.tracks.items[0].album.artists[0].external_urls.spotify})`)
           .addField('Albüm', `[${body.tracks.items[0].album.name}](${body.tracks.items[0].album.external_urls.spotify})`)
           .addField('Süre' , zaman)
           .addField('Çıkış Tarihi', body.tracks.items[0].album.release_date)
           .addField('Popülarite', `%${body.tracks.items[0].popularity}`)
           .addField('Ön İzleme', `[Ön İzleme İçin Tıklayınız](${body.tracks.items[0].preview_url})`)
           .setThumbnail(body.tracks.items[0].album.images[0].url)
            .setFooter(`${client.user.username}`, client.user.displayAvatarURL())
            .setImage(`https://scannables.scdn.co/uri/plain/png/${deneme}/${color}/1080/spotify%3Atrack%3A${body.tracks.items[0].id}?width=1022&height=256`)
            .setColor(`${deneme}`)
            message.channel.send({ embed: embed })
            console.log(body.tracks.items[0])
         console.log(body.tracks.items[0].id);
         */
        });
      }
    });

};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "0"
};

exports.help = {
  name: "playlist",
  description: "Kişilere Rol Yetkisi Verir",
  usage: "spotify <mesaj>"
};







