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

import * as fs from "fs"
import * as Uri from "../Uri"
import * as Error from "../Error"
import { Reader } from "./Reader"
import { StringReader } from "./StringReader"

export class FileReader extends Reader {
	get readable(): boolean { return this.backend.readable }
	get opened(): boolean { return this.backend.opened }
	get isEmpty(): Promise<boolean> { return this.backend.isEmpty }
	get resource(): Uri.Locator { return this.backend ? this.backend.resource : Uri.Locator.empty }
	get location(): Error.Location { return this.backend.location }
	get region(): Error.Region { return this.backend.region }
	private constructor(private backend: Reader) {
		super()
	}
	close(): Promise<boolean> {
		return this.backend.close()
	}
	read(): string | undefined { return this.backend.read() }
	mark(): Error.Region { return this.backend.mark() }
	static open(resource?: undefined): undefined
	static open(resource?: Uri.Locator): Reader
	static open(resource?: Uri.Locator): Reader | undefined {
		let backend: Reader | undefined
		if (resource && (resource.scheme.length == 0 || resource.scheme.length == 1 && resource.scheme[0] == "file"))
			try {
				backend = StringReader.create(fs.readFileSync((resource.isRelative ? "" : "/") + resource.path.join("/"), "utf-8"), resource)
			} catch (error) {
				console.log(`Failed to open file: ${resource.toString()}`)
			}
		return backend ? new FileReader(backend) : undefined
	}
}
Reader.addOpener(path => FileReader.open(path), 10)
