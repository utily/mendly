import { error } from "../error"
import { uri } from "../uri"
import { FileReader } from "./FileReader"
import * as fs from "./fs"
import * as path from "./path"
import { Reader } from "./Reader"

export class FolderReader extends Reader {
	private tabSizeValue = 2
	get tabSize(): number {
		return this.tabSizeValue
	}
	set tabSize(size: number) {
		this.tabSizeValue = size
		if (this.current)
			this.current.tabSize = size
	}
	get readable(): boolean {
		return (this.current != undefined && this.current.readable) || this.files.length > 0
	}
	get opened(): boolean {
		return this.current != undefined || this.files.length > 0
	}
	private current: Reader | undefined
	private lastLocation: error.Location = new error.Location(uri.Locator.empty, 0, 0)
	get empty(): boolean {
		return this.files.length == 0 && (!this.current || this.current.empty)
	}
	get resource(): uri.Locator {
		return this.current ? this.current.resource : this.lastLocation.resource
	}
	get location(): error.Location {
		return this.current ? this.current.location : this.lastLocation
	}
	get region(): error.Region {
		return this.current ? this.current.region : new error.Region(this.resource)
	}
	constructor(private files: uri.Locator[]) {
		super()
	}
	async close(): Promise<boolean> {
		return this.current != undefined && (await this.current.close())
	}
	read(): string | undefined {
		let result: string | undefined
		if (!this.current && this.files.length > 0) {
			this.current = FileReader.open(this.files.shift())
			this.current.tabSize = this.tabSize
		}
		if (this.current) {
			result = this.current.read()
			if (result == undefined || result == "\0") {
				/* await */
				this.current.close()
				this.current = undefined
			}
		}
		this.lastLocation = this.location
		return result
	}
	mark(): error.Region {
		return this.current ? this.current.mark() : new error.Region(this.resource)
	}

	private static getFiles(folder: string, filetype: string, ignoreFiles: string[] = []): string[] {
		let result: string[] = []
		const files: string[] = fs.readdirSync(folder)
		files.forEach(file => {
			const filename = folder + path.sep + file
			if (ignoreFiles.indexOf(filename) == -1) {
				if (fs.lstatSync(filename).isDirectory())
					result = result.concat(FolderReader.getFiles(filename, filetype, ignoreFiles))
				else if (
					file.length > filetype.length &&
					file.lastIndexOf(filetype, file.length - filetype.length) === file.length - filetype.length
				)
					result.push(filename)
			}
		})
		return result
	}
	static override open(resource: uri.Locator): Reader | undefined {
		let files: string[] | undefined
		try {
			if (
				(resource &&
					(resource.scheme.length == 0 || (resource.scheme.length == 1 && resource.scheme[0] == "file")) &&
					resource.isFolder) ||
				resource.name.match("*")
			)
				files = FolderReader.getFiles(
					(resource.isRelative ? "" : path.sep) + resource.folder.path.join(path.sep),
					resource.extension
				)
		} catch {
			files = undefined
		}
		return files ? new FolderReader(files.map(f => new uri.Locator(["file"], undefined, f.split(path.sep)))) : undefined
	}
}
export namespace FolderReader {}
Reader.register(resource => FolderReader.open(resource), 0)
