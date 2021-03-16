const { Manager } = require('erela.js')
const Spotify  = require("erela.js-spotify");
const { MessageEmbed } = require('discord.js');
const conf = require('../ayarlar.json')
const db = require('quick.db')
//const ColorThief = require("colorthief")
const chalk = require('chalk');
const  request = require('request')
const { SpotifyParser } = require('spotilink');

var authOptions = {
  url: 'https://accounts.spotify.com/api/token',
  headers: {
    'Authorization': `Basic ${conf.Spotify_AccesToken}`
  },
  form: {
    grant_type: 'client_credentials'
  },
  json: true
};


module.exports = client => {


  const clientID = conf.Spotify_ID
  const clientSecret = conf.Spotify_Secret

  client.music = new Manager({
    nodes: [
      {
        host: "localhost",
        port: 3333,
        password: "youshallnotpass"
      }
    ],
    plugins: [ 
      new Spotify(
        { 
          clientID, 
          clientSecret 
        }
        ) 
      ],
    autoPlay: true,
    secure: false,
    send: (id, payload) => {
      const guild = client.guilds.cache.get(id);
      if (guild) guild.shard.send(payload);
    }
  });
  const node = {
    host: 'localhost',
    port: 3333,
    password: 'youshallnotpass'
  };
  
  const spotilink =  new SpotifyParser(node, clientID, clientSecret);
  client.music.init(client.user.id);

  client.music.on("nodeConnect", node => {
      console.log(`Node "${node.options.identifier}" connected.`)
  })
  
  client.music.on("nodeError", (node, error) => {
      console.log(`Node "${node.options.identifier}" encountered an error: ${error.message}.`)
  })
  
  client.on("raw", d => client.music.updateVoiceState(d));

  client.music.on("trackStart", async (player, track) => {

    let trackss;
    if(!db.fetch(`sarki_isim.${player.guild}`)){
      trackss = track.title
    }else{
      trackss = db.fetch(`sarki_isim.${player.guild}`)
    }

   request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        var token = body.access_token;
        var options = {
          url: `https://api.spotify.com/v1/search?q=${encodeURI(trackss)}&type=track&offset=0&limit=1`,
          headers: {
            'Authorization': 'Bearer ' + token
          },
          json: true
        };

        let image;
        request.get(options, async function(error, response, body) {
          if(!body.tracks.items[0]){
            image = `https://img.youtube.com/vi/${track.identifier}/maxresdefault.jpg`
          }else{
            image = body.tracks.items[0].album.images[0].url
          }


    const channel = client.channels.cache.get(player.textChannel);
    //let renk = await ColorThief.getColor(`https://img.youtube.com/vi/${track.identifier}/maxresdefault.jpg`)
    //**[**\`00:00\`/\`${moment(track.duration).format("mm:ss")}\`**]**
    let regex = /([^[]+(?=]))/g
    let isim = track.title
    let yapimci = track.author
    .replace(regex, "")
    let np = new MessageEmbed()
    .setColor(client.guilds.cache.get(player.guild).me.displayColor)
    .setDescription(`**Şimdi Oynatılıyor:** \n [${isim.replace(/(?=(\[).+()\])/g, "")}](${track.uri}) **[**<@${track.requester.id}>**]**`)
    .setThumbnail(image)
    channel.send(np).then(m => {
      db.set(`track.${track.title}`, m.id)
      && m.delete({ timeout: track.duration })


    });
    // timeout: track.duration 
    db.set(`süre.${track.title}`, Date.now())
  })
};
});
});

 client.music.on("queueEnd", player => {
  const channel = client.channels.cache.get(player.textChannel);
  //channel.send("Şarkı sırası bitti");
  if(!player){
   setTimeout(() => {
    channel.send("5 dakikaa boyunca şarkı çalınmadığı için kanaldan çıktım");
    player.destroy();
   }, 1000 * 60 * 5);
  }
  if(player){
    return;
  }
  });

  
	client.music.on("socketClosed", (player, payload) => {
		if(payload.byRemote === true) player.destroy();
  });
  
	client.music.on("playerMove", (player, currentChannel, newChannel) => {
		if(!newChannel) player.destroy();
		else player.voiceChannel = newChannel;
  });

  require('../Efektler/Efekt');

  console.log(`${client.user.username} ismi ile giriş yapıldı!`);
  client.user.setStatus("dnd");



  client.user.setActivity("Sroxyn ❤ Sroxyn", {
  type: "PLAYING",
  status: "dnd"

});
  console.log(chalk(`▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬`))
  console.log(chalk.white.italic(`SroxynArtz#0001 Tarafından kodlanmıştır..                                       |`))
  console.log(chalk(`▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬`))
};



