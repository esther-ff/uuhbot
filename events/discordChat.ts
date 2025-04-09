import { MinecraftSide } from '../chatter';
import { DiscordBotSide } from '../discord_side'
import { handleIfCommand } from '../commands/handleCmd';
export function initEvent(mcBot: MinecraftSide, discordBot: DiscordBotSide) {
  discordBot.client.on("messageCreate", (msg) => {
    // `discordBot.client.user.id` cannot be null.
    // if the channel is the one selected for our guild chat
    // and the message's author id is not our bot's id
    // send the message

     if (msg.channelId === discordBot.channelId()) {
               if (msg.author.id !== discordBot.client.user!.id)
             {
              let author = msg.author.displayName;

              // this could be moved inside the `chat` function
              // to avoid creating this string even if it's going to be 
              // filtered out.
              let actualMsg = `${author}: ${msg.toString()}`;
              mcBot.chat(actualMsg);    
             }     
      } else {
        console.log("hier!");
         handleIfCommand(msg.toString(), "!", discordBot)
      } 
  })
}
