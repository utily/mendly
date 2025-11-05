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

import { Indenter } from "./Indenter"
import { StringWriter } from "./StringWriter"

describe("IO.Indenter", () => {
	it("nothing", async () => {
		const result = StringWriter.create() as StringWriter
		const writer = new Indenter(result)
		expect(await writer).toBeTruthy()
		expect(await writer.opened).toBeTruthy()
		expect(await writer.close()).toBeTruthy()
		expect(result.result).toEqual("")
	})
	it("simple", async () => {
		const result = StringWriter.create() as StringWriter
		const writer = new Indenter(result)
		expect(await writer).toBeTruthy()
		expect(await writer.opened).toBeTruthy()
		expect(await writer.writeLine("The power of Attraction."))
		expect(await writer.close()).toBeTruthy()
		expect(result.result).toEqual("The power of Attraction.\n")
	})
	it("indentation", async () => {
		const result = StringWriter.create() as StringWriter
		const writer = new Indenter(result)
		expect(await writer).toBeTruthy()
		expect(await writer.opened).toBeTruthy()
		expect(await writer.writeLine("function foo(bar) {"))
		expect(writer.increase())
		expect(await writer.writeLine("return bar"))
		expect(writer.decrease())
		expect(await writer.writeLine("}"))
		expect(await writer.close()).toBeTruthy()
		expect(result.result).toEqual("function foo(bar) {\n\treturn bar\n}\n")
	})
	it("complex", async () => {
		const result = StringWriter.create() as StringWriter
		const writer = new Indenter(result)
		expect(await writer).toBeTruthy()
		expect(await writer.opened).toBeTruthy()
		expect(await writer.writeLine("function foo(bar) {"))
		expect(writer.increase())
		expect(await writer.writeLine("if (!bar)"))
		expect(writer.increase())
		expect(await writer.writeLine("bar = \"\""))
		expect(writer.decrease())
		expect(await writer.writeLine("return bar"))
		expect(writer.decrease())
		expect(await writer.writeLine("}"))
		expect(await writer.close()).toBeTruthy()
		expect(result.result).toEqual("function foo(bar) {\n\tif (!bar)\n\t\tbar = \"\"\n\treturn bar\n}\n")
	})
})
