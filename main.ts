import { botConfig } from "./config.ts";
import { startMinecraft } from "./minecraft.ts";
import { startDiscord } from "./discord.ts";

await startMinecraft();
await startDiscord(botConfig.discordToken);
