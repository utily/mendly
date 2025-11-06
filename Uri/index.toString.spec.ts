import { describe, expect, it } from "vitest"
import { mendly } from "../index"

describe("mendly.Uri.toString", () => {
	it("full https", () => {
		const absolute = mendly.Uri.parse("https://server.example.com/folder0/folder1/")
		expect(absolute).toBeTruthy()
		if (absolute)
			expect(absolute.toString()).toEqual("https://server.example.com/folder0/folder1/")
	})
	it("full file", () => {
		const absolute = mendly.Uri.parse("file:///folder0/folder1/")
		expect(absolute).toBeTruthy()
		if (absolute)
			expect(absolute.toString()).toEqual("file:///folder0/folder1/")
	})
	it("absolute file", () => {
		const relative = mendly.Uri.parse("/folder2/file.extension")
		expect(relative).toBeTruthy()
		if (relative)
			expect(relative.toString()).toEqual("/folder2/file.extension")
	})
	it("relative", () => {
		const relative = mendly.Uri.parse("./folder2/file.extension")
		expect(relative).toBeTruthy()
		if (relative)
			expect(relative.toString()).toEqual("./folder2/file.extension")
	})
})
