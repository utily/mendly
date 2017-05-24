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

import { Fixture, Is } from "../Unit"
import { Iterator } from "./Iterator"
import { BufferedIterator } from "./BufferedIterator"

// tslint:disable:max-classes-per-file

class StringIterator implements Iterator<string> {
	private position: number = 0
	constructor(private content: string) {
		if (!content)
			content = ""
	}
	next(): string | undefined {
		return this.position < this.content.length ? this.content.charAt(this.position++) : undefined
	}
}
export class BufferedIteratorTest extends Fixture {
	constructor() {
		super("Utilities.BufferedIterator")
		this.add("empty string", () => {
			const bi = new BufferedIterator(new StringIterator(""))
			this.expect(bi.next(), Is.undefined)
		})
		this.add("iterate using peek()", () => {
			const testString = "let's iterate this string using peek()"
			const bi = new BufferedIterator(new StringIterator(testString))
			let result: string = ""
			while (bi.peek()) {
				result += bi.next()
			}
			this.expect(result, Is.equal.to(testString))
		})
		this.add("iterate using next()", () => {
			const testString = "let's iterate this string using next()"
			const bi = new BufferedIterator(new StringIterator(testString))
			let character: string | undefined
			let result: string = ""
			while ((character = bi.next())) {
				result += character
			}
			this.expect(result, Is.equal.to(testString))
		})
		this.add("peek() and next()", () => {
			const testString = "abcdef"
			const bi = new BufferedIterator(new StringIterator(testString))
			// Force the reader to buffer the entire string
			this.expect(bi.peek(5), Is.equal.to("f"))
			this.expect(bi.next(), Is.equal.to("a"))
			this.expect(bi.next(), Is.equal.to("b"))
			this.expect(bi.next(), Is.equal.to("c"))
			this.expect(bi.next(), Is.equal.to("d"))
			this.expect(bi.next(), Is.equal.to("e"))
			this.expect(bi.next(), Is.equal.to("f"))
		})
	}
}
Fixture.add(new BufferedIteratorTest())
