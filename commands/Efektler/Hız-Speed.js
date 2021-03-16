const { MessageEmbed } = require('discord.js')

exports.run = async (client, message, args) => {
  const player = message.client.music.get(message.guild.id)
    if(!player)return message.channel.send("Herhangi Bir şarkı Çalmıyor")

  const { channel } = message.member.voice

  if (!channel)return message.channel.send("Bir sesli kanalda Olman Lazım")

    if(!args[0]){
  let embed = new MessageEmbed()
    .setColor("RANDOM")
    .setDescription(`1️⃣ - 0.25 (Çok yavaş)
    2️⃣ - 0.50
    3️⃣ - 1.50
    4️⃣ - 2.00 (En Hızlı)`)
    .setTitle("Kademe Belirleyiniz")
    message.channel.send(embed)
    }
    if(args[0] === '1'){
        player.setSpeed(0.25)
        message.channel.send(`Şarkı \`0.25\` Hızına Düşürülüyor`)
    }
    if(args[0] === '2'){
        player.setSpeed(0.50)
        message.channel.send(`Şarkı \`0.50\` Hızına Düşürülüyor`)
    }
    if(args[0] === 'kapat' || args[0] === 'kapa' || args[0] === 'off' || args[0] === 'normal'){
        player.setSpeed(1.00)
        message.channel.send("Normal Hıza Geçiliyor")
    }
    if(args[0] === '3'){
        player.setSpeed(1.50)
        message.channel.send(`Şarkı \`1.50\` Hızına Yükseltiliyor`)
    }
    if(args[0] === '4'){
        player.setSpeed(2.00)
        message.channel.send(`Şarkı \`2.00\` Hızına Yükseltiliyor`)
    }
}
exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['hız'],
    permLevel: 0
}
exports.help = {
    name: 'hız',
    description: `Şarkının Hızını kademeli olarak değiştirir`
}
  