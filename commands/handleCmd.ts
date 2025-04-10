import { Message } from 'discord.js';
import { MinecraftSide } from '../chatter';
import { DiscordBotSide } from '../discord_side'
import { Commandable } from './Commandable';

export function handleIfCommand(
  msg: Message, 
  prefix: string, 
  victim: Commandable
): boolean {
  let msgString = msg.toString();
  let isPrefixed = msgString.startsWith(prefix);

  if (isPrefixed) {
    const func = async (victim: Commandable, msg: Message) => {
      // algo to rip apart arguments and stuff etc...
      let split = msgString.split(" ");
      let commandName = split[0].substring(1);

      try {
        let command = victim.getCmd(commandName);
        command!(msg, victim);
      } catch (err) {
        console.log(err)
      }
    };
    
    func(victim, msg)
  }

  return isPrefixed
}
