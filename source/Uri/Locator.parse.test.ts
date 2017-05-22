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

export class LocatorParseTest extends Fixture {
	constructor() {
		super("Uri.Locator.parse")
		this.add("undefined", () => {
			this.expect(Locator.parse(undefined), Is.undefined)
		})
		this.add("null", () => {
			this.expect(Locator.parse(null), Is.null)
		})
		this.add("empty", () => {
			this.expect(Locator.parse(""), Is.undefined)
		})
		this.add("absolute file", () => {
			const locator = Locator.parse("file:///folder/file.extension")
			this.expect(locator.scheme, Is.equal.to(["file"]))
			this.expect(locator.authority, Is.undefined)
			this.expect(locator.path, Is.equal.to(["folder", "file.extension"]))
		})
		this.add("relative file", () => {
			const locator = Locator.parse("file://./folder/file.extension")
			this.expect(locator.scheme, Is.equal.to(["file"]))
			this.expect(locator.authority, Is.undefined)
			this.expect(locator.path, Is.equal.to([".", "folder", "file.extension"]))
		})
		this.add("explicitly relative path", () => {
			const locator = Locator.parse("./folder/file.extension")
			this.expect(locator.scheme, Is.undefined)
			this.expect(locator.authority, Is.undefined)
			this.expect(locator.path, Is.equal.to([".", "folder", "file.extension"]))
		})
		this.add("implicitly relative path", () => {
			const locator = Locator.parse("folder/file.extension")
			this.expect(locator.scheme, Is.undefined)
			this.expect(locator.authority, Is.undefined)
			this.expect(locator.path, Is.equal.to([".", "folder", "file.extension"]))
		})
		this.add("absolute path", () => {
			const locator = Locator.parse("/folder/file.extension")
			this.expect(locator.scheme, Is.undefined)
			this.expect(locator.authority, Is.undefined)
			this.expect(locator.path, Is.equal.to(["folder", "file.extension"]))
		})
		this.add("explicitly relative folder path", () => {
			const locator = Locator.parse("./folder/folder.next/")
			this.expect(locator.scheme, Is.undefined)
			this.expect(locator.authority, Is.undefined)
			this.expect(locator.path, Is.equal.to([".", "folder", "folder.next", ""]))
		})
		this.add("implicitly relative folder path", () => {
			const locator = Locator.parse("folder/folder.next/")
			this.expect(locator.scheme, Is.undefined)
			this.expect(locator.authority, Is.undefined)
			this.expect(locator.path, Is.equal.to([".", "folder", "folder.next", ""]))
		})
		this.add("absolute folder path", () => {
			const locator = Locator.parse("/folder/folder.next/")
			this.expect(locator.scheme, Is.undefined)
			this.expect(locator.authority, Is.undefined)
			this.expect(locator.path, Is.equal.to(["folder", "folder.next", ""]))
		})
		this.add("full https url", () => {
			const locator = Locator.parse("https://server.example.com/folder/file.extension")
			this.expect(locator.scheme, Is.equal.to(["https"]))
			this.expect(locator.authority.user, Is.undefined)
			this.expect(locator.authority.endpoint.host, Is.equal.to(["server", "example", "com"]))
			this.expect(locator.authority.endpoint.port, Is.undefined)
			this.expect(locator.path, Is.equal.to(["folder", "file.extension"]))
		})
		this.add("schemeless url", () => {
			const locator = Locator.parse("//server.example.com/folder/file.extension")
			this.expect(locator.scheme, Is.undefined)
			this.expect(locator.authority.user, Is.undefined)
			this.expect(locator.authority.endpoint.host, Is.equal.to(["server", "example", "com"]))
			this.expect(locator.authority.endpoint.port, Is.undefined)
			this.expect(locator.path, Is.equal.to(["folder", "file.extension"]))
		})
	}
}
Fixture.add(new LocatorParseTest())
