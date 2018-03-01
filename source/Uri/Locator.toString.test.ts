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

import { Fixture, Is } from "../Unit"
import { Locator } from "./Locator"

export class LocatorToStringTest extends Fixture {
	constructor() {
		super("Uri.Locator.toString")
		this.add("full https", () => {
			const absolute = Locator.parse("https://server.example.com/folder0/folder1/")
			this.expect(absolute, Is.not.nullOrUndefined)
			if (absolute)
				this.expect(absolute.toString(), Is.equal.to("https://server.example.com/folder0/folder1/"))
		})
		this.add("full file", () => {
			const absolute = Locator.parse("file:///folder0/folder1/")
			this.expect(absolute, Is.not.nullOrUndefined)
			if (absolute)
				this.expect(absolute.toString(), Is.equal.to("file:///folder0/folder1/"))
		})
		this.add("absolute file", () => {
			const relative = Locator.parse("/folder2/file.extension")
			this.expect(relative, Is.not.nullOrUndefined)
			if (relative)
				this.expect(relative.toString(), Is.equal.to("/folder2/file.extension"))
		})
		this.add("relative", () => {
			const relative = Locator.parse("./folder2/file.extension")
			this.expect(relative, Is.not.nullOrUndefined)
			if (relative)
				this.expect(relative.toString(), Is.equal.to("./folder2/file.extension"))
		})
	}
}
Fixture.add(new LocatorToStringTest())
