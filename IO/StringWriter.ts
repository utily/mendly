import * as Uri from "../Uri"
import { Enumerator } from "../Utilities"
import { Writer } from "./Writer"

export class StringWriter extends Writer {
	private content = ""
	get result(): string {
		return this.content
	}
	readonly writable = true
	readonly autoFlush = true
	readonly opened = true
	private constructor(readonly resource: Uri.Locator) {
		super()
	}
	protected async writeImplementation(buffer: Enumerator<string>): Promise<boolean> {
		this.content += buffer.reduce((r, item) => r + item, "")
		return true
	}
	async flush(): Promise<boolean> {
		return true
	}
	async close(): Promise<boolean> {
		return true
	}
	static create(resource?: Uri.Locator): Writer {
		return new StringWriter(resource || Uri.Locator.empty)
	}
}
