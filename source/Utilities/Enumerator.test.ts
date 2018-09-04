// The MIT License (MIT)
//
// Copyright (c) 2017 Simon Mika
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

class StringEnumerator extends Enumerator<string> {
	private position: number = 0
	constructor(private content: string) {
		super(() => this.position < this.content.length ? this.content.charAt(this.position++) : undefined)
	}
}
describe("Utilities.Enumerator", () => {
	it("empty string", () => {
		const enumerator = new StringEnumerator("")
		expect(enumerator.fetch()).toBeUndefined()
	})
	it("enumerate using next()", () => {
		const content = "let's enumerate this string using next()"
		const enumerator = new StringEnumerator(content)
		let result: string = ""
		let item: string | undefined
		while (item = enumerator.fetch())
			result += item
		expect(result).toEqual(content)
	})
	it("map", () => {
		const content = "let's map this string using map to upper case"
		const enumerator = new StringEnumerator(content).map(c => c.toUpperCase())
		let result: string = ""
		let item: string | undefined
		while (item = enumerator.fetch())
			result += item
		expect(result).toEqual(content.toUpperCase())
	})
	it("reduce", () => {
		const content = "let's reduce this string back to a string again using reduce"
		const enumerator = new StringEnumerator(content)
		const result = enumerator.reduce((r, item) => r + item, "")
		expect(result).toEqual(content)
	})
	it("apply", () => {
		const content = "let's verify the characters of this string one by one using apply"
		const enumerator = new StringEnumerator(content)
		let i = 0
		enumerator.apply(item => expect(item).toEqual(content[i++]))
		expect(i).toEqual(content.length)
	})
	it("toArray", () => {
		const content = "let's reduce this string back to an array of single character strings"
		const enumerator = new StringEnumerator(content)
		const result = enumerator.toArray()
		expect(result).toEqual(content.split(""))
	})
	it("last", () => {
		const content = "let's reduce this string back to an array of single character strings"
		const enumerator = new StringEnumerator(content)
		const result = enumerator.last
		expect(result).toEqual("s")
	})
})
