import { loadEvents } from './loadEvents';
import { DiscordBotSide } from './discord_side';
import { MinecraftSide } from './chatter';
import { BotConfig } from './config';
import { GatewayIntentBits } from 'discord.js';

const discord = new DiscordBotSide({ intents: [GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
]}, BotConfig.discord_token);

const minecraft = new MinecraftSide({
    auth: 'microsoft',
    host: BotConfig.bot_mc_host,
    username: BotConfig.bot_user,
    version: BotConfig.bot_mc_ver,
})

loadEvents('./events', minecraft, discord);

