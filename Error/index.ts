import { Handler as _Handler } from "./Handler"
import { Level as _Level } from "./Level"
import { Level } from "./Level"
import { Location as _Location } from "./Location"
import { Position as _Position } from "./Position"
import { Region as _Region } from "./Region"
import { Region } from "./Region"

export class Error {
	constructor(
		readonly description: string,
		readonly level: Level = "recoverable",
		readonly type: string = "unknown",
		readonly region?: Region
	) {}
	throw(): never {
		throw this
	}
	toString(): string {
		return `${this.level}: ${this.type} Error. ${this.description}${this.region ? " @ " + this.region.toString() : ""}`
	}
}
export namespace Error {
	export import Handler = _Handler
	export import Level = _Level
	export import Location = _Location
	export import Position = _Position
	export import Region = _Region
}
