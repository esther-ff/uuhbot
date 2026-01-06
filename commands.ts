export type Cmd = (input: string[], author: string) => Result;

export interface Result {
	response?: string;
	cooldown: number;
}

export interface Commands {
	[name: string]: ((inputs: string[]) => Result) | undefined;
}

export const timeouts: Set<string> = new Set();
export const minecraftCmds: Map<string, Cmd> = new Map<string, Cmd>([
	["dummy", dummyResponse],
]);

function dummyResponse(inputs: string[], author: string): Result {
	const resp = inputs.reduce((accum, elt) => accum + ` ${elt}`, "").trim();

	return { cooldown: 5, response: `haii! dear ${author}! :3c, <${resp}>` };
}
