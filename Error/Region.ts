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

/// <reference path="Position" />
/// <reference path="Location" />

module U10sil.Error {
	export class Region {
		constructor(private resource: string, private start?: Position, private end?: Position, private content?: string) { }
		getResource() { return this.resource }
		getStart() { return this.start }
		getEnd() { return this.end }
		getContent() { return this.content; }
		merge(other: Region) { return new Region(this.resource, this.start, other.end, this.content + other.content) }
		toString() {
			var result = this.resource
			if (this.start && this.end)
				result += " (" + this.start.toString() + " - " + this.end.toString() + ") "
			if (this.content)
				result += this.content
			return result
		}
	}
}
