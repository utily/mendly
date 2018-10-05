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
import * as Uri from "../Uri"
import { Reader } from "./Reader"

export class StringReader extends Reader {
	tabSize: number = 2
	private count: number = 0
	private line: number = 1
	private column: number = 1
	private lastPosition: Error.Position
	private lastContent: string = ""
	readonly readable = true
	get opened(): boolean { return this.count + 1 >= this.content.length }
	get isEmpty(): Promise<boolean> {
		return Promise.resolve(this.opened)
	}
	get location(): Error.Location { return new Error.Location(this.resource, this.line, this.column) }
	get region(): Error.Region { return new Error.Region(this.resource, this.lastPosition, this.location, this.lastContent) }
	private constructor(private content: string, readonly resource: Uri.Locator) {
		super()
		this.content += "\0"
		this.lastPosition = this.location
	}
	async close(): Promise<boolean> {
		const result = !await this.isEmpty
		if (result)
			this.count = this.content.length
		return result
	}
	read(): string | undefined {
		let result: string | undefined
		if (this.count < this.content.length)
			result = this.content.charAt(this.count)
		else if (this.count == this.content.length)
			result = undefined
		this.count++
		if (result) {
			switch (result) {
				case "\n":
					this.line++
					this.column = 1
					break
				case "\t":
					this.column += this.tabSize
					break
				default:
					this.column++
					break
			}
			this.lastContent += result
		}
		return result
	}
	mark(): Error.Region {
		const result = this.region
		this.lastPosition = this.location
		this.lastContent = ""
		return result
	}
	static create(content: undefined, path?: Uri.Locator): undefined
	static create(content: string, path?: Uri.Locator): Reader
	static create(content: string | undefined, resource?: Uri.Locator): Reader | undefined {
		return content != undefined ? new StringReader(content, resource || Uri.Locator.empty) : undefined
	}
}
