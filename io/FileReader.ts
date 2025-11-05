import { Error } from "../Error"
import { Uri } from "../Uri"
import * as fs from "./fs"
import * as path from "./path"
import { Reader } from "./Reader"
import { StringReader } from "./StringReader"

export class FileReader extends Reader {
	get tabSize(): number {
		return this.backend.tabSize
	}
	set tabSize(size: number) {
		this.backend.tabSize = size
	}
	get readable(): boolean {
		return this.backend.readable
	}
	get opened(): boolean {
		return this.backend.opened
	}
	get empty(): boolean {
		return this.backend.empty
	}
	get resource(): Uri {
		return this.backend ? this.backend.resource : Uri.empty
	}
	get location(): Error.Location {
		return this.backend.location
	}
	get region(): Error.Region {
		return this.backend.region
	}
	private constructor(private backend: Reader) {
		super()
	}
	close(): Promise<boolean> {
		return this.backend.close()
	}
	read(): string | undefined {
		return this.backend.read()
	}
	mark(): Error.Region {
		return this.backend.mark()
	}
	static override open(resource?: undefined): undefined
	static override open(resource?: Uri): Reader
	static override open(resource?: Uri): Reader | undefined {
		let backend: Reader | undefined
		if (resource && (resource.scheme.length == 0 || (resource.scheme.length == 1 && resource.scheme[0] == "file")))
			try {
				backend = StringReader.create(
					fs.readFileSync((resource.isRelative ? "" : path.sep) + resource.path.join(path.sep), "utf-8"),
					resource
				)
			} catch {
				console.log(`Failed to open file: ${resource.toString()}`)
			}
		return backend ? new FileReader(backend) : undefined
	}
}
export namespace FileReader {}
Reader.register(p => FileReader.open(p), 10)
