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

export { Reader } from "./Reader"
export class StringReader extends Reader {
	private count: number = 0
	private line: number = 1
	private column: number = 1
	private lastPosition: Error.Position
	private lastContent: string = ""
	constructor(private content: string, private path?: string) {
		super()
		this.lastPosition = this.getLocation()
		if (!this.path)
			this.path = ""
	}
	isEmpty(): boolean {
		return this.count >= this.content.length
	}
	read(): string {
		var result: string
		if (this.count < this.content.length)
			result = this.content.charAt(this.count)
		else if (this.count == this.content.length)
			result = undefined
		this.count++
		if (result) {
			if (result == "\n") {
				this.line++
				this.column = 1
			} else
				this.column++
			this.lastContent += result
		}
		return result
	}
	getResource(): string { return this.path }
	getLocation(): Error.Location { return new Error.Location(this.path, this.line, this.column) }
	getRegion(): Error.Region { return new Error.Region(this.path, this.lastPosition, this.getLocation(), this.lastContent) }
	mark(): Error.Region {
		var result = this.getRegion()
		this.lastPosition = this.getLocation()
		this.lastContent = ""
		return result
	}
}
