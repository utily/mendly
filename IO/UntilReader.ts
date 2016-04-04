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

import * as Error from "../Error/Region"
import { Reader } from "./Reader"
import { BufferedReader } from "./BufferedReader"

export class UntilReader {
	private done = false
	private backend: BufferedReader
	constructor(private endMark: string, backend: Reader) {
		this.backend = backend instanceof(BufferedReader) ? backend : new BufferedReader(backend)
	}
	isEmpty(): boolean {
		return this.done || this.backend.isEmpty()
	}
	read(): string {
		var result: string
		if (!this.isEmpty()) {
			result = this.backend.read()
			this.done = !!this.backend.peekIs(this.endMark)
		}
		return result
	}
	getResource(): string { return this.backend.getResource() }
	getLocation(): Error.Location { return this.backend.getLocation() }
	getRegion(): Error.Region { return this.backend.getRegion() }
	mark(): Error.Region { return this.backend.mark() }
}