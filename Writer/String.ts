import { Enumerator } from "../Enumerator/index.js"
import { Uri } from "../Uri/index.js"
import { Writer } from "./Writer.js"

export class String extends Writer {
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
	static create(resource?: Uri): String {
		return new String(resource || Uri.empty)
	}
}
export namespace String {}
