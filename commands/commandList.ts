import { Message } from 'discord.js';
import { Commandable } from './Commandable'
export type CmdFunction = (arg0: Message, arg1: Commandable) => any;

export class CommandList {
  length: number;
  map: Map<string, CmdFunction>

  constructor() {
    this.map = new Map<string, CmdFunction>
    this.length = 0;
  }

  // important: both arrays should have the same length
  // first string is the command name
  // second is the require path
  populate(namePaths: [string, CmdFunction][]) {
    namePaths.forEach((tuple) => {
      this.length += 1;
      this.map.set(tuple[0], tuple[1])
    })
  }

  get(nom: string): CmdFunction {
    let maybeFunc = this.map.get(nom);

    if (maybeFunc == undefined) {
      throw new Error(`this command wasn't found: ${nom}`);
    } else {
      return maybeFunc!
    }
  }

  len(): number {
    return this.length
  }
}
