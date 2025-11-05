import { uri } from "../uri"
import { utilities } from "../utilities"
import { Writer } from "./Writer"

export class StringWriter extends Writer {
	private content = ""
	get result(): string {
		return this.content
	}
	readonly writable = true
	readonly autoFlush = true
	readonly opened = true
	private constructor(readonly resource: uri.Locator) {
		super()
	}
	protected async writeImplementation(buffer: utilities.Enumerator<string>): Promise<boolean> {
		this.content += buffer.reduce((r, item) => r + item, "")
		return true
	}
	async flush(): Promise<boolean> {
		return true
	}
	async close(): Promise<boolean> {
		return true
	}
	static create(resource?: uri.Locator): Writer {
		return new StringWriter(resource || uri.Locator.empty)
	}
}
export namespace StringWriter {}
