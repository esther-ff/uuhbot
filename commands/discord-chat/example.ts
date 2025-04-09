import { DiscordBotSide } from '../../discord_side';

export function command(msg: string, functor: DiscordBotSide) {
  let myMsg = "Example command! returned: " + msg;

  functor.chat(myMsg);
}
