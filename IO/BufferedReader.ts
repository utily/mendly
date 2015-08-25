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
		private line: number
		private column: number
		private lastMark: Error.Position
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
			return length > this.buffer.length ? null : this.buffer.slice(0, length - 1)
		}
		read(length: number = 1): string {
			var result = this.peek(length)
			if (this.buffer.length > 1) {
				this.buffer = this.buffer.slice(1)
			}
			for (var i = 0; i < result.length; i++) {
				switch (result.charAt(i)) {
					case "\0":
						this.column = 0
						this.line = 0
						break
					case "\n":
						this.column = 0
						this.line++
						break
					default:
						this.column++
						break
				}
			}
			return result
		}
		getResource(): string { return this.backend.getResource() }
		getLocation(): Error.Location { return new Error.Location(this.getResource(), this.line, this.column) }
		mark(): Error.Region {
			var result = new Error.Region(this.getResource(), this.lastMark, new Error.Position(this.line, this.column))
			this.lastMark = new Error.Position(this.line, this.column)
			return result
		}
	}
}
