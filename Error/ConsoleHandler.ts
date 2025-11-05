import { Handler } from "./Handler"
import { Level } from "./Level"
import { Message } from "./Message"
import { Region } from "./Region"

export class ConsoleHandler implements Handler {
	raise(message: string | Message, level?: Level, type?: string, region?: Region): void {
		if (!(message instanceof Message))
			message = new Message(message as string, level, type, region)
		console.error(message.toString())
	}
}
