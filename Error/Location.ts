import * as Uri from "../Uri";
import { Position } from "./Position";

export class Location extends Position {
	constructor(readonly resource: Uri.Locator, line: number, column: number) {
		super(line, column);
	}
	toString() {
		return this.resource.toString() + " @ " + super.toString();
	}
}
