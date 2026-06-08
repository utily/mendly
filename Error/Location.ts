import { Url } from "../Url/index.js"
import { Position } from "./Position.js"

export class Location extends Position {
	constructor(
		readonly resource: Url,
		line: number,
		column: number
	) {
		super(line, column)
	}
	override toString() {
		return this.resource.toString() + " @ " + super.toString()
	}
}
export namespace Location {}
