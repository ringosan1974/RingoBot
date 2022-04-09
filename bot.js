const {Client, Intents, Message} = require('discord.js');
const dotenv = require('dotenv');

const client = new Client({partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
intents: ['DIRECT_MESSAGES',
          'DIRECT_MESSAGE_REACTIONS',
          'GUILD_MESSAGES',
          'GUILD_MESSAGE_REACTIONS',
          'GUILDS']});
const token = process.env.DISCORD_TOKEN;
const prefix = 'r!';

dotenv.config();

//名言クラス
class Wise_Saying {
  constructor(wisesaying, people) {
    this.wisesaying = wisesaying;
    this.people = people;
  }
}

client.on('ready', async() => {
  console.log(`${client.user.username} でログイン中。`)
})

client.on('messageCreate', async msg => {
  if(!msg.content.startsWith(prefix)) return;
  const [command, ...args] = msg.content.slice(prefix.length).split(' ');
  if (command === 'save'){
    msg.fetch(msg.reference.messageId)
      .then(message => {
        const content_wisesaid = new Wise_Saying(message.content, msg.mentions.repliedUser.username);
        console.log(content_wisesaid);
        //TODO: データベースにcontent_wisesaidを保存する
      });
    msg.channel.send('名言を保存しました。')
  }
})

//.envのDISCORD_TOKENでログイン
client.login(process.env.DISCORD_TOKEN);