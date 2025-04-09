import { MinecraftSide } from '../chatter';
import { DiscordBotSide } from '../discord_side'

export function initEvent(mcBot: MinecraftSide, discordBot: DiscordBotSide) {
  mcBot.bot.on("message", (msg) => {
    let stringMsg = msg.toString();

    let isNotTrash = /.+?\w{0,} \[\w{1,5}\]:\B/.test(stringMsg);
    let isNotEmpty = stringMsg.trim().length !== 0;
    
    if (isNotTrash && isNotEmpty) {
      discordBot.chat(stringMsg)
    }
   })
}
