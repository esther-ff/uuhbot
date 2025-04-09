import { MinecraftSide } from '../../chatter';

export function command(msg: string, functor: MinecraftSide) {
  let myMsg = "Example command! returned: " + msg;

  functor.bot.chat(myMsg);
}
