import { Handler as _Handler } from "./Handler/index.js"
import { Level as _Level } from "./Level.js"
import { Level } from "./Level.js"
import { Location as _Location } from "./Location.js"
import { Position as _Position } from "./Position.js"
import { Region as _Region } from "./Region.js"
import { Region } from "./Region.js"

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
