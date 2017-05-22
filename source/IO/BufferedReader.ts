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

export { Reader } from "./Reader"
export class BufferedReader extends Reader {
	private buffer: { data: string, location: Error.Location }[] = []
	private lastMark: Error.Location
	private lastContent: string = ""
	get isEmpty(): boolean { return (this.buffer.length == 0 || this.buffer[0].data == "\0") && this.backend.isEmpty }
	get resource(): string {
		var location = this.location
		return location ? location.resource : undefined
	}
	get location(): Error.Location {
		return this.buffer && this.buffer.length > 0 ? this.buffer[0].location : this.backend.location
	}
	get region(): Error.Region {
		return new Error.Region(this.resource, this.lastMark, this.location, this.lastContent)
	}
	constructor(private backend: Reader) {
		super()
		this.lastMark = this.location
	}
	peek(length?: number): string {
		if (!length)
			length = 1
		var next: string = null
		while (length > this.buffer.length && (next = this.backend.read()))
			this.buffer.push({ data: next, location: this.backend.location })
		return this.buffer.length == 0 ? undefined : this.buffer.slice(0, length > this.buffer.length ? this.buffer.length : length).map(value => value.data).join("")
	}
	read(length?: number): string {
		if (!length)
			length = 1
		var result = this.peek(length)
		if (result) {
			if (this.buffer.length >= result.length && result.length > 0) {
				this.buffer.splice(0, result.length)
			}
			this.lastContent += result
		}
		return result
	}
	peekIs(value: string | string[], count?: number): string {
		var result: string
		if (value)
			if (typeof(value) == "string") {
				while (count && count-- > 0)
					value += <string>value
				result = (this.peek(value.length) == <string>value ? <string>value : undefined)
			} else if ((<string[]>value).length > 0 && !(result = this.peekIs((<string[]>value)[0])) && (<string[]>value).length > 1)
				result = this.peekIs((<string[]>value).slice(1))
		return result
	}
	readIf(value: string|string[]): string {
		var result: string
		if (value)
			if (typeof(value) == "string")
				result = (this.peek(value.length) == <string>value ? this.read(value.length) : undefined)
			else if ((<string[]>value).length > 0 && !(result = this.readIf((<string[]>value)[0])) && (<string[]>value).length > 1)
				result = this.readIf((<string[]>value).slice(1))
		return result
	}
	readAll() : string {
		var result = ""
		while (this.peek())
			result += this.read()
		return result != "" ? result : undefined
	}
	mark(): Error.Region {
		var result = this.region
		this.lastMark = this.location
		this.lastContent = ""
		return result
	}
}
