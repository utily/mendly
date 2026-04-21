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
		return this.descriptor > 0
	}
	get writable(): boolean {
		return this.descriptor > 0
	}
	autoFlush: boolean = false
	constructor(readonly resource: Uri, private descriptor: number) {
		super()
	}
	async flush(): Promise<boolean> {
		let result = true
		try {
			await fsync(this.descriptor)
		} catch {
			result = false
		}
		return result
	}
	async close(): Promise<boolean> {
		let result = this.opened
		if (result) {
			try {
				await close(this.descriptor)
			} catch {
				result = false
			}
			this.descriptor = 0
		}
		return result
	}
	protected override async writeImplementation(buffer: Enumerator<string>): Promise<boolean> {
		let result: boolean
		const content = Buffer.from(buffer.reduce((r, item) => r + item, ""))
		try {
			const r = await write(this.descriptor, content)
			result = r.bytesWritten == content.length
		} catch {
			result = false
		}
		return result && (!this.autoFlush || (await this.flush()))
	}
	static override async open(resource: Uri): Promise<File | undefined> {
		let backend: number | undefined
		if (resource && (resource.scheme.length == 0 || (resource.scheme.length == 1 && resource.scheme[0] == "file")))
			try {
				backend = await open((resource.isRelative ? "" : sep) + resource.path.join(sep), "w")
			} catch {
				backend = undefined
			}
		return backend ? new File(resource, backend) : undefined
	}
}
export namespace File {}
Writer.register(File.open)
