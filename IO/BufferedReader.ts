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
export class BufferedReader extends Reader {
	buffer: { data: string, location: Error.Location }[] = []
	private lastMark: Error.Location
	private lastLocation: Error.Location
	private lastContent: string = ""
	constructor(private backend: Reader) {
		super()
		this.lastMark = this.lastLocation = this.getLocation()
	}
	isEmpty(): boolean {
		return this.buffer.length == 0 && this.backend.isEmpty()
	}
	peek(length?: number): string {
		if (!length)
			length = 1
		var next: string = null
		while (length > this.buffer.length && (next = this.backend.read()))
			this.buffer.push({ data: next, location: this.backend.getLocation() })
		return this.buffer.slice(0, length > this.buffer.length ? this.buffer.length : length).map(value => value.data).join("") + (length > this.buffer.length ? "\0" : "")
	}
	read(length?: number): string {
		if (!length)
			length = 1
		var result = this.peek(length)
		if (this.buffer.length >= result.length && result.length > 0){
			this.lastLocation = this.buffer[result.length - 1].location
			this.buffer.splice(0, result.length)
		}
		this.lastContent += result
		return result
	}
	peekIs(value: string|string[], count?: number): string {
		var result: string
		if (value)
			if (typeof(value) == "string") {
				while (count && count-- > 0)
					value += <string>value
				result = (this.peek(value.length) == <string>value ? <string>value : undefined)
			} else if (!(result = this.peekIs((<string[]>value).shift())))
				result = this.peekIs(<string[]>value)
		return result
	}
	readIf(value: string|string[]): string {
		var result: string
		if (value)
			if (typeof(value) == "string")
				result = (this.peek(value.length) == <string>value ? this.read(value.length) : undefined)
			else if (!(result = this.readIf((<string[]>value).shift())))
				result = this.readIf(<string[]>value)
		return result
	}
	getResource(): string {
		var location = this.getLocation()
		return location ? location.getResource() : undefined
	}
	getLocation(): Error.Location {
		this.peek()
		return this.buffer && this.buffer.length > 0 ? this.buffer[0].location : this.lastLocation
	}
	getRegion(): Error.Region {
		return new Error.Region(this.getResource(), this.lastMark, this.getLocation(), this.lastContent)
	}
	mark(): Error.Region {
		var result = this.getRegion()
		this.lastMark = this.getLocation()
		this.lastContent = ""
		return result
	}
}
