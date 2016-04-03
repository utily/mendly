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

import { Fixture, Is } from "../../Unit/Fixture"
import { Locator } from "../Locator"

export class LocatorParseTest extends Fixture {
	constructor() {
		super("Uri.Locator.parse")
		this.add("undefined", () => {
			this.expect(Locator.parse(undefined), Is.Undefined())
		})
		this.add("null", () => {
			this.expect(Locator.parse(null), Is.Null())
		})
		this.add("empty", () => {
			this.expect(Locator.parse(""), Is.Undefined())
		})
		this.add("absolute file", () => {
			var locator = Locator.parse("file:///folder/file.extension")
			this.expect(locator.getScheme(), Is.Equal().To(["file"]))
			this.expect(locator.getAuthority(), Is.Undefined())
			this.expect(locator.getPath(), Is.Equal().To(["folder", "file.extension"]))
		})
		this.add("relative file", () => {
			var locator = Locator.parse("file://./folder/file.extension")
			this.expect(locator.getScheme(), Is.Equal().To(["file"]))
			this.expect(locator.getAuthority(), Is.Undefined())
			this.expect(locator.getPath(), Is.Equal().To([".", "folder", "file.extension"]))
		})
		this.add("explicitly relative path", () => {
			var locator = Locator.parse("./folder/file.extension")
			this.expect(locator.getScheme(), Is.Undefined())
			this.expect(locator.getAuthority(), Is.Undefined())
			this.expect(locator.getPath(), Is.Equal().To([".", "folder", "file.extension"]))
		})
		this.add("implicitly relative path", () => {
			var locator = Locator.parse("folder/file.extension")
			this.expect(locator.getScheme(), Is.Undefined())
			this.expect(locator.getAuthority(), Is.Undefined())
			this.expect(locator.getPath(), Is.Equal().To([".", "folder", "file.extension"]))
		})
		this.add("absolute path", () => {
			var locator = Locator.parse("/folder/file.extension")
			this.expect(locator.getScheme(), Is.Undefined())
			this.expect(locator.getAuthority(), Is.Undefined())
			this.expect(locator.getPath(), Is.Equal().To(["folder", "file.extension"]))
		})
		this.add("explicitly relative folder path", () => {
			var locator = Locator.parse("./folder/folder.next/")
			this.expect(locator.getScheme(), Is.Undefined())
			this.expect(locator.getAuthority(), Is.Undefined())
			this.expect(locator.getPath(), Is.Equal().To([".", "folder", "folder.next", ""]))
		})
		this.add("implicitly relative folder path", () => {
			var locator = Locator.parse("folder/folder.next/")
			this.expect(locator.getScheme(), Is.Undefined())
			this.expect(locator.getAuthority(), Is.Undefined())
			this.expect(locator.getPath(), Is.Equal().To([".", "folder", "folder.next", ""]))
		})
		this.add("absolute folder path", () => {
			var locator = Locator.parse("/folder/folder.next/")
			this.expect(locator.getScheme(), Is.Undefined())
			this.expect(locator.getAuthority(), Is.Undefined())
			this.expect(locator.getPath(), Is.Equal().To(["folder", "folder.next", ""]))
		})
		this.add("full https url", () => {
			var locator = Locator.parse("https://server.example.com/folder/file.extension")
			this.expect(locator.getScheme(), Is.Equal().To(["https"]))
			this.expect(locator.getAuthority().getUser(), Is.Undefined())
			this.expect(locator.getAuthority().getEndpoint().getHost(), Is.Equal().To(["server", "example", "com"]))
			this.expect(locator.getAuthority().getEndpoint().getPort(), Is.Undefined())
			this.expect(locator.getPath(), Is.Equal().To(["folder", "file.extension"]))
		})
		this.add("schemeless url", () => {
			var locator = Locator.parse("//server.example.com/folder/file.extension")
			this.expect(locator.getScheme(), Is.Undefined())
			this.expect(locator.getAuthority().getUser(), Is.Undefined())
			this.expect(locator.getAuthority().getEndpoint().getHost(), Is.Equal().To(["server", "example", "com"]))
			this.expect(locator.getAuthority().getEndpoint().getPort(), Is.Undefined())
			this.expect(locator.getPath(), Is.Equal().To(["folder", "file.extension"]))
		})
	}
}
Fixture.add(new LocatorParseTest())
