//ライブラリのrequire
const {Client, Intents} = require('discord.js');
const httpcli = require('cheerio-httpcli');
const dotenv = require('dotenv');
const fs = require('fs');

//Botの設定
const client = new Client({partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
intents: ['DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILDS']});
const token = process.env.DISCORD_TOKEN;
const prefix = 'r!';  //コマンドの印
const filename = 'tododata.txt';    //ここにtodoを保存する

//.env読み込み
dotenv.config();

//botをログインさせる
client.on('ready', async() => {
  console.log(`${client.user.tag} でログイン中。`)
})

//スクレイピングの設定
let counter = 0;
httpcli.download
.on('ready',(stream) => {
  const write = fs.createWriteStream(`.\\image\\image${counter}.png`);
  counter++;
  write
    .on('finish',() => {
      console.log(stream.url.href + 'をダウンロードしました');
    })
    .on('error', console.error);
  stream
    .on('data',(chunk) => {
      write.write(chunk);
    })
    .on('end',() => {
      write.end();
    });
})
.on('error',(err) => {
  console.error(err.url + 'をダウンロードできませんでした' + err.message);
})
.on('end',() => {
  console.log('ダウンロードが完了しました');
});

httpcli.download.parallel = 4;

//todo入力
client.on('messageCreate', async msg => {
  if(!msg.content.startsWith(prefix)) return;
  //botのコマンドで引数を使えるようにする
  const [command, ...args] = msg.content.slice(prefix.length).split(' ');
  if(command === 'add'){
    if(!args[0]){
      msg.channel.send('todoを入力してください。');
      return;
    }
    for(let i = 0; i < args.length; i++){
      //ファイルにtodoを書き込み
      fs.appendFileSync(filename, args[i] + ' ');
      msg.channel.send('今日のtodoを追加しました。');
    }
  //todoをファイルから読み込んで表示
  }else if(command === 'disp'){
    const tododata = fs.readFileSync(filename);
    const [data, ...dataargs] = String(tododata).split(' ');
    msg.channel.send('今日のタスクは終わりましたか？');
    msg.channel.send(String([data, ...dataargs]));
  //画像をスクレイピング
  }else if(command === 'downimg'){
    if(!(args[0] && args[1])){
      msg.channel.send('引数を指定してください');
      return;
    }
    httpcli.fetch(args[0],(err, $, res, body) => {
      $(args[1]).download();
      console.log('ok');
    });
  }
})

//.envに書いたDISCORD_TOKENでログイン
client.login(process.env.DISCORD_TOKEN);