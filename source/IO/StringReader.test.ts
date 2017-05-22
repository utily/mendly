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
		var errorHandler = new Error.ConsoleHandler()
		this.add("empty", () => {
			var sr = new StringReader("")
			this.expect(sr.isEmpty)
		})
		this.add("state check", () => {
			var sr = new StringReader("")
			this.expect(sr.location, Is.Not().NullOrUndefined())
			//this.expect(sr.region, Is.NullOrUndefined())
			this.expect(sr.resource, Is.Not().NullOrUndefined())
		})
		this.add("simple string", () => {
			var sr = new StringReader("abcdef")
			this.expect(sr.read(), Is.Equal().To("a"))
			this.expect(sr.read(), Is.Equal().To("b"))
			this.expect(sr.read(), Is.Equal().To("c"))
			this.expect(sr.read(), Is.Equal().To("d"))
			this.expect(sr.read(), Is.Equal().To("e"))
			this.expect(sr.read(), Is.Equal().To("f"))
		})
		this.add("simple string with location", () => {
			var sr = new StringReader("abc\ndef")
			this.expect(sr.location.column, Is.Equal().To(1))
			this.expect(sr.location.line, Is.Equal().To(1))
			sr.read()
			this.expect(sr.location.column, Is.Equal().To(2))
			this.expect(sr.location.line, Is.Equal().To(1))
			sr.read()
			this.expect(sr.location.column, Is.Equal().To(3))
			this.expect(sr.location.line, Is.Equal().To(1))
			sr.read()
			this.expect(sr.location.column, Is.Equal().To(4))
			this.expect(sr.location.line, Is.Equal().To(1))
			sr.read()
			this.expect(sr.location.column, Is.Equal().To(1))
			this.expect(sr.location.line, Is.Equal().To(2))
			sr.read()
			this.expect(sr.location.column, Is.Equal().To(2))
			this.expect(sr.location.line, Is.Equal().To(2))
			sr.read()
			this.expect(sr.location.column, Is.Equal().To(3))
			this.expect(sr.location.line, Is.Equal().To(2))
			sr.read()
			this.expect(sr.isEmpty)
		})
		this.add("tabs and newlines", () => {
			var sr = new StringReader("\t\t\t\n\t\t\t")
			this.expect(sr.location.column, Is.Equal().To(1))
			this.expect(sr.location.line, Is.Equal().To(1))
			sr.read()
			this.expect(sr.location.column, Is.Equal().To(2))
			this.expect(sr.location.line, Is.Equal().To(1))
			sr.read()
			this.expect(sr.location.column, Is.Equal().To(3))
			this.expect(sr.location.line, Is.Equal().To(1))
			sr.read()
			this.expect(sr.location.column, Is.Equal().To(4))
			this.expect(sr.location.line, Is.Equal().To(1))
			sr.read()
			this.expect(sr.location.column, Is.Equal().To(1))
			this.expect(sr.location.line, Is.Equal().To(2))
			sr.read()
			this.expect(sr.location.column, Is.Equal().To(2))
			this.expect(sr.location.line, Is.Equal().To(2))
			sr.read()
			this.expect(sr.location.column, Is.Equal().To(3))
			this.expect(sr.location.line, Is.Equal().To(2))
			sr.read()
			this.expect(sr.isEmpty)
		})
		this.add("mark", () => {
			var sr = new StringReader("abc\0")
			this.expect(sr.mark(), Is.Not().NullOrUndefined())
			sr.read(); sr.read(); sr.read()
			var region = sr.region
			this.expect(region.start.line, Is.Equal().To(1))
			this.expect(region.start.column, Is.Equal().To(1))
			this.expect(region.end.line, Is.Equal().To(1))
			this.expect(region.end.column, Is.Equal().To(4))
		})
	}
}
Fixture.add(new StringReaderTest())
