import { Client, ClientEvents, ClientOptions, Events, TextChannel } from 'discord.js';
import { LoggingDirs, BigeonConfig } from './config_types'
import { BotConfig } from './config'
import { FileHandle, open } from 'node:fs/promises'

export class DiscordBotSide{
  public client: Client;
  
  channel_id: string;
  log_dir: string | null;
  can_log: boolean;
  channel: TextChannel | undefined;
  filter: RegExp;
  token: string;

  hasCallback: boolean;
  callback: ((arg0: string) => boolean) | undefined;
  
  open_file: FileHandle | null
  
  constructor(opts: ClientOptions, token: string, func?: (arg0: string) => boolean) {
    this.client = new Client(opts);

    this.hasCallback = func !== undefined;
    this.callback = func;
    
    this.client.login(token)
      // check for login
      .then((log) => console.log("client logged in"))

      // fetch channel
      .then(() => this.client.channels.fetch(this.channel_id)

        // set channel as our target
        .then((channel) => 
          { 
            this.channel = channel as TextChannel;
          
            if (this.channel === null || this.channel === undefined) {
              throw new Error("Unable to fetch channel")
            }
          
            console.log(`Channel for sending messages: ${this.channel.name}`);
          }
    ));

    this.channel_id = BotConfig.channel_id;
    this.can_log = BotConfig.log_dirs.discord_chat_dir != null
    this.log_dir = BotConfig.log_dirs.discord_chat_dir
    this.filter = BotConfig.regexize(BotConfig.filter_regexes)

    if (this.can_log) {
      open(this.log_dir!, "w+")
        .then(
      (handle) => {
        this.open_file = handle
      }, 
      (err) => {
          throw new Error(`Failed to open \"${this.log_dir}\" `)
      })
    }

  }

  channelId(): string {
    return this.channel_id
  }

  chat(msg: string) {
    // if it's our own message don't even process it.
    if (msg.includes(BotConfig.bot_user)) {
      return;
    }

    // if message has filtered content
    // get rid of it.
    if (this.filter.test(msg)) {
      console.log(`filtered: ${msg} (discord->mc)`);
      return;
    }

    msg = msg.replace("Guild >", "").replace("_", "\_");

    let doChat = true;

    if (this.hasCallback) {
      doChat = this.callback!(msg)
    }

    console.log(msg);

    if (doChat) {
      this.channel?.send({ content: msg });    
    };

    this.log(msg)
 
  }

  log(msg: string) {
    if (this.can_log) {
       this.open_file?.appendFile(msg + "\n")
    };
  }

  roll_hashtag(): string {
    return "unimplemented"
  }
  
} 
