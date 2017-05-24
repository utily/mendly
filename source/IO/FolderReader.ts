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

import * as Error from "../Error"
import { Reader } from "./Reader"
import { FileReader } from "./FileReader"

import * as fs from "fs"

export class FolderReader extends Reader {
	private files: string[]
	private current: Reader | null
	private lastLocation: Error.Location
	get isEmpty(): boolean { return this.files.length == 0 && (!this.current || this.current.isEmpty) }
	get resource(): string { return this.current ? this.current.resource : this.lastLocation.resource }
	get location(): Error.Location { return this.current ? this.current.location : this.lastLocation }
	get region(): Error.Region { return this.current ? this.current.region : new Error.Region(this.resource) }
	constructor(private path: string, extension: string) {
		super()
		try {
			this.files = FolderReader.getFiles(this.path, extension)
		} catch (error) {
			console.error(`Failed to open folder: ${path}`)
			this.files = []
		}
	}
	read(): string | undefined {
		let result: string | undefined
		if (!this.current && this.files.length > 0)
			this.current = FileReader.open(this.files.shift())
		if (this.current) {
			result = this.current.read()
			if (result && this.files.length > 0) {
				this.current = null
				result = "\0"
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
}
Reader.addOpener((path, extension) => new FolderReader(path, extension), 0)
