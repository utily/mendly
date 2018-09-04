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

import { StringReader } from "./StringReader"

describe("IO.StringReader", () => {
	it("empty", async () => {
		const reader = StringReader.create("")
		expect(await reader.isEmpty)
	})
	it("state check", () => {
		const reader = StringReader.create("")
		expect(reader.location).toBeTruthy()
		expect(reader.resource).toBeTruthy()
	})
	it("simple string", () => {
		const reader = StringReader.create("abcdef")
		expect(reader.read()).toEqual("a")
		expect(reader.read()).toEqual("b")
		expect(reader.read()).toEqual("c")
		expect(reader.read()).toEqual("d")
		expect(reader.read()).toEqual("e")
		expect(reader.read()).toEqual("f")
	})
	it("simple string with location", async () => {
		const reader = StringReader.create("abc\ndef")
		expect(reader.location.column).toEqual(1)
		expect(reader.location.line).toEqual(1)
		reader.read()
		expect(reader.location.column).toEqual(2)
		expect(reader.location.line).toEqual(1)
		reader.read()
		expect(reader.location.column).toEqual(3)
		expect(reader.location.line).toEqual(1)
		reader.read()
		expect(reader.location.column).toEqual(4)
		expect(reader.location.line).toEqual(1)
		reader.read()
		expect(reader.location.column).toEqual(1)
		expect(reader.location.line).toEqual(2)
		reader.read()
		expect(reader.location.column).toEqual(2)
		expect(reader.location.line).toEqual(2)
		reader.read()
		expect(reader.location.column).toEqual(3)
		expect(reader.location.line).toEqual(2)
		reader.read()
		expect(await reader.isEmpty)
	})
	it("tabs and newlines", async () => {
		const reader = StringReader.create("\t\t\t\n\t\t\t")
		expect(reader.location.column).toEqual(1)
		expect(reader.location.line).toEqual(1)
		reader.read()
		expect(reader.location.column).toEqual(2)
		expect(reader.location.line).toEqual(1)
		reader.read()
		expect(reader.location.column).toEqual(3)
		expect(reader.location.line).toEqual(1)
		reader.read()
		expect(reader.location.column).toEqual(4)
		expect(reader.location.line).toEqual(1)
		reader.read()
		expect(reader.location.column).toEqual(1)
		expect(reader.location.line).toEqual(2)
		reader.read()
		expect(reader.location.column).toEqual(2)
		expect(reader.location.line).toEqual(2)
		reader.read()
		expect(reader.location.column).toEqual(3)
		expect(reader.location.line).toEqual(2)
		reader.read()
		expect(await reader.isEmpty)
	})
	it("mark", () => {
		const reader = StringReader.create("abc\0")
		expect(reader.mark()).toBeTruthy()
		reader.read(); reader.read(); reader.read()
		const region = reader.region
		expect(region.start).toBeTruthy()
		if (region.start) {
			expect(region.start.line).toEqual(1)
			expect(region.start.column).toEqual(1)
		}
		expect(region.end).toBeTruthy()
		if (region.end) {
			expect(region.end.line).toEqual(1)
			expect(region.end.column).toEqual(4)
		}
	})
})
