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

/// <reference path="../../tsd.d.ts" />
import * as fs from "fs"
import * as Error from "../Error/Region"
import { Reader } from "./Reader"
import { StringReader } from "./StringReader"

export { Reader, StringReader } from "./StringReader"
export class FileReader extends Reader {
	private backend: Reader
	constructor(path: string) {
		super()
		this.backend = new StringReader(fs.readFileSync(path, "utf-8"), path)
	}
	isEmpty(): boolean { return this.backend.isEmpty() }
	read(): string { return this.backend.read() }
	getResource(): string { return this.backend ? this.backend.getResource() : null }
	getLocation(): Error.Location { return this.backend.getLocation() }
	getRegion(): Error.Region { return this.backend.getRegion() }
	mark(): Error.Region { return this.backend.mark() }
}
Reader.addOpener((path, extension) => path.slice(-extension - 1) == "." + extension ? new FileReader(path) : null, 10)
