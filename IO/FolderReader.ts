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

/// <reference path="../../typings/node/node" />
/// <reference path="../Utilities/Iterator" />
/// <reference path="Reader" />

var fs = require("fs");

module U10sil.IO {
	export class FolderReader extends Reader {
		private files: string[]
		private current: Reader
		constructor(private path: string, pattern: string) {
			super()
			this.files = FolderReader.getFiles(this.path, pattern)
		}
		isEmpty(): boolean {
			return this.files.length == 0 && (!this.current || this.current.isEmpty())
		}
		read(): string {
			var result: string = null
			if (!this.current && this.files.length > 0) {
				this.current = new FileReader(this.files.shift())
			}
			if (this.current) {
				result = this.current.read()
				if (result && this.files.length > 0) {
					this.current = null
					result = "\0"
				}
			}
			return result
		}
		getResource(): string { return this.current ? this.current.getResource() : null }
		getLocation(): Error.Location { return this.current.getLocation() }
		getRegion(): Error.Region { return this.current.getRegion() }
		mark(): Error.Region { return this.current.mark() }

		private static getFiles(folder: string, filetype: string, ignoreFiles: string[] = []): string[] {
			var result: string[] = []
			var files: string[] = fs.readdirSync(folder)
			var filename = ""
			files.forEach(file => {
				filename = folder + "/" + file
				if (ignoreFiles.indexOf(filename) == -1) {
					if (fs.lstatSync(filename).isDirectory()) {
						result = result.concat(FolderReader.getFiles(filename, filetype, ignoreFiles))
					} else if (file.length > filetype.length && file.lastIndexOf(filetype, file.length - filetype.length) === file.length - filetype.length) {
						result.push(filename)
					}
				}
			})
			return result
		}
	}
}
