import { Locator } from "./Locator"

describe("Uri.Locator.resolve", () => {
	it("resolve relative", () => {
		const absolute = Locator.parse("https://server.example.com/folder0/folder1/")
		const relative = Locator.parse("./folder2/file.extension")
		expect(relative).toBeTruthy()
		if (relative) {
			const locator = relative.resolve(absolute)
			expect(locator.scheme).toEqual(["https"])
			expect(locator.authority.user.isEmpty)
			expect(locator.authority.endpoint.host).toEqual(["server", "example", "com"])
			expect(locator.authority.endpoint.port).toBeUndefined()
			expect(locator.path).toEqual(["folder0", "folder1", "folder2", "file.extension"])
		}
	})
})
