import { loadEvents } from './loadEvents';
import { DiscordBotSide } from './discord_side';
import { MinecraftSide } from './chatter';
import { BotConfig } from './config';
import { GatewayIntentBits } from 'discord.js';
import { handleIfCommand } from './commands/handleCmd';

export const discordCommandPrefix = "!";
export const hypixelCommandPrefix = "@";

const discordMsgCallback = function (msg: string, dsc: DiscordBotSide): boolean {
    return true;
}

const minecraftMsgCallback = function (msg: string, mcc: MinecraftSide): boolean {
    //return handleIfCommand(msg, hypixelCommandPrefix, mcc)
    return true;
}

const discord = new DiscordBotSide({ intents: [GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
]}, BotConfig.discord_token, discordMsgCallback);

const minecraft = new MinecraftSide({
    auth: 'microsoft',
    host: BotConfig.bot_mc_host,
    username: BotConfig.bot_user,
    version: BotConfig.bot_mc_ver,
}, undefined, minecraftMsgCallback)

loadEvents('./events', minecraft, discord);

