import { CmdFunction } from '../commandList';

export const Commands: Array<[string, CmdFunction]> = [
  ["example", require('./example').command]
]
