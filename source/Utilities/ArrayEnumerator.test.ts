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

import { ArrayEnumerator } from "./ArrayEnumerator"
import { Enumerator } from "./Enumerator"

describe("Utilities.ArrayEnumerator", () => {
	it("empty", () => {
		expect(new ArrayEnumerator([]).fetch()).toBeUndefined()
	})
	it("integers", () => {
		const integers = [1, 2, 4, 8, 16]
		const enumerator = new ArrayEnumerator(integers)
		let count = 0
		integers.forEach(value => {
			count++
			expect(enumerator.fetch()).toEqual(value)
		})
		expect(count).toEqual(5)
		expect(enumerator.fetch()).toBeUndefined()
	})
	it("map", () => {
		const integers = [0, 1, 2, 3, 4]
		let enumerator: Enumerator<number> = new ArrayEnumerator(integers)
		enumerator = enumerator.map(integer => 2 ** integer)
		let count = 0
		integers.forEach(value => {
			count++
			const current = enumerator.fetch()
			expect(current).toEqual(2 ** value)
		})
		expect(count).toEqual(5)
		expect(enumerator.fetch()).toBeUndefined()
	})
	it("map empty", () => {
		const integers: number[] = []
		let enumerator: Enumerator<number> = new ArrayEnumerator(integers)
		enumerator = enumerator.map(integer => 2 ** integer)
		let count = 0
		integers.forEach(value => count++)
		expect(count).toEqual(0)
		expect(enumerator.fetch()).toBeUndefined()
	})
	it("map single", () => {
		const integers = [4]
		let enumerator: Enumerator<number> = new ArrayEnumerator(integers)
		enumerator = enumerator.map(integer => 2 ** integer)
		let count = 0
		integers.forEach(value => {
			count++
			expect(enumerator.fetch()).toEqual(16)
		})
		expect(count).toEqual(1)
		expect(enumerator.fetch()).toBeUndefined()
	})
})
