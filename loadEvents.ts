import { DiscordBotSide } from './discord_side';
import { MinecraftSide } from './chatter';
import { readdirSync } from 'node:fs';

export function loadEvents(path: string, mcBot: MinecraftSide, discordBot: DiscordBotSide) {
  let eventFiles = readdirSync(path);

  eventFiles.forEach((pathToFile) => {
    console.log(`loading: ${pathToFile}`);

    let actualPath = `${path}/${pathToFile}`
    require(actualPath).initEvent(mcBot, discordBot);
  })
}
