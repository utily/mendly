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

import * as Uri from "../Uri"
import { Writer } from "./Writer"
import "./TextWriter"
import * as fs from "fs"

describe("IO.TextWriter", () => {
	it("nothing", async () => {
		const resource = Uri.Locator.parse("file:///./textWriter-nothing.txt")
		const writer = await Writer.open(resource)
		expect(await writer).toBeTruthy()
		expect(await writer.opened).toBeTruthy()
		expect(await writer.close()).toBeTruthy()
		const path = resource.path.join("/")
		expect(fs.readFileSync(path).join()).toEqual("")
		fs.unlinkSync(path)
	})
})
describe("IO.TextWriter", () => {
	it("simple", async () => {
		const resource = Uri.Locator.parse("file:///./textWriter-simple.txt")
		const writer = await Writer.open(resource)
		expect(await writer).toBeTruthy()
		expect(await writer.opened).toBeTruthy()
		expect(await writer.writeLine("The meaning of 42?")).toBeTruthy()
		expect(await writer.close()).toBeTruthy()
		const path = resource.path.join("/")
		expect(fs.readFileSync(path).toString("utf8")).toEqual("The meaning of 42?\n")
		fs.unlinkSync(path)
	})
})
describe("IO.TextWriter", () => {
	it("multiline", async () => {
		const resource = Uri.Locator.parse("file:///./textWriter-multiline.txt")
		const writer = await Writer.open(resource)
		expect(await writer).toBeTruthy()
		expect(await writer.opened).toBeTruthy()
		expect(await writer.writeLine("The meaning of 42?") && await writer.writeLine("The meaning of 43?")).toBeTruthy()
		expect(await writer.close()).toBeTruthy()
		const path = resource.path.join("/")
		expect(fs.readFileSync(path).toString("utf8")).toEqual("The meaning of 42?\nThe meaning of 43?\n")
		fs.unlinkSync(path)
	})
})
