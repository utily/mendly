export class Position {
	readonly line: number;
	readonly column: number;
	constructor(line: number, column: number) {
		this.line = line;
		this.column = column;
	}
	toString() {
		return "Ln " + this.line + ", Col " + this.column;
	}
}
