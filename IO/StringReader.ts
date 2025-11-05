import * as Error from "../Error";
import * as Uri from "../Uri";
import { Reader } from "./Reader";

export class StringReader extends Reader {
	tabSize: number = 2;
	private count: number = 0;
	private line: number = 1;
	private column: number = 1;
	private lastPosition: Error.Position;
	private lastContent: string = "";
	readonly readable = true;
	get opened(): boolean {
		return this.count + 1 >= this.content.length;
	}
	get isEmpty(): boolean {
		return this.opened;
	}
	get location(): Error.Location {
		return new Error.Location(this.resource, this.line, this.column);
	}
	get region(): Error.Region {
		return new Error.Region(
			this.resource,
			this.lastPosition,
			this.location,
			this.lastContent
		);
	}
	private constructor(private content: string, readonly resource: Uri.Locator) {
		super();
		this.content += "\0";
		this.lastPosition = this.location;
	}
	async close(): Promise<boolean> {
		const result = !(await this.isEmpty);
		if (result) this.count = this.content.length;
		return result;
	}
	read(): string | undefined {
		let result: string | undefined;
		if (this.count < this.content.length)
			result = this.content.charAt(this.count);
		else if (this.count == this.content.length) result = undefined;
		this.count++;
		if (result) {
			switch (result) {
				case "\n":
					this.line++;
					this.column = 1;
					break;
				case "\t":
					this.column += this.tabSize;
					break;
				default:
					this.column++;
					break;
			}
			this.lastContent += result;
		}
		return result;
	}
	mark(): Error.Region {
		const result = this.region;
		this.lastPosition = this.location;
		this.lastContent = "";
		return result;
	}
	static create(content: undefined, path?: Uri.Locator): undefined;
	static create(content: string, path?: Uri.Locator): Reader;
	static create(
		content: string | undefined,
		resource?: Uri.Locator
	): Reader | undefined {
		return content != undefined
			? new StringReader(content, resource || Uri.Locator.empty)
			: undefined;
	}
}
