// The MIT License (MIT)
//
// Copyright (c) 2018 Simon Mika
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

import { StringReader } from "./StringReader"
import { TillReader } from "./TillReader"

describe("IO.TillReader", () => {
	it("empty", async () => {
		const reader = TillReader.create(StringReader.create(""), "\n")
		expect(await reader.isEmpty)
	})
	it("state check", () => {
		const reader = TillReader.create(StringReader.create(""), "\n")
		expect(reader.location).toBeTruthy()
		expect(reader.resource).toBeTruthy()
	})
	it("stop directly", async () => {
		const reader = TillReader.create(StringReader.create("\nabcdef"), "\n")
		expect(await reader.isEmpty).toBeTruthy()
		expect(reader.read()).toBeUndefined()
	})
	it("simple string", async () => {
		const reader = TillReader.create(StringReader.create("abcdef"), "d")
		expect(reader.read()).toEqual("a")
		expect(reader.read()).toEqual("b")
		expect(reader.read()).toEqual("c")
		expect(reader.read()).toBeUndefined()
		expect(await reader.isEmpty)
	})
	it("simple string with location", async () => {
		const reader = TillReader.create(StringReader.create("abc\ndef"), "e")
		expect(reader.location.column).toEqual(1)
		expect(reader.location.line).toEqual(1)
		expect(reader.read()).toEqual("a")
		expect(reader.location.column).toEqual(2)
		expect(reader.location.line).toEqual(1)
		expect(reader.read()).toEqual("b")
		expect(reader.location.column).toEqual(3)
		expect(reader.location.line).toEqual(1)
		expect(reader.read()).toEqual("c")
		expect(reader.location.column).toEqual(4)
		expect(reader.location.line).toEqual(1)
		expect(reader.read()).toEqual("\n")
		expect(reader.location.column).toEqual(1)
		expect(reader.location.line).toEqual(2)
		expect(reader.read()).toEqual("d")
		expect(reader.location.column).toEqual(2)
		expect(reader.location.line).toEqual(2)
		expect(reader.read()).toBeUndefined()
		expect(await reader.isEmpty)
	})
})
