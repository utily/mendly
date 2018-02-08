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
import { ArrayIterator } from "./ArrayIterator"
import { Iterator } from "./Iterator"

export class ArrayIteratorTest extends Fixture {
	constructor() {
		super("Utilities.ArrayIterator")
		this.add("empty", () => {
			this.expect(new ArrayIterator([]).next(), Is.undefined)
		})
		this.add("integers", () => {
			const integers = [1, 2, 4, 8, 16]
			const iterator = new ArrayIterator(integers)
			let count = 0
			integers.forEach(value => {
				count++
				this.expect(iterator.next(), Is.equal.to(value))
			})
			this.expect(count, Is.equal.to(5))
			this.expect(iterator.next(), Is.undefined)
		})
		this.add("map", () => {
			const integers = [0, 1, 2, 3, 4]
			let iterator: Iterator<number> = new ArrayIterator(integers)
			iterator = iterator.map(integer => 2 ** integer)
			let count = 0
			integers.forEach(value => {
				count++
				const current = iterator.next()
				this.expect(current, Is.equal.to(2 ** value))
			})
			this.expect(count, Is.equal.to(5))
			this.expect(iterator.next(), Is.undefined)
		})
		this.add("map empty", () => {
			const integers: number[] = []
			let iterator: Iterator<number> = new ArrayIterator(integers)
			iterator = iterator.map(integer => 2 ** integer)
			let count = 0
			integers.forEach(value => count++)
			this.expect(count, Is.equal.to(0))
			this.expect(iterator.next(), Is.undefined)
		})
		this.add("map single", () => {
			const integers = [4]
			let iterator: Iterator<number> = new ArrayIterator(integers)
			iterator = iterator.map(integer => 2 ** integer)
			let count = 0
			integers.forEach(value => {
				count++
				this.expect(iterator.next(), Is.equal.to(16))
			})
			this.expect(count, Is.equal.to(1))
			this.expect(iterator.next(), Is.undefined)
		})
	}
}
Fixture.add(new ArrayIteratorTest())
