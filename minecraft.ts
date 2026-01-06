import { createBot } from "mineflayer";
import { botConfig } from "./config";
import { timeouts, minecraftCmds } from "./commands";
import { log, LogUrgency, Side } from "./log";
import { sendDiscordMsg } from "./discord";

export async function startMinecraft() {
	bot.on("messagestr", handleMessage);
	bot.on("error", () => process.exit());
	bot.on("end", () => process.exit());
}

export async function sendMinecraftMsg(message: string, author: string) {
	bot.chat(`${author}: ${message}`);
}

const hypixelCommandPrefix = "@";
const discordPingRegex = /<@\d+>/;
const chatGarbageRegex = /.+?\w{0,} \[\w{1,5}\]:\B/;
const guildMsgRegex = /Guild > (?:\[.+\] )?(?<user>.+) \[.+\]: @(?<input>.+)/;

async function handleMessage(msg: string) {
	if (msg.includes(bot.username)) return;

	if (!chatGarbageRegex.test(msg)) return;

	if (discordPingRegex.test(msg)) return;

	log(LogUrgency.Info, Side.Mc, `msg from chat: ${msg}`);

	const match = msg.match(guildMsgRegex);

	if (match === null || match.groups === undefined) return sendDiscordMsg(msg);

	if (timeouts.has(match.groups.user)) return;

	const list = match.groups.input.split(" ");
	const fun = minecraftCmds.get(list[0]);

	if (fun === undefined) {
		log(LogUrgency.Warn, Side.Mc, `unknown command: ${list[0]}`);
		return;
	}

	const result = fun(list.slice(1), match.groups.user);
	if (result.response) bot.chat(result.response);

	/* Shouldn't be undefined!!! */
	setTimeout(() => timeouts.delete(match.groups!.user), result.cooldown);
}

const bot = createBot({
	auth: "microsoft",
	host: botConfig.server,
	username: botConfig.botUser,
	version: botConfig.botMcVersion,
	hideErrors: false,
	logErrors: true,
});
