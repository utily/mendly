import { uri } from "../uri"
import { Position } from "./Position"

export class Location extends Position {
	constructor(readonly resource: uri.Locator, line: number, column: number) {
		super(line, column)
	}
	override toString() {
		return this.resource.toString() + " @ " + super.toString()
	}
}
export namespace Location {}
