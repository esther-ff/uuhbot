import { MinecraftSide } from '../chatter';
import { DiscordBotSide } from '../discord_side'

type Functor = MinecraftSide | DiscordBotSide;

export function handleIfCommand(
  msg: string, 
  prefix: string, 
  victim: Functor
): boolean {
  let isPrefixed = msg.startsWith(prefix);

  if (isPrefixed) {
    const func = async (victim: Functor, msg: string) => {
      // algo to rip apart arguments and stuff etc...
      let split = msg.split(" ");
      let commandName = split[0].substring(1);

      try {
        let command = victim.commandList.get(commandName);

        command(msg, victim);

      } catch (err) {
        victim.chat(err)
      }
    };
    
    func(victim, msg)
  }

  return isPrefixed
}
