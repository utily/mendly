import { describe, expect, it } from "vitest"
import { mendly } from "../index"

describe("mendly.Uri.resolve", () => {
	it("resolve relative", () => {
		const absolute = mendly.Uri.parse("https://server.example.com/folder0/folder1/")
		const relative = mendly.Uri.parse("./folder2/file.extension")
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
})
