import { Url } from "../Url/index.js"
import { Position } from "./Position.js"

export class Region {
	constructor(
		readonly resource: Url,
		readonly start?: Position,
		readonly end?: Position,
		readonly content?: string
	) {}
	merge(other?: Region) {
		return other ? new Region(this.resource, this.start, other.end, (this.content ?? "") + (other.content ?? "")) : this
	}
	toString() {
		return (
			this.resource.toString()
			+ (this.start && this.end ? " (" + this.start.toString() + " - " + this.end.toString() + ") " : "")
			+ (this.content ?? "")
		)
	}
}
export namespace Region {}
