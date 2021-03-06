const { time } = require('console');
const Discord = require('discord.js');
const dotenv = require('dotenv');
const client = new Discord.Client();
const fs = require('fs');
const { PassThrough } = require('stream');
// Environment Variables
let messageIDMatcher = {};

dotenv.config({
  path: "./config/config.env",
});
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});
//                    modz                   taç                  cr3w                    droidz                c0re              botun rolü
let priviliged = ["605125919643926617", "699359491300261988", "842914125360922624", "605133230135312386", "605141526636396565", "811514595697098783"] // bot rolü her zaman sonda olmalı
let botid = "772549756853420042";
let priv_channel = ["605130756729077762"]
let lunizzid = ["<@!181008524590055424>", "<@181008524590055424>"]

client.on('message', async msg => {
  let privBotFlag = false
  if(msg.content.startswith('!google')){
    return;
  }
  if (msg.author.bot) {
    if (msg.author.id !== botid) {
      privBotFlag = true
    }
  }
  if (!privBotFlag && msg.channel.type === "text") {
    var date = new Date();
    if (Object.keys(messageIDMatcher).length > 0) {
      for (i in messageIDMatcher) {
        if ((date.getTime() - messageIDMatcher[i]["timestamp"]) >= 10 * 60 * 1000) {
          delete messageIDMatcher[i]; //burda silmemek gerekebilir
        }
      }
    }
    if (msg.author.id === botid) {
      let temp = msg.content.split(" ");
      messageIDMatcher[msg.id] = {
        "msgid": temp[temp.length - 1],
        "timestamp": date.getTime()
      }
      temp.pop();
      await msg.edit(temp.join(" "));
      await msg.react("👍");
    }
    let channel_list = [];
    let keyword_list = [];
    let keywords = fs.readFileSync('test.json', 'utf8', function (err, data) {
      if (err) {
        return console.log(err);
      }
      return data;
    });

    let dictkw = JSON.parse(keywords);
    let priviliged_user_flag = false;
    try {
      userroles = msg.member.roles.cache.toJSON();
    }
    catch (e) {
      console.log("entering catch block");
      console.log(msg)
      console.log(e);
      console.log("leaving catch block");
    }
    for (i in userroles) {
      for (j in priviliged) {
        if (priviliged[j] === userroles[i]["id"]) {
          priviliged_user_flag = true;
        }
      }
    }

    let channel_flag = false;
    for (i in priv_channel) {
      if (priv_channel[i] === msg.channel.id) {
        channel_flag = true;
      }
    }
    if (botid === msg.author.id) {
      return;
    }
    else if (priviliged_user_flag) {
      return;
    } else {
      if (channel_flag) {
        let channelsinmessage = [];
        let temp = msg.content.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, " ");
        temp = temp.toLowerCase();
        temp = temp.split(" ");
        let channel_chooser = false;
        for (i in dictkw) {
          for (j in dictkw[i]["keywords"]) {
            for (k in temp) {
              if (dictkw[i]["keywords"][j] === temp[k]) {
                let isExist = false;
                if (channel_list.length === 0) {
                  channel_list.push(JSON.parse(keywords)[i]["channel_id"]);
                  channel_chooser = true;
                } else {
                  for (l in channel_list) {
                    if (channel_list[l] === dictkw[i]["channel_id"]) {
                      isExist = true;
                    }
                  }
                  if (!isExist) {
                    channel_list.push(JSON.parse(keywords)[i]["channel_id"]);
                    channel_chooser = true;
                  }
                }
              }
            }
          }
        }
        if (channel_chooser) {
          if (channel_list.length === 1) {
            await msg.channel.send("> " + msg.content.replaceAll("\n", "\n > ").replaceAll("<@!181008524590055424>", "Lunizz").replaceAll("<@181008524590055424>", "Lunizz").replaceAll("@everyone", " ").substring(0,1000) + " \nGörünüşe göre sorunu <#" + channel_list[0] + "> kanalına yazman daha iyi olacaktır. <@" + msg.author.id + "> . Mesajın kendini imha etmesini istiyorsan 👍 'a basabilirsin. " + msg.id);
          } else {
            let temp_text = "";
            for (i in channel_list) {
              temp_text += "<#" + channel_list[i] + "> ";
            }
            await msg.channel.send("> " + msg.content.replaceAll("\n", "\n > ").replaceAll("<@!181008524590055424>", "Lunizz").replaceAll("<@181008524590055424>", "Lunizz").replaceAll("@everyone", " ").substring(0,1000) + " \nGörünüşe göre sorunu " + temp_text + "kanallarından birine yazman daha iyi olacaktır. <@" + msg.author.id + "> . Mesajın kendini imha etmesini istiyorsan 👍 'a basabilirsin. " + msg.id);
          }
        }
      }
    }
  }
});


client.on('messageReactionAdd', async msg => {
  if (msg.users.cache.lastKey() === botid) { // 👍 olup olmadığını kontrol et
    return;
  }
  // if (msg.message.reactions.cache.get("👍").count === 1){
  //   return;
  // }
  else {
    let temp = msg.message.content.split(" ")[msg.message.content.split(" ").length - 1];
    if (temp === "✅") {
      return;
    } else if (msg.message.author.id === botid) { // her mesaj için reaksiyon ile alakalı mesaj sonu kontrolü yapılıyor.
      if (typeof messageIDMatcher[msg.message.id] === "undefined") {
        return;
      } else {
        console.log(msg.message.id)
        console.log(messageIDMatcher[msg.message.id]["msgid"]);
        await msg.message.channel.fetch(messageIDMatcher[msg.message.id]["msgid"])
          .then(async channel => {
            reactedmessage = await channel.messages.cache.get(messageIDMatcher[msg.message.id]["msgid"])
            let reactUsers = msg.users.cache.array();
            for (i in reactUsers) {
              if (reactedmessage.author.id === reactUsers[i].id) {
                await msg.message.edit(msg.message.content + " ✅");
                await reactedmessage.delete();
                await msg.message.delete();
                console.log("===")
                console.log(msg.message.content)
                console.log(reactUsers[i].id)
                console.log("===")
                return;
              }
            }
            for (i in reactUsers) {
              await msg.message.guild.members.fetch(reactUsers[i].id)
                .then(async message => {
                  for (i in priviliged) {
                    let memberroles = await message._roles;
                    for (k in memberroles) {
                      if (i < (priviliged.length - 1) && memberroles[k] === priviliged[i]) {
                        await msg.message.edit(msg.message.content + " ✅");
                        await msg.message.channel.fetch(messageIDMatcher[msg.message.id]["msgid"])
                          .then(async message => {
                            await message.messages.cache.get(messageIDMatcher[msg.message.id]["msgid"]).delete();
                          })
                          .catch(err => console.log(err));
                        await msg.message.delete();
                        console.log("===botdisi")
                        console.log(msg.message.content)
                        console.log(reactUsers[i].id)
                        console.log("===botdisi")
                        return;
                      }
                    }
                  }
                })
                .catch(err => console.log(err));
            }
          })
          .catch(err => console.log(err));
      }
    }
  }
})
client.login(process.env.DISCORD_TOKEN);