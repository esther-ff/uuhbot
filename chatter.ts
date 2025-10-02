import { BotConfig } from './config';
import { Bot, BotOptions, createBot } from 'mineflayer';
import { FileHandle, open } from 'node:fs/promises';
import { CmdFunction, CommandList } from './commands/commandList';
import { Commands } from './commands/mc-chat/main';
import { Commandable } from './commands/Commandable';
import { appendHashtag } from './hashtags';

export class MinecraftSide implements Commandable {
  public readonly bot: Bot
  public readonly commandList: CommandList;

  filter: RegExp;

  file: FileHandle | null;
  readonly canLog: boolean;
  readonly logDir: string | null;

  ready: boolean;

  callback: (arg0: string, arg1: MinecraftSide) => boolean;
  hasCallback: boolean;
  
  constructor(options: BotOptions, 
    loginCallBack?: () => any, 
    msgCallBack?: (arg0: string, arg1: MinecraftSide) => boolean) 
  {


    Object.assign(this, {
      bot: createBot(options),
      commandList: new CommandList(),
      filter: BotConfig.regexize(BotConfig.filter_regexes),
      hasCallback: msgCallBack != undefined,  
      callback: msgCallBack,  
      ready: false,      
    });

   


    // Once executed login callback
    this.bot.once("login", () => {
      this.ready = true;
      this.commandList.populate(Commands);
      if (loginCallBack !== undefined) {
        loginCallBack!();
      }
    })

    this.bot.on("death", () => {
      console.log("bot died?")
    })

    this.bot.on("message", (msg) => {
      console.log(`${msg.toString()}`)
    })

    // Open logging file
    // if it exists.
    this.canLog = BotConfig.log_dirs.guild_chat_dir != null;
    this.logDir = BotConfig.log_dirs.guild_chat_dir;
    if (this.canLog) {
      open(this.logDir!, "w+").then(
        (handle) => 
          { this.file = handle }, 
        (err) => 
          { throw new Error("Failed to open \"${this.logDir})}\"") });
    };
  }

  getCmd(nom: string): CmdFunction {
    return this.commandList.get(nom)
  }

  getSelf(): MinecraftSide {
    return this
  }

  chat(msg: string) {
    if (!this.ready) {
      return
    };
    
    if (this.filter.test(msg)) {
      console.log(`filtered: ${msg} (mc->discord)`);
      return;
    }

    
      let doChat = true;

      if (this.hasCallback) {
        doChat = this.callback!(msg, this)
      };
    
      console.log(msg);

      if (doChat) {
        let newMsg = appendHashtag(msg, () => {
                // guarantee a 1 in 20 chance to roll a hashtag.
                const min = 1;
                const max = 20;
      
                return Math.floor(Math.random() * (max - min) + min) == max;
              });      
        this.bot.chat(newMsg);  
        this.log(newMsg);

        return;
      };
    
    this.log(msg);
  }

  log(msg: string) {
    if (this.canLog) {      
      this.file!.appendFile(msg + "\n");    
    }
  }
}
