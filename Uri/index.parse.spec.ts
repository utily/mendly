import { describe, expect, it } from "vitest"
import { mendly } from "../index"

describe("mendly.Uri.parse", () => {
	it("undefined", () => {
		expect(mendly.Uri.parse(undefined)).toBeUndefined()
	})
	it("empty", () => {
		expect(mendly.Uri.parse("")).toBeUndefined()
	})
	it("absolute file", () => {
		const locator = mendly.Uri.parse("file:///folder/file.extension")
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
		const locator = mendly.Uri.parse("file://./folder/file.extension")
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
		const locator = mendly.Uri.parse("./folder/file.extension")
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
		const locator = mendly.Uri.parse("folder/file.extension")
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
		const locator = mendly.Uri.parse("/folder/file.extension")
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
		const locator = mendly.Uri.parse("./folder/folder.next/")
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
		const locator = mendly.Uri.parse("folder/folder.next/")
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
		const locator = mendly.Uri.parse("/folder/folder.next/")
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
		const locator = mendly.Uri.parse("https://server.example.com/folder/file.extension")
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
	it("schemaless url", () => {
		const locator = mendly.Uri.parse("//server.example.com/folder/file.extension")
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
	it("query with ampersand separator", () => {
		const locator = mendly.Uri.parse("./folder/file.extension?alpha=1&beta=2")
		expect(locator).toBeTruthy()
		if (locator) expect(locator.query).toEqual({ alpha: "1", beta: "2" })
	})
	it("query with semicolon separator", () => {
		const locator = mendly.Uri.parse("./folder/file.extension?alpha=1;beta=2")
		expect(locator).toBeTruthy()
		if (locator) expect(locator.query).toEqual({ alpha: "1", beta: "2" })
	})
	it("query keeps empty value", () => {
		const locator = mendly.Uri.parse("./folder/file.extension?empty=")
		expect(locator).toBeTruthy()
		if (locator) expect(locator.query).toEqual({ empty: "" })
	})
	it("query and fragment decode", () => {
		const locator = mendly.Uri.parse("./folder/file.extension?name=hello%20world#part")
		expect(locator).toBeTruthy()
		if (locator) {
			expect(locator.query).toEqual({ name: "hello world" })
			expect(locator.fragment).toEqual("part")
		}
	})
})
