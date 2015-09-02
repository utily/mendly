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

/// <reference path="../Error/Location" />
/// <reference path="../Error/Region" />
/// <reference path="Reader" />

module U10sil.IO {
	export class BufferedReader implements Reader {
		buffer: string = ""
		private line: number = 1
		private column: number = 1
		private lastMark: Error.Position
		private lastContent: string = ""
		constructor(private backend: Reader) {
		}
		isEmpty(): boolean {
			return this.buffer.length == 0 && this.backend.isEmpty()
		}
		peek(length: number = 1): string {
			var next: string = null
			while (length > this.buffer.length && (next = this.backend.read())) {
				this.buffer += next
			}
			return length > this.buffer.length ? "\0" : this.buffer.substring(0, length)
		}
		read(length: number = 1): string {
			var result = this.peek(length)
			if (this.buffer.length > 0)
				this.buffer = this.buffer.substring(length)
			for (var i = 0; i < result.length; i++) {
				switch (result.charAt(i)) {
					case "\0":
						this.column = 1
						this.line = 1
						break
					case "\n":
						this.column = 1
						this.line++
						break
					default:
						this.column++
						break
				}
			}
			this.lastContent += result
			return result
		}
		getResource(): string { return this.backend.getResource() }
		getLocation(): Error.Location { return new Error.Location(this.getResource(), this.line, this.column) }
		getRegion(): Error.Region { return new Error.Region(this.getResource(), this.lastMark, new Error.Position(this.line, this.column), this.lastContent) }
		mark(): Error.Region {
			var result = this.getRegion()
			this.lastMark = new Error.Position(this.line, this.column)
			return result
		}
	}
}
