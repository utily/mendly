import * as fs from "node:fs"
import { sep } from "node:path"
import * as util from "node:util"
import { Enumerator } from "../Enumerator"
import { Uri } from "../Uri"
import { Writer } from "./Writer"

const close = util.promisify(fs.close)
const fsync = util.promisify(fs.fsync)
const open = util.promisify(fs.open)
const write = util.promisify(fs.write)

export class File extends Writer {
	get opened(): boolean {
		return this.descriptor != undefined
	}
	get writable(): boolean {
		return this.descriptor != undefined
	}
	error: unknown | undefined
	autoFlush: boolean = false
	constructor(
		readonly resource: Uri,
		private descriptor?: number
	) {
		super()
	}
	async flush(): Promise<boolean> {
		let result = false
		if (this.descriptor != undefined)
			try {
				await fsync(this.descriptor)
				this.error = undefined
				result = true
			} catch (error) {
				this.error = error
			}
		return result
	}
	async close(): Promise<boolean> {
		let result = false
		if (this.descriptor != undefined) {
			try {
				await close(this.descriptor)
				this.error = undefined
				result = true
			} catch (error) {
				this.error = error
			}
			this.descriptor = undefined
		}
		return result
	}
	protected override async writeImplementation(buffer: Enumerator<string>): Promise<boolean> {
		let result = false
		const content = Buffer.from(buffer.reduce((r, item) => r + item, ""))
		if (this.descriptor != undefined)
			try {
				const r = await write(this.descriptor, content)
				this.error = undefined
				result = r.bytesWritten == content.length
			} catch (error) {
				this.error = error
			}
		if (result && this.autoFlush) result = await this.flush()
		return result
	}
	static override async open(resource: Uri): Promise<File | undefined> {
		let backend: number | undefined
		if (resource && (resource.scheme.length == 0 || (resource.scheme.length == 1 && resource.scheme[0] == "file")))
			try {
				backend = await open((resource.isRelative ? "" : sep) + resource.path.join(sep), "w")
			} catch {
				backend = undefined
			}
		return backend != undefined ? new File(resource, backend) : undefined
	}
}
export namespace File {}
Writer.register(File.open)
