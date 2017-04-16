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

import { Fixture, Is } from "../../Unit/Fixture"
import { Iterator, BufferedIterator } from "../BufferedIterator"

class StringIterator implements Iterator<string> {
	private position: number = 0
	constructor(private content: string) {
		if (!content)
			content = ""
	}
	next(): string {
		return this.position < this.content.length ? this.content.charAt(this.position++) : undefined
	}
}
export class BufferedIteratorTest extends Fixture {
	constructor() {
		super("Utilities.BufferedIterator")
		this.add("empty string", () => {
			var bi = new BufferedIterator(new StringIterator(""))
			this.expect(bi.next(), Is.Equal().To(null))
		})
		this.add("iterate using peek()", () => {
			var testString = "let's iterate this string using peek()"
			var bi = new BufferedIterator(new StringIterator(testString))
			var result: string = ""
			while (bi.peek()) {
				result += bi.next()
			}
			this.expect(result, Is.Equal().To(testString))
		})
		this.add("iterate using next()", () => {
			var testString = "let's iterate this string using next()"
			var bi = new BufferedIterator(new StringIterator(testString))
			var character: string
			var result: string = ""
			while ((character = bi.next())) {
				result += character
			}
			this.expect(result, Is.Equal().To(testString))
		})
		this.add("peek() and next()", () => {
			var testString = "abcdef"
			var bi = new BufferedIterator(new StringIterator(testString))
			// Force the reader to buffer the entire string
			this.expect(bi.peek(5), Is.Equal().To("f"))
			this.expect(bi.next(), Is.Equal().To("a"))
			this.expect(bi.next(), Is.Equal().To("b"))
			this.expect(bi.next(), Is.Equal().To("c"))
			this.expect(bi.next(), Is.Equal().To("d"))
			this.expect(bi.next(), Is.Equal().To("e"))
			this.expect(bi.next(), Is.Equal().To("f"))
		})
	}
}
Fixture.add(new BufferedIteratorTest())
