import { Client, GatewayIntentBits, TextChannel, Events } from "discord.js";
import { botConfig } from "./config";
import { log, LogUrgency, Side } from "./log";
import { sendMinecraftMsg } from "./minecraft";

export async function startDiscord(token: string) {
	await discord.login(token);

	discord.on(Events.MessageCreate, async (message) => {
		if (message.author.id == discord.user!.id) return;

		const channel = await getChannel();
		const msg = message.toString();
		if (isDiscordCommand(msg)) return processDiscordCmd(msg.slice(1));

		if (message.channelId != channel.id) return;

		let author = message.author.displayName || message.author.globalName;
		sendMinecraftMsg(message.toString(), author ? author : "<anon>");
	});
}

export async function sendDiscordMsg(message: string) {
	if (!isNotGarbage(message)) return;

	/* 8 is the length of "Guild > " */
	getChannel().then((chan) => chan.send(message.slice(8)));
}

const discordCommandPrefix = "!";
const discord = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});

const getChannel = async () =>
	discord.channels.fetch(botConfig.channelId).then((chan) => {
		if (chan === null) {
			log(
				LogUrgency.Error,
				Side.Discord,
				`failed to fetch channel: <{${botConfig.channelId}}>`,
			);

			throw new Error("channel wasn't fetched!");
		}

		return chan as TextChannel;
	});

function isNotGarbage(str: string): boolean {
	return /.+?\w{0,} \[\w{1,5}\]:\B/.test(str);
}

const isDiscordCommand = (str: string): boolean =>
	str.startsWith(discordCommandPrefix);

async function processDiscordCmd(input: string) {
	console.error("stub handler - invoked: ", input);
}
