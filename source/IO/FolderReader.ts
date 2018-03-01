// The MIT License (MIT)
//
// Copyright (c) 2016 Simon Mika
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import * as Uri from "../Uri"
import * as Error from "../Error"
import { Reader } from "./Reader"
import { FileReader } from "./FileReader"

import * as fs from "fs"

export class FolderReader extends Reader {
	get readable(): boolean { return this.current != undefined && this.current.readable || this.files.length > 0 }
	get opened(): boolean { return this.current != undefined || this.files.length > 0 }
	private current: Reader | undefined
	private lastLocation: Error.Location = new Error.Location(Uri.Locator.empty, 0, 0)
	private async isEmptyHelper(): Promise<boolean> { return this.files.length == 0 && (!this.current || await this.current.isEmpty) }
	get isEmpty(): Promise<boolean> { return this.isEmptyHelper() }
	get resource(): Uri.Locator { return this.current ? this.current.resource : this.lastLocation.resource }
	get location(): Error.Location { return this.current ? this.current.location : this.lastLocation }
	get region(): Error.Region { return this.current ? this.current.region : new Error.Region(this.resource) }
	constructor(private files: Uri.Locator[]) {
		super()
	}
	async close(): Promise<boolean> {
		return this.current != undefined && await this.current.close()
	}
	read(): string | undefined {
		let result: string | undefined
		if (!this.current && this.files.length > 0)
			this.current = FileReader.open(this.files.shift())
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
	mark(): Error.Region { return this.current ? this.current.mark() : new Error.Region(this.resource) }

	private static getFiles(folder: string, filetype: string, ignoreFiles: string[] = []): string[] {
		let result: string[] = []
		const files: string[] = fs.readdirSync(folder)
		files.forEach(file => {
			const filename = folder + "/" + file
			if (ignoreFiles.indexOf(filename) == -1) {
				if (fs.lstatSync(filename).isDirectory())
					result = result.concat(FolderReader.getFiles(filename, filetype, ignoreFiles))
				else if (file.length > filetype.length && file.lastIndexOf(filetype, file.length - filetype.length) === file.length - filetype.length)
					result.push(filename)
			}
		})
		return result
	}
	static open(resource: Uri.Locator): Reader | undefined {
		let files: string[] | undefined
		try {
			if (resource && (resource.scheme.length == 0 || resource.scheme.length == 1 && resource.scheme[0] == "file") && resource.isFolder || resource.name.match("*"))
				files = FolderReader.getFiles((resource.isRelative ? "" : "/") + resource.folder.path.join("/"), resource.extension)
		} catch (error) {
		}
		return files ? new FolderReader(files.map(f => new Uri.Locator(["file"], undefined, f.split("/")))) : undefined
	}
}
Reader.addOpener((resource) => FolderReader.open(resource), 0)
