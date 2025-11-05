import { uri } from "../uri"
import { Position } from "./Position"

export class Region {
	constructor(
		readonly resource: uri.Locator,
		readonly start?: Position,
		readonly end?: Position,
		readonly content?: string
	) {}
	merge(other?: Region) {
		return other
			? new Region(
					this.resource,
					this.start,
					other.end,
					this.content ? this.content : "" + other.content ? other.content : ""
			  )
			: this
	}
	toString() {
		let result = this.resource.toString()
		if (this.start && this.end)
			result += " (" + this.start.toString() + " - " + this.end.toString() + ") "
		if (this.content)
			result += this.content
		return result
	}
}
export namespace Region {}
