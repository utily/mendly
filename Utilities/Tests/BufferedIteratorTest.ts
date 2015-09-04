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

/// <reference path="../../Unit/Fixture" />
/// <reference path="../../Unit/Constraints/Is" />
/// <reference path="../Iterator" />
/// <reference path="../BufferedIterator" />

module U10sil.Utilities.Tests {
	class StringIterator implements Iterator<string> {
		private position: number = 0
		constructor(private content: string) {
			if (!content)
				content = ""
		}
		next(): string {
			var ret = this.position < this.content.length ? this.content.charAt(this.position++) : null
			return ret
		}
	}
	export class BufferedIteratorTest extends Unit.Fixture {
		constructor() {
			super("Utilitites.BufferedIterator")
			this.add("empty string", () => {
				var bi = new BufferedIterator(new StringIterator(""))
				this.expect(bi.next() === null)
			})
			this.add("iterate using peek()", () => {
				var testString = "let's iterate this string using peek()"
				var bi = new BufferedIterator(new StringIterator(testString))
				var result: string = ""
				while (bi.peek()) {
					result += bi.next()
				}
				this.expect(result === testString)
			})
			this.add("iterate using next()", () => {
				var testString = "let's iterate this string using next()"
				var bi = new BufferedIterator(new StringIterator(testString))
				var character: string
				var result: string = ""
				while ((character = bi.next())) {
					result += character
				}
				this.expect(result === testString)
			})
			this.add("peek() and next()", () => {
				var testString = "abcdef"
				var bi = new BufferedIterator(new StringIterator(testString))
				// Force the reader to buffer the entire string
				this.expect(bi.peek(5) === "f")
				this.expect(bi.next() == "a")
				this.expect(bi.next() == "b")
				this.expect(bi.next() == "c")
				this.expect(bi.next() == "d")
				this.expect(bi.next() == "e")
				this.expect(bi.next() == "f")
			})
		}
	}
	Unit.Fixture.add(new BufferedIteratorTest())
}
