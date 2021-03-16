
exports.run = async(client, message, args) => {
  const  db  = require('quick.db')
  
    let { channel } = message.member.voice
    if(!channel) return message.channel.send("Bir ses kanalında değilsin")
    const player = message.client.music.get(message.guild.id);
    if(!player)return message.channel.send("Sırada herhangi bir şarkı çalmıyor")
    const np = player.queue.current

    try{
      let mesaj = await message.channel.messages.fetch(db.get(`track.${np.title}`))
      mesaj.delete()
      player.destroy()
      }catch{
        player.destroy()
      }

    message.channel.send("Müzik Oynatıcı başarılı bir şekilde durduruldu")
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['durdur'],
    permLevel: 0
  }
  exports.help = {
    name: 'stop',
    description: `Botu Kapatır`
  }