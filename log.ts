export enum LogUrgency {
	Info = "info",
	Warn = "warn",
	Error = "error",
}

export enum Side {
	Discord = "discord",
	Mc = "mc",
}

export async function log(urgency: LogUrgency, side: Side, msg: string) {
	console.log(`<${urgency} @ ${side}>: ${msg}`);
}
