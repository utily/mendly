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

export class StringReaderTest extends Fixture {
	constructor() {
		super("IO.StringReader")
		const errorHandler = new Error.ConsoleHandler()
		this.add("empty", () => {
			const sr = new StringReader("")
			this.expect(sr.isEmpty)
		})
		this.add("state check", () => {
			const sr = new StringReader("")
			this.expect(sr.location, Is.not.nullOrUndefined)
			// this.expect(sr.region, Is.NullOrUndefined())
			this.expect(sr.resource, Is.not.nullOrUndefined)
		})
		this.add("simple string", () => {
			const sr = new StringReader("abcdef")
			this.expect(sr.read(), Is.equal.to("a"))
			this.expect(sr.read(), Is.equal.to("b"))
			this.expect(sr.read(), Is.equal.to("c"))
			this.expect(sr.read(), Is.equal.to("d"))
			this.expect(sr.read(), Is.equal.to("e"))
			this.expect(sr.read(), Is.equal.to("f"))
		})
		this.add("simple string with location", () => {
			const sr = new StringReader("abc\ndef")
			this.expect(sr.location.column, Is.equal.to(1))
			this.expect(sr.location.line, Is.equal.to(1))
			sr.read()
			this.expect(sr.location.column, Is.equal.to(2))
			this.expect(sr.location.line, Is.equal.to(1))
			sr.read()
			this.expect(sr.location.column, Is.equal.to(3))
			this.expect(sr.location.line, Is.equal.to(1))
			sr.read()
			this.expect(sr.location.column, Is.equal.to(4))
			this.expect(sr.location.line, Is.equal.to(1))
			sr.read()
			this.expect(sr.location.column, Is.equal.to(1))
			this.expect(sr.location.line, Is.equal.to(2))
			sr.read()
			this.expect(sr.location.column, Is.equal.to(2))
			this.expect(sr.location.line, Is.equal.to(2))
			sr.read()
			this.expect(sr.location.column, Is.equal.to(3))
			this.expect(sr.location.line, Is.equal.to(2))
			sr.read()
			this.expect(sr.isEmpty)
		})
		this.add("tabs and newlines", () => {
			const sr = new StringReader("\t\t\t\n\t\t\t")
			this.expect(sr.location.column, Is.equal.to(1))
			this.expect(sr.location.line, Is.equal.to(1))
			sr.read()
			this.expect(sr.location.column, Is.equal.to(2))
			this.expect(sr.location.line, Is.equal.to(1))
			sr.read()
			this.expect(sr.location.column, Is.equal.to(3))
			this.expect(sr.location.line, Is.equal.to(1))
			sr.read()
			this.expect(sr.location.column, Is.equal.to(4))
			this.expect(sr.location.line, Is.equal.to(1))
			sr.read()
			this.expect(sr.location.column, Is.equal.to(1))
			this.expect(sr.location.line, Is.equal.to(2))
			sr.read()
			this.expect(sr.location.column, Is.equal.to(2))
			this.expect(sr.location.line, Is.equal.to(2))
			sr.read()
			this.expect(sr.location.column, Is.equal.to(3))
			this.expect(sr.location.line, Is.equal.to(2))
			sr.read()
			this.expect(sr.isEmpty)
		})
		this.add("mark", () => {
			const sr = new StringReader("abc\0")
			this.expect(sr.mark(), Is.not.nullOrUndefined)
			sr.read(); sr.read(); sr.read()
			const region = sr.region
			this.expect(region.start.line, Is.equal.to(1))
			this.expect(region.start.column, Is.equal.to(1))
			this.expect(region.end.line, Is.equal.to(1))
			this.expect(region.end.column, Is.equal.to(4))
		})
	}
}
Fixture.add(new StringReaderTest())
