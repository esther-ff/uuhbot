import { BotConfig } from './config';
import { Bot, BotOptions, createBot } from 'mineflayer';
import { FileHandle, open } from 'node:fs/promises';

export class MinecraftSide {
  public bot: Bot
  filter: RegExp;

  file: FileHandle | null;
  canLog: boolean;
  logDir: string | null;

  ready: boolean;

  callback: (arg0: string) => boolean;
  hasCallback: boolean;
  

  constructor(options: BotOptions, 
    loginCallBack?: () => any, 
    msgCallBack?: (arg0: string) => boolean) 
  {
    this.bot = createBot(options);
    this.filter = BotConfig.regexize(BotConfig.filter_regexes);


    this.hasCallback = msgCallBack != undefined;

    // Once executed login callback
    this.bot.once("login", () => {
      this.ready = true;
      if (loginCallBack !== undefined) {
        loginCallBack!();
      }
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
      doChat = this.callback!(msg)
    }

    if (doChat) {
        this.bot.chat(msg)
    };
    
    this.log(msg);
  }

  log(msg: string) {
    if (this.canLog) {      
      this.file!.appendFile(msg + "\n");    
    }
  }
}
