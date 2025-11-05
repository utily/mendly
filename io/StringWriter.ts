import { Uri } from "../Uri"
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
	private constructor(readonly resource: Uri) {
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
	static create(resource?: Uri): Writer {
		return new StringWriter(resource || Uri.empty)
	}
}
export namespace StringWriter {}
