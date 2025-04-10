import { Message, TextChannel } from 'discord.js';
import { DiscordBotSide } from '../../discord_side';

export function command(msg: Message, functor: DiscordBotSide) {
  let myMsg = "Example command! returned: " + msg.toString();

  functor.client.channels.fetch(msg.channel.id).then((channel) => {
    if (channel == undefined) {
      throw new Error("couldn't fetch the channel for chatting")
    }
    let fetchedChannel = channel! as TextChannel;
    fetchedChannel.send(myMsg)
    
  })
}
