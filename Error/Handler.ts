import { Level } from "./Level"
import { Message } from "./Message"
import { Region } from "./Region"

export interface Handler {
	raise: {
		(message: Message): void
		(message: string, level?: Level, type?: string, region?: Region): void
	}
}
