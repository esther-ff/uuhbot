import { Client, Events, TextChannel } from 'discord.js';
import { BotConfig } from './config';
import { GatewayIntentBits } from 'discord.js';
import { createBot } from 'mineflayer';

export const discordCommandPrefix = "!";
export const hypixelCommandPrefix = "@";

const discord = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
]})

const processDiscordCmd = (input: string) => {
    // stub
    console.log("invoked: ", input)
}

const channel: TextChannel = await discord.login(BotConfig.discord_token)
    .then(() => console.log(`client logged in!`))
    .then(() => discord.channels.fetch(BotConfig.channel_id))
    .then((chan) => {
        if (chan == null) {
            throw new Error("Channel wasn't fetched!")
        }

        return chan as TextChannel
    })

discord.on(Events.MessageCreate, (message) => {
    if (message.author.id == discord.user!.id) {
        // Ignore our own messages.
        return
    }

    const msg = message.toString()
    if (isDiscordCommand(msg)) {
        return processDiscordCmd(msg.slice(1))
    }

    if (message.channelId != channel.id) {
        // Ignore message from other channels
        return
    }

    let author = message.author.displayName || message.author.globalName

    sendMinecraftMsg(message.toString(), author ? author : "<anon>")
})

const sendDiscordMsg = async (message: string) => {
    console.log(message)

    if (!isNotGarbage(message)) {
        return
    }

    /* 8 is the length of "Guild > " */
    await channel.send(message.slice(8))
}

const isDiscordCommand = (str: string): boolean => {
    return str.startsWith(discordCommandPrefix)
}

const isHypixelCommand = (str: string): boolean => {
    return str.startsWith(hypixelCommandPrefix)
}

/// Stuff like non-guild messages from Hypixel chat
const isNotGarbage = (str: string): boolean => {
    return /.+?\w{0,} \[\w{1,5}\]:\B/.test(str)
}

const sendMinecraftMsg = async (message: string, author: string) => {
    if (message.length == 0) {
        return
    }

     bot.chat(`${author}: ${message}`)    
}

const processMcCmd = (input: string) => {
    // stub
    console.log(`mc command invoked: ${input}`)
}

const bot = createBot({
    auth: 'microsoft',
    host: "mc.hypixel.net",
    username: "BallinBridge",
    version: "1.8.1",
    // checkTimeoutInterval: 60 * 1000, // 60 seconds
    // hideErrors: false,
    // logErrors: true,
})

bot.on("login", () => console.log("bot logged in!"))

bot.on("messagestr", (msg) => {
    if (msg.includes(bot.username)) {
        // Ignore our own messages
        return
    }

    const checkMsg = msg.replace(/.+: /, "");
    if (isHypixelCommand(checkMsg)) {
        return processMcCmd(checkMsg.slice(1))
    }

    sendDiscordMsg(msg)
});

bot.on("death", () => {
    console.log("bot died!")
})

type State = {
    cmds: Map<string, CommandHandler>,
    timeouts: Map<string, boolean>,
}

type CmdArg = number | string
type Result = number

interface CommandHandler {
    stringIntoArgs: (input: string): CmdArg[],
    handler: (args: CmdArg[]): Result,
}









