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
import { Enumerator } from "./Enumerator"
import { BufferedEnumerator } from "./BufferedEnumerator"

// tslint:disable:max-classes-per-file

class StringEnumerator extends Enumerator<string> {
	private position: number = 0
	constructor(private content: string) {
		super(() => this.position < this.content.length ? this.content.charAt(this.position++) : undefined)
	}
}
export class BufferedEnumeratorTest extends Fixture {
	constructor() {
		super("Utilities.BufferedEnumerator")
		this.add("empty string", () => {
			const bi = new BufferedEnumerator(new StringEnumerator(""))
			this.expect(bi.fetch(), Is.undefined)
		})
		this.add("enumerate using peek()", () => {
			const testString = "let's enumerate this string using peek()"
			const bi = new BufferedEnumerator(new StringEnumerator(testString))
			let result: string = ""
			while (bi.peek()) {
				result += bi.fetch()
			}
			this.expect(result, Is.equal.to(testString))
		})
		this.add("enumerate using next()", () => {
			const testString = "let's enumerate this string using next()"
			const bi = new BufferedEnumerator(new StringEnumerator(testString))
			let character: string | undefined
			let result: string = ""
			while ((character = bi.fetch())) {
				result += character
			}
			this.expect(result, Is.equal.to(testString))
		})
		this.add("peek() and next()", () => {
			const testString = "abcdef"
			const bi = new BufferedEnumerator(new StringEnumerator(testString))
			// Force the reader to buffer the entire string
			this.expect(bi.peek(5), Is.equal.to("f"))
			this.expect(bi.fetch(), Is.equal.to("a"))
			this.expect(bi.fetch(), Is.equal.to("b"))
			this.expect(bi.fetch(), Is.equal.to("c"))
			this.expect(bi.fetch(), Is.equal.to("d"))
			this.expect(bi.fetch(), Is.equal.to("e"))
			this.expect(bi.fetch(), Is.equal.to("f"))
		})
	}
}
Fixture.add(new BufferedEnumeratorTest())
