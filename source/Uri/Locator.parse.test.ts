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

import { Locator } from "./Locator"

describe("Uri.Locator.parse", () => {
	it("undefined", () => {
		expect(Locator.parse(undefined)).toBeUndefined()
	})
	it("empty", () => {
		expect(Locator.parse("")).toBeUndefined()
	})
	it("absolute file", () => {
		const locator = Locator.parse("file:///folder/file.extension")
		expect(locator).toBeTruthy()
		if (locator) {
			expect(locator.scheme).toEqual(["file"])
			expect(locator.authority.user.name).toBeUndefined()
			expect(locator.authority.user.password).toBeUndefined()
			expect(locator.authority.endpoint.host).toEqual([])
			expect(locator.path).toEqual(["folder", "file.extension"])
		}
	})
	it("relative file", () => {
		const locator = Locator.parse("file://./folder/file.extension")
		expect(locator).toBeTruthy()
		if (locator) {
			expect(locator.scheme).toEqual(["file"])
			expect(locator.authority.user.name).toBeUndefined()
			expect(locator.authority.user.password).toBeUndefined()
			expect(locator.authority.endpoint.host).toEqual([])
			expect(locator.path).toEqual([".", "folder", "file.extension"])
		}
	})
	it("explicitly relative path", () => {
		const locator = Locator.parse("./folder/file.extension")
		expect(locator).toBeTruthy()
		if (locator) {
			expect(locator.scheme).toEqual([])
			expect(locator.authority.user.name).toBeUndefined()
			expect(locator.authority.user.password).toBeUndefined()
			expect(locator.authority.endpoint.host).toEqual([])
			expect(locator.path).toEqual([".", "folder", "file.extension"])
		}
	})
	it("implicitly relative path", () => {
		const locator = Locator.parse("folder/file.extension")
		expect(locator).toBeTruthy()
		if (locator) {
			expect(locator.scheme).toEqual([])
			expect(locator.authority.user.name).toBeUndefined()
			expect(locator.authority.user.password).toBeUndefined()
			expect(locator.authority.endpoint.host).toEqual([])
			expect(locator.path).toEqual([".", "folder", "file.extension"])
		}
	})
	it("absolute path", () => {
		const locator = Locator.parse("/folder/file.extension")
		expect(locator).toBeTruthy()
		if (locator) {
			expect(locator.scheme).toEqual([])
			expect(locator.authority.user.name).toBeUndefined()
			expect(locator.authority.user.password).toBeUndefined()
			expect(locator.authority.endpoint.host).toEqual([])
			expect(locator.path).toEqual(["folder", "file.extension"])
		}
	})
	it("explicitly relative folder path", () => {
		const locator = Locator.parse("./folder/folder.next/")
		expect(locator).toBeTruthy()
		if (locator) {
			expect(locator.scheme).toEqual([])
			expect(locator.authority.user.name).toBeUndefined()
			expect(locator.authority.user.password).toBeUndefined()
			expect(locator.authority.endpoint.host).toEqual([])
			expect(locator.path).toEqual([".", "folder", "folder.next", ""])
		}
	})
	it("implicitly relative folder path", () => {
		const locator = Locator.parse("folder/folder.next/")
		expect(locator).toBeTruthy()
		if (locator) {
			expect(locator.scheme).toEqual([])
			expect(locator.authority.user.name).toBeUndefined()
			expect(locator.authority.user.password).toBeUndefined()
			expect(locator.authority.endpoint.host).toEqual([])
			expect(locator.path).toEqual([".", "folder", "folder.next", ""])
		}
	})
	it("absolute folder path", () => {
		const locator = Locator.parse("/folder/folder.next/")
		expect(locator).toBeTruthy()
		if (locator) {
			expect(locator.scheme).toEqual([])
			expect(locator.authority.user.name).toBeUndefined()
			expect(locator.authority.user.password).toBeUndefined()
			expect(locator.authority.endpoint.host).toEqual([])
			expect(locator.path).toEqual(["folder", "folder.next", ""])
		}
	})
	it("full https url", () => {
		const locator = Locator.parse("https://server.example.com/folder/file.extension")
		expect(locator).toBeTruthy()
		if (locator) {
			expect(locator.scheme).toEqual(["https"])
			expect(locator.authority.user.name).toBeUndefined()
			expect(locator.authority.user.password).toBeUndefined()
			expect(locator.authority.endpoint.host).toEqual(["server", "example", "com"])
			expect(locator.authority.endpoint.port).toBeUndefined()
			expect(locator.path).toEqual(["folder", "file.extension"])
		}
	})
	it("schemeless url", () => {
		const locator = Locator.parse("//server.example.com/folder/file.extension")
		expect(locator).toBeTruthy()
		if (locator) {
			expect(locator.scheme).toEqual([])
			expect(locator.authority.user.name).toBeUndefined()
			expect(locator.authority.user.password).toBeUndefined()
			expect(locator.authority.endpoint.host).toEqual(["server", "example", "com"])
			expect(locator.authority.endpoint.port).toBeUndefined()
			expect(locator.path).toEqual(["folder", "file.extension"])
		}
	})
})
