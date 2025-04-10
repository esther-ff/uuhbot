import { UserSelectMenuInteraction } from 'discord.js';
import { DiscordBotSide } from '../discord_side';
import { CmdFunction, CommandList} from './commandList';
import { MinecraftSide } from '../chatter';

export interface Commandable {
  getCmd: (arg0: string) => CmdFunction  
  getSelf: () => DiscordBotSide | MinecraftSide
}
