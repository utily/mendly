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

import { Enumerator } from "./Enumerator"
import { BufferedEnumerator } from "./BufferedEnumerator"

class StringEnumerator extends Enumerator<string> {
	private position: number = 0
	constructor(private content: string) {
		super(() => this.position < this.content.length ? this.content.charAt(this.position++) : undefined)
	}
}
describe("Utilities.BufferedEnumerator", () => {
	it("empty string", () => {
		const bi = new BufferedEnumerator(new StringEnumerator(""))
		expect(bi.fetch()).toBeUndefined()
	})
	it("enumerate using peek()", () => {
		const testString = "let's enumerate this string using peek()"
		const bi = new BufferedEnumerator(new StringEnumerator(testString))
		let result: string = ""
		while (bi.peek()) {
			result += bi.fetch()
		}
		expect(result).toEqual(testString)
	})
	it("enumerate using next()", () => {
		const testString = "let's enumerate this string using next()"
		const bi = new BufferedEnumerator(new StringEnumerator(testString))
		let character: string | undefined
		let result: string = ""
		while ((character = bi.fetch())) {
			result += character
		}
		expect(result).toEqual(testString)
	})
	it("peek() and next()", () => {
		const testString = "abcdef"
		const bi = new BufferedEnumerator(new StringEnumerator(testString))
		// Force the reader to buffer the entire string
		expect(bi.peek(5)).toEqual("f")
		expect(bi.fetch()).toEqual("a")
		expect(bi.fetch()).toEqual("b")
		expect(bi.fetch()).toEqual("c")
		expect(bi.fetch()).toEqual("d")
		expect(bi.fetch()).toEqual("e")
		expect(bi.fetch()).toEqual("f")
	})
})
