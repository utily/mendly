import * as Error from "../Error"
import * as Uri from "../Uri"
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
	private lastLocation: Error.Location = new Error.Location(Uri.Locator.empty, 0, 0)
	get empty(): boolean {
		return this.files.length == 0 && (!this.current || this.current.empty)
	}
	get resource(): Uri.Locator {
		return this.current ? this.current.resource : this.lastLocation.resource
	}
	get location(): Error.Location {
		return this.current ? this.current.location : this.lastLocation
	}
	get region(): Error.Region {
		return this.current ? this.current.region : new Error.Region(this.resource)
	}
	constructor(private files: Uri.Locator[]) {
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
	mark(): Error.Region {
		return this.current ? this.current.mark() : new Error.Region(this.resource)
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
	static override open(resource: Uri.Locator): Reader | undefined {
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
		return files ? new FolderReader(files.map(f => new Uri.Locator(["file"], undefined, f.split(path.sep)))) : undefined
	}
}
Reader.register(resource => FolderReader.open(resource), 0)
