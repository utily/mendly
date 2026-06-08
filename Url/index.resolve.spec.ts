import { describe, expect, it } from "vitest"
import { mendly } from "../index.js"

describe("mendly.Url.resolve", () => {
	it("resolve relative", () => {
		const absolute = mendly.Url.parse("https://server.example.com/folder0/folder1/")
		const relative = mendly.Url.parse("./folder2/file.extension")
		expect(relative).toBeTruthy()
		if (relative) {
			const locator = relative.resolve(absolute)
			expect(locator.scheme).toEqual(["https"])
			expect(locator.authority.user.empty)
			expect(locator.authority.endpoint.host).toEqual(["server", "example", "com"])
			expect(locator.authority.endpoint.port).toBeUndefined()
			expect(locator.path).toEqual(["folder0", "folder1", "folder2", "file.extension"])
		}
	})
	it("resolve with undefined absolute returns same instance", () => {
		const locator = mendly.Url.parse("./folder/file.extension")!
		expect(locator.resolve()).toBe(locator)
	})
	it("resolve keeps explicit scheme and authority", () => {
		const resolved = mendly.Url.parse("http://other.example.net/override/path")!.resolve(
			mendly.Url.parse("https://server.example.com/base/")!
		)
		expect(resolved.scheme).toEqual(["http"])
		expect(resolved.authority.endpoint.host).toEqual(["other", "example", "net"])
		expect(resolved.path).toEqual(["override", "path"])
	})
})
