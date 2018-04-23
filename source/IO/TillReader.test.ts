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

import { Fixture, Is } from "../Unit"
import { StringReader } from "./StringReader"
import { TillReader } from "./TillReader"

export class TillReaderTest extends Fixture {
	constructor() {
		super("IO.TillReader")
		this.add("empty", async () => {
			const reader = TillReader.create(StringReader.create(""), "\n")
			this.expect(await reader.isEmpty)
		})
		this.add("state check", () => {
			const reader = TillReader.create(StringReader.create(""), "\n")
			this.expect(reader.location, Is.not.nullOrUndefined)
			// this.expect(sr.region, Is.NullOrUndefined())
			this.expect(reader.resource, Is.not.nullOrUndefined)
		})
		this.add("simple string", async () => {
			const reader = TillReader.create(StringReader.create("abcdef"), "d")
			this.expect(reader.read(), Is.equal.to("a"))
			this.expect(reader.read(), Is.equal.to("b"))
			this.expect(reader.read(), Is.equal.to("c"))
			this.expect(reader.read(), Is.undefined)
			this.expect(await reader.isEmpty)
		})
		this.add("simple string with location", async () => {
			const reader = TillReader.create(StringReader.create("abc\ndef"), "e")
			this.expect(reader.location.column, Is.equal.to(1))
			this.expect(reader.location.line, Is.equal.to(1))
			this.expect(reader.read(), Is.equal.to("a"))
			this.expect(reader.location.column, Is.equal.to(2))
			this.expect(reader.location.line, Is.equal.to(1))
			this.expect(reader.read(), Is.equal.to("b"))
			this.expect(reader.location.column, Is.equal.to(3))
			this.expect(reader.location.line, Is.equal.to(1))
			this.expect(reader.read(), Is.equal.to("c"))
			this.expect(reader.location.column, Is.equal.to(4))
			this.expect(reader.location.line, Is.equal.to(1))
			this.expect(reader.read(), Is.equal.to("\n"))
			this.expect(reader.location.column, Is.equal.to(1))
			this.expect(reader.location.line, Is.equal.to(2))
			this.expect(reader.read(), Is.equal.to("d"))
			this.expect(reader.location.column, Is.equal.to(2))
			this.expect(reader.location.line, Is.equal.to(2))
			this.expect(reader.read(), Is.undefined)
			this.expect(await reader.isEmpty)
		})
	}
}
Fixture.add(new TillReaderTest())
