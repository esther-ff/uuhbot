export interface LoggingDirs {
  guild_chat_dir: string | null;
  discord_chat_dir: string | null;
}

export interface BigeonConfig {
  bot_user: string;
  bot_mc_ver: string;
  bot_mc_host: string;

  log_dirs: LoggingDirs;

  guild_id: string;

  filter_regexes: string[];

  discord_token: string;

  hypixel_api_key: string;

  embed_color: string;

  channel_id: string;

  regexize(arg0: string[]): RegExp;
} 

