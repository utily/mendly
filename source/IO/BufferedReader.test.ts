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

import * as Error from "../Error"
import { Fixture, Is } from "../Unit"
import { StringReader } from "./StringReader"
import { BufferedReader } from "./BufferedReader"

export class BufferedReaderTest extends Fixture {
	constructor() {
		super("IO.BufferedReader")
		var errorHandler = new Error.ConsoleHandler()
		this.add("empty", () => {
			var br = new BufferedReader(new StringReader(""))
			this.expect(br.isEmpty)
		})
		this.add("state check", () => {
			var br = new BufferedReader(new StringReader(""))
			this.expect(br.location, Is.not.nullOrUndefined)
			this.expect(br.region, Is.not.nullOrUndefined)
			this.expect(br.resource, Is.not.nullOrUndefined)
		})
		this.add("peek", () => {
			var br = new BufferedReader(new StringReader("foobar"))
			this.expect(br.peek(1), Is.equal.to("f"))
			this.expect(br.peek(2), Is.equal.to("fo"))
			this.expect(br.peek(3), Is.equal.to("foo"))
			this.expect(br.peek(4), Is.equal.to("foob"))
			this.expect(br.peek(5), Is.equal.to("fooba"))
			this.expect(br.peek(6), Is.equal.to("foobar"))
		})
		this.add("read one at a time", () => {
			var br = new BufferedReader(new StringReader("abcdef"))
			this.expect(br.read(), Is.equal.to("a"))
			this.expect(br.read(), Is.equal.to("b"))
			this.expect(br.read(), Is.equal.to("c"))
			this.expect(br.read(), Is.equal.to("d"))
			this.expect(br.read(), Is.equal.to("e"))
			this.expect(br.read(), Is.equal.to("f"))
		})
		this.add("read three at a time", () => {
			var br = new BufferedReader(new StringReader("abcdef"))
			this.expect(br.read(3), Is.equal.to("abc"))
			this.expect(br.read(3), Is.equal.to("def"))
		})
		this.add("read three at a time with a newline", () => {
			var br = new BufferedReader(new StringReader("abc\ndef"))
			this.expect(br.read(3), Is.equal.to("abc"))
			this.expect(br.read(1), Is.equal.to("\n"))
			this.expect(br.read(3), Is.equal.to("def"))
		})
		this.add("string location", () => {
			var br = new BufferedReader(new StringReader("abc\ndef"))
			this.expect(br.location.column, Is.equal.to(1))
			this.expect(br.location.line, Is.equal.to(1))
			br.read()
			this.expect(br.location.column, Is.equal.to(2))
			this.expect(br.location.line, Is.equal.to(1))
			br.read()
			this.expect(br.location.column, Is.equal.to(3))
			this.expect(br.location.line, Is.equal.to(1))
			br.read()
			this.expect(br.location.column, Is.equal.to(4))
			this.expect(br.location.line, Is.equal.to(1))
			br.read()
			this.expect(br.location.column, Is.equal.to(1))
			this.expect(br.location.line, Is.equal.to(2))
			br.read()
			this.expect(br.location.column, Is.equal.to(2))
			this.expect(br.location.line, Is.equal.to(2))
			br.read()
			this.expect(br.location.column, Is.equal.to(3))
			this.expect(br.location.line, Is.equal.to(2))
			br.read()
			this.expect(br.isEmpty)
		})
		this.add("tabs and newlines location", () => {
			var br = new BufferedReader(new StringReader("\t\t\t\n\t\t\t"))
			this.expect(br.location.column, Is.equal.to(1))
			this.expect(br.location.line, Is.equal.to(1))
			br.read()
			this.expect(br.location.column, Is.equal.to(2))
			this.expect(br.location.line, Is.equal.to(1))
			br.read()
			this.expect(br.location.column, Is.equal.to(3))
			this.expect(br.location.line, Is.equal.to(1))
			br.read()
			this.expect(br.location.column, Is.equal.to(4))
			this.expect(br.location.line, Is.equal.to(1))
			br.read()
			this.expect(br.location.column, Is.equal.to(1))
			this.expect(br.location.line, Is.equal.to(2))
			br.read()
			this.expect(br.location.column, Is.equal.to(2))
			this.expect(br.location.line, Is.equal.to(2))
			br.read()
			this.expect(br.location.column, Is.equal.to(3))
			this.expect(br.location.line, Is.equal.to(2))
			br.read()
			this.expect(br.isEmpty)
		})
		this.add("mark", () => {
			var br = new BufferedReader(new StringReader("abc\0"))
			this.expect(br.mark(), Is.not.nullOrUndefined)
			br.read(); br.read(); br.read()
			var region = br.region
			this.expect(region.start.line, Is.equal.to(1))
			this.expect(region.start.column, Is.equal.to(1))
			this.expect(region.end.line, Is.equal.to(1))
			this.expect(region.end.column, Is.equal.to(4))
		})
	}
}
Fixture.add(new BufferedReaderTest())
