import { Level } from "./Level"
import { Region } from "./Region"

export class Message {
	constructor(
		private description: string,
		private level = Level.Recoverable,
		private type = "unknown",
		private region?: Region
	) {}
	toString(): string {
		return (
			Level[this.level] +
			": " +
			this.type +
			" error. " +
			this.description +
			(this.region ? " @ " + this.region.toString() : "")
		)
	}
}
