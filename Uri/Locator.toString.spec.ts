import { describe, expect, it } from "vitest"
import { Locator } from "./Locator"

describe("Uri.Locator.toString", () => {
	it("full https", () => {
		const absolute = Locator.parse("https://server.example.com/folder0/folder1/")
		expect(absolute).toBeTruthy()
		if (absolute) expect(absolute.toString()).toEqual("https://server.example.com/folder0/folder1/")
	})
	it("full file", () => {
		const absolute = Locator.parse("file:///folder0/folder1/")
		expect(absolute).toBeTruthy()
		if (absolute) expect(absolute.toString()).toEqual("file:///folder0/folder1/")
	})
	it("absolute file", () => {
		const relative = Locator.parse("/folder2/file.extension")
		expect(relative).toBeTruthy()
		if (relative) expect(relative.toString()).toEqual("/folder2/file.extension")
	})
	it("relative", () => {
		const relative = Locator.parse("./folder2/file.extension")
		expect(relative).toBeTruthy()
		if (relative) expect(relative.toString()).toEqual("./folder2/file.extension")
	})
})
