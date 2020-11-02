import discord
from discord.utils import get
from discord.ext import commands
import json
import re
import sys


token_file_name = "./token.txt"
TOKEN_FILE = open(token_file_name, 'r')
TOKEN = TOKEN_FILE.readline()

client = discord.Client()

class Bot(commands.Bot):

    def __init__(self):
        super().__init__(command_prefix="$", pm_help=None, description="LuNiZzers Detector")

    async def on_ready(self):
        print("Bot Hazır ")

    async def on_message(self, message):

        ids = list()
        ids.append(message.author.id)     
           
        if message.author.bot == client.user:
            return
        try:
            priviliged = ["181008524590055424", "163412984947933184","627113129465085973","271337670859423755","135407379314507776","253153886540398603","726111326870700193","159985870458322944","83010416610906112"]
            priv_channel = ["605130756729077762"]
            channels = []
            keywords = []
            id = "<@!181008524590055424>"
            if str(message.author.id) in priviliged:
                return
            elif str(message.channel.id) not in priv_channel:
                return
            else:
                if str(message.author.id) != "772549756853420042":
                    with open('./test.json', 'r') as json_file: 
                        data = json.load(json_file)
                        y_msg = message.content.lower()              
                        r_y_msg = list(re.split("[ !@#$%^&*()'_+-={}[]|:\";'<>?,./ ]", y_msg)) # Yazılan mesaj tek tek liste elemanı olarak atanıyor.
                        
                        for i in data:
                            for y in r_y_msg:                                                   
                                if y in data[i]["keywords"]:   # çıktının hangi kanal ve kannalara ait olacağını belirlemek için keywordsleri bir listeye atıyoruz.
                                    if i in channels:                                   
                                        pass                                    
                                    else:                                   
                                        channels.append(i)                                
                                    if y in keywords:
                                        pass                                                   
                                    else:                                                                     
                                        keywords.append(y)                                                                                                    
                                else:
                                    continue
                    if len(channels) == 0:
                        if ( id in  message.content):
                            await message.channel.send("> {} \nDostum bu etiketin işe yarayacağına gerçekten emin misin? <@{}>".format(message.content.replace("<@!181008524590055424>","Lunizz"),message.author.id))
                        else:
                            return
                    elif len(channels) == 1:
                        if ( id in  message.content):
                            await message.channel.send("> {} \nDostum bu etiketin işe yarayacağına gerçekten emin misin? <@{}> ".format(message.content.replace("<@!181008524590055424>","Lunizz"),message.author.id))
                        else:
                            if str(message.channel.id) == str(data[channels[0]]["channel_id"]):
                                pass
                            else:
                                await message.channel.send("> {} \nGörünüşe göre sorunu <#{}> kanalına yazman daha iyi olacaktır. <@{}>".format(message.content.replace("<@!181008524590055424>","Lunizz"),str(data[channels[0]]["channel_id"]),message.author.id))
                                #await message.delete()   
                    elif len(channels) > 1:
                        if ( id in  message.content):
                            await message.channel.send("> {} \nDostum bu etiketin işe yarayacağına gerçekten emin misin? <@{}> ".format(message.content.replace("<@!181008524590055424>","Lunizz"),message.author.id))
                        else:
                            channel_names = ""
                            for i in channels:
                                channel_names += "<#{}> ".format(data[i]["channel_id"])                     
                            flag = False
                            for x in channels:
                                if (str(message.channel.id) == data[x]["channel_id"]):
                                    flag = True
                            if flag == False:
                                await message.channel.send("> {} \nSorunu {} kanallarından birine yazman daha iyi olacaktır. <@{}>".format(message.content.replace("<@!181008524590055424>","Lunizz"),channel_names,message.author.id))
                                #await message.delete()                    
                else:
                    pass
        except:
            print(sys.exc_info()[0])
   
bot = Bot()
bot.run(TOKEN)
