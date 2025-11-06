import { Enumerator } from "../Enumerator"
import * as fs from "../fs"
import * as path from "../path"
import { Uri } from "../Uri"
import { Writer } from "./Writer"

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
			await fs.fsync(this.descriptor)
		} catch {
			result = false
		}
		return result
	}
	async close(): Promise<boolean> {
		let result = this.opened
		if (result) {
			try {
				await fs.close(this.descriptor)
			} catch {
				result = false
			}
			this.descriptor = 0
		}
		return result
	}
	protected override async writeImplementation(buffer: Enumerator<string>): Promise<boolean> {
		let result = true
		const content = buffer.reduce((r, item) => r + item, "")
		try {
			const r = await fs.write(this.descriptor, content, null, "utf8")
			result = r.bytesWritten == content.length
		} catch {
			result = false
		}
		return result && (!this.autoFlush || (await this.flush()))
	}
	static override async open(resource: Uri): Promise<Writer | undefined> {
		let backend: number | undefined
		if (resource && (resource.scheme.length == 0 || (resource.scheme.length == 1 && resource.scheme[0] == "file")))
			try {
				backend = await fs.open((resource.isRelative ? "" : path.sep) + resource.path.join(path.sep), "w")
			} catch {
				backend = undefined
			}
		return backend ? new File(resource, backend) : undefined
	}
}
export namespace File {}
Writer.register(File.open)
