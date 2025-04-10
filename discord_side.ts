import { Client, ClientEvents, ClientOptions, Events, TextChannel } from 'discord.js';
import { FileHandle, open } from 'node:fs/promises'
import { Commands } from './commands/discord-chat/main';
import { CmdFunction, CommandList } from './commands/commandList';
import { LoggingDirs, BigeonConfig } from './config_types'
import { BotConfig } from './config'
import { Commandable } from './commands/Commandable';

export class DiscordBotSide implements Commandable {
  public readonly client: Client;
  
  readonly channel_id: string;
  channel: TextChannel | undefined;

  readonly log_dir: string | null;
  readonly can_log: boolean;

  filter: RegExp;
  readonly token: string;

  readonly hasCallback: boolean;
  readonly callback: ((arg0: string, arg1: DiscordBotSide) => boolean) | undefined;
  
  open_file: FileHandle | null

  public readonly commandList: CommandList;
  
  constructor(opts: ClientOptions, token: string, func?: (arg0: string, arg1: DiscordBotSide) => boolean) {
    Object.assign(this, {
      client: new Client(opts),
      hasCallback: func !== undefined,
      callback: func,
      channel_id: BotConfig.channel_id,
      can_log: BotConfig.log_dirs.discord_chat_dir != null,
      log_dir: BotConfig.log_dirs.discord_chat_dir,
      filter: BotConfig.regexize(BotConfig.filter_regexes),
      commandList: new CommandList()
    })

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

    this.commandList.populate(Commands)

  }

  getCmd(nom: string): CmdFunction {
    return this.commandList.get(nom)
  };

  getSelf(): DiscordBotSide {
    return this
  }

  channelId(): string {
    return this.channel_id
  }

  chat(msg: string) {
    msg = msg.toString();
    
    // if it's our own message don't even process it.
    if (msg.includes(BotConfig.bot_user)) {
      console.log(msg);
      return;
    }

    // if message has filtered content
    // get rid of it.
    if (this.filter.test(msg)) {
      console.log(`filtered: ${msg} (discord->mc)`);
      return;
    }

    msg = msg.replace("Guild >", "").replace("_", "\_");

    
    if (this.hasCallback) {
          if (this.callback!(msg, this)) {
            this.channel!.send(msg);
          }
        } else {
          this.channel!.send(msg);
        }
    

    this.log(msg)
   }

  log(msg: string) {
    if (this.can_log) {
       this.open_file?.appendFile(msg + "\n")
    };
  }
} 
