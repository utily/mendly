import { Level } from "./Level";
import { Region } from "./Region";
import { Message } from "./Message";

export interface Handler {
	raise: {
		(message: Message): void;
		(message: string, level?: Level, type?: string, region?: Region): void;
	};
}
