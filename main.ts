import { botConfig } from "./config";
import { startMinecraft } from "./minecraft";
import { startDiscord } from "./discord";

await startDiscord(botConfig.discordToken);
await startMinecraft();
