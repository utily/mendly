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

import { Fixture, Is } from "../Unit"
import { Iterator } from "./Iterator"
import { BufferedIterator } from "./BufferedIterator"

// tslint:disable:max-classes-per-file

class StringIterator extends Iterator<string> {
	private position: number = 0
	constructor(private content: string) {
		super(() => this.position < this.content.length ? this.content.charAt(this.position++) : undefined)
	}
}
export class IteratorTest extends Fixture {
	constructor() {
		super("Utilities.Iterator")
		this.add("empty string", () => {
			const iterator = new StringIterator("")<.
			this.expect(iterator.next(), Is.undefined)
		})
		this.add("iterate using next()", () => {
			const content = "let's iterate this string using next()"
			const iterator = new StringIterator(content)
			let result: string = ""
			let item: string | undefined
			while (item = iterator.next())
				result += item
			this.expect(result, Is.equal.to(content))
		})
		this.add("map", () => {
			const content = "let's map this string using map to upper case"
			const iterator = new StringIterator(content).map(c => c.toUpperCase())
			let result: string = ""
			let item: string | undefined
			while (item = iterator.next())
				result += item
			this.expect(result, Is.equal.to(content.toUpperCase()))
		})
		this.add("reduce", () => {
			const content = "let's reduce this string back to a string again using reduce"
			const iterator = new StringIterator(content)
			const result = iterator.reduce((item, r) => r + item, "")
			this.expect(result, Is.equal.to(content))
		})
		this.add("reduce", () => {
			const content = "let's reduce this string back to a string again using reduce"
			const iterator = new StringIterator(content)
			let i = 0
			iterator.apply(item => this.expect(item, Is.equal.to(content[i++])))
			this.expect(i, Is.equal.to(content.length))
		})
	}
}
Fixture.add(new IteratorTest())
