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

export class StringReader extends Reader {
	private count: number = 0
	private line: number = 1
	private column: number = 1
	private lastPosition: Error.Position
	private lastContent: string = ""
	get isEmpty(): boolean {
		return this.count + 1 >= this.content.length
	}
	get resource(): string { return this.path }
	get location(): Error.Location { return new Error.Location(this.path, this.line, this.column) }
	get region(): Error.Region { return new Error.Region(this.path, this.lastPosition, this.location, this.lastContent) }
	constructor(private content: string, private path?: string) {
		super()
		this.content += '\0'
		this.lastPosition = this.location
		if (!this.path)
			this.path = content
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
	mark(): Error.Region {
		var result = this.region
		this.lastPosition = this.location
		this.lastContent = ""
		return result
	}
}
