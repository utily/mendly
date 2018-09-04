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
import { BufferedReader } from "./BufferedReader"

describe("IO.BufferedReader", () => {
	it("empty", async () => {
		const br = BufferedReader.create(StringReader.create(""))
		expect(await br.isEmpty)
	})
	it("state check", () => {
		const br = BufferedReader.create(StringReader.create(""))
		expect(br.location).toBeTruthy()
		expect(br.region).toBeTruthy()
		expect(br.resource).toBeTruthy()
	})
	it("peek", () => {
		const br = BufferedReader.create(StringReader.create("foobar"))
		expect(br.peek(1)).toEqual("f")
		expect(br.peek(2)).toEqual("fo")
		expect(br.peek(3)).toEqual("foo")
		expect(br.peek(4)).toEqual("foob")
		expect(br.peek(5)).toEqual("fooba")
		expect(br.peek(6)).toEqual("foobar")
	})
	it("read one at a time", () => {
		const br = BufferedReader.create(StringReader.create("abcdef"))
		expect(br.read()).toEqual("a")
		expect(br.read()).toEqual("b")
		expect(br.read()).toEqual("c")
		expect(br.read()).toEqual("d")
		expect(br.read()).toEqual("e")
		expect(br.read()).toEqual("f")
	})
	it("read three at a time", () => {
		const br = BufferedReader.create(StringReader.create("abcdef"))
		expect(br.read(3)).toEqual("abc")
		expect(br.read(3)).toEqual("def")
	})
	it("read three at a time with a newline", () => {
		const br = BufferedReader.create(StringReader.create("abc\ndef"))
		expect(br.read(3)).toEqual("abc")
		expect(br.read(1)).toEqual("\n")
		expect(br.read(3)).toEqual("def")
	})
	it("string location", async () => {
		const br = BufferedReader.create(StringReader.create("abc\ndef"))
		expect(br.location.column).toEqual(1)
		expect(br.location.line).toEqual(1)
		br.read()
		expect(br.location.column).toEqual(2)
		expect(br.location.line).toEqual(1)
		br.read()
		expect(br.location.column).toEqual(3)
		expect(br.location.line).toEqual(1)
		br.read()
		expect(br.location.column).toEqual(4)
		expect(br.location.line).toEqual(1)
		br.read()
		expect(br.location.column).toEqual(1)
		expect(br.location.line).toEqual(2)
		br.read()
		expect(br.location.column).toEqual(2)
		expect(br.location.line).toEqual(2)
		br.read()
		expect(br.location.column).toEqual(3)
		expect(br.location.line).toEqual(2)
		br.read()
		expect(await br.isEmpty)
	})
	it("tabs and newlines location", async () => {
		const br = BufferedReader.create(StringReader.create("\t\t\t\n\t\t\t"))
		expect(br.location.column).toEqual(1)
		expect(br.location.line).toEqual(1)
		br.read()
		expect(br.location.column).toEqual(2)
		expect(br.location.line).toEqual(1)
		br.read()
		expect(br.location.column).toEqual(3)
		expect(br.location.line).toEqual(1)
		br.read()
		expect(br.location.column).toEqual(4)
		expect(br.location.line).toEqual(1)
		br.read()
		expect(br.location.column).toEqual(1)
		expect(br.location.line).toEqual(2)
		br.read()
		expect(br.location.column).toEqual(2)
		expect(br.location.line).toEqual(2)
		br.read()
		expect(br.location.column).toEqual(3)
		expect(br.location.line).toEqual(2)
		br.read()
		expect(await br.isEmpty)
	})
	it("mark", () => {
		const br = BufferedReader.create(StringReader.create("abc\0"))
		expect(br).toBeTruthy()
		if (br) {
			expect(br.mark()).toBeTruthy()
			br.read(); br.read(); br.read()
			const region = br.region
			expect(region).toBeTruthy()
			if (region) {
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
			}
		}
	})
})
