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
