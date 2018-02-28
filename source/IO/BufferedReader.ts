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

export { Reader } from "./Reader"
export class BufferedReader extends Reader {
	get readable(): boolean { return !!this.backend }
	get opened(): boolean { return !!this.backend }
	private buffer: { data: string, location: Error.Location }[] = []
	private lastMark: Error.Location
	private lastContent: string = ""
	private async isEmptyHelper(): Promise<boolean> { return (this.buffer.length == 0 || this.buffer[0].data == "\0") && await this.backend.isEmpty }
	get isEmpty(): Promise<boolean> { return this.isEmptyHelper() }
	get resource(): Uri.Locator {
		const location = this.location
		return location ? location.resource : Uri.Locator.empty
	}
	get location(): Error.Location {
		return this.buffer && this.buffer.length > 0 ? this.buffer[0].location : this.backend.location
	}
	get region(): Error.Region {
		return new Error.Region(this.resource, this.lastMark, this.location, this.lastContent)
	}
	protected constructor(private backend: Reader) {
		super()
		this.lastMark = this.location
	}
	close(): Promise<boolean> {
		return this.backend.close()
	}
	peek(length?: number): string | undefined {
		if (!length)
			length = 1
		let next: string | undefined
		while (length > this.buffer.length && (next = this.backend.read()))
			this.buffer.push({ data: next, location: this.backend.location })
		return this.buffer.length == 0 ? undefined : this.buffer.slice(0, length > this.buffer.length ? this.buffer.length : length).map(value => value.data).join("")
	}
	read(length?: number): string | undefined {
		if (!length)
			length = 1
		const result = this.peek(length)
		if (result) {
			if (this.buffer.length >= result.length && result.length > 0) {
				this.buffer.splice(0, result.length)
			}
			this.lastContent += result
		}
		return result
	}
	peekIs(value: string | string[], count?: number): string | undefined {
		let result: string | undefined
		if (value)
			if (typeof(value) == "string") {
				while (count && count-- > 0)
					value += value as string
				result = this.peek(value.length) == value as string && value as string || undefined
			} else if ((value as string[]).length > 0 && !(result = this.peekIs((value as string[])[0])) && (value as string[]).length)
				result = this.peekIs((value as string[]).slice(1))
		return result
	}
	readIf(value: string | string[]): string | undefined {
		let result: string | undefined
		if (value)
			if (typeof(value) == "string")
				result = this.peek(value.length) == value as string && this.read(value.length) || undefined
			else if ((value as string[]).length > 0 && !(result = this.readIf((value as string[])[0])) && (value as string[]).length)
				result = this.readIf((value as string[]).slice(1))
		return result
	}
	readAll(): string | undefined {
		let result = ""
		while (this.peek())
			result += this.read()
		return result != "" ? result : undefined
	}
	mark(): Error.Region {
		const result = this.region
		this.lastMark = this.location
		this.lastContent = ""
		return result
	}
	static create(backend: undefined): undefined
	static create(backend: Reader): BufferedReader
	static create(backend: Reader | undefined): BufferedReader | undefined {
		return backend ? new BufferedReader(backend) : undefined
	}
}
