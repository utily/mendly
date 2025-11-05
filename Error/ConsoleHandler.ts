import { Level } from "./Level";
import { Region } from "./Region";
import { Message } from "./Message";
import { Handler } from "./Handler";

export class ConsoleHandler implements Handler {
	raise(
		message: string | Message,
		level?: Level,
		type?: string,
		region?: Region
	): void {
		if (!(message instanceof Message))
			message = new Message(message as string, level, type, region);
		console.error(message.toString());
	}
}
