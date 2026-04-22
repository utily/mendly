import { describe, expect, it } from "vitest"
import { mendly } from "../index"

describe("mendly.Uri.toString", () => {
	it("full https", () => {
		const absolute = mendly.Uri.parse("https://server.example.com/folder0/folder1/")
		expect(absolute).toBeTruthy()
		if (absolute) expect(absolute.toString()).toEqual("https://server.example.com/folder0/folder1/")
	})
	it("full file", () => {
		const absolute = mendly.Uri.parse("file:///folder0/folder1/")
		expect(absolute).toBeTruthy()
		if (absolute) expect(absolute.toString()).toEqual("file:///folder0/folder1/")
	})
	it("absolute file", () => {
		const relative = mendly.Uri.parse("/folder2/file.extension")
		expect(relative).toBeTruthy()
		if (relative) expect(relative.toString()).toEqual("/folder2/file.extension")
	})
	it("relative", () => {
		const relative = mendly.Uri.parse("./folder2/file.extension")
		expect(relative).toBeTruthy()
		if (relative) expect(relative.toString()).toEqual("./folder2/file.extension")
	})
	it("query canonical output and round trip", () => {
		const relative = mendly.Uri.parse("./folder2/file.extension?alpha=1;beta=two%20words#frag")
		expect(relative).toBeTruthy()
		if (relative) {
			expect(relative.toString()).toEqual("./folder2/file.extension?alpha=1&beta=two%20words#frag")
			const reparsed = mendly.Uri.parse(relative.toString())
			expect(reparsed).toBeTruthy()
			if (reparsed) {
				expect(reparsed.query).toEqual({ alpha: "1", beta: "two words" })
				expect(reparsed.fragment).toEqual("frag")
			}
		}
	})
	it("query encodes special characters", () => {
		const uri = new mendly.Uri([], undefined, [".", "folder2", "file.extension"], { "a b": "x/y" })
		expect(uri.toString()).toEqual("./folder2/file.extension?a%20b=x%2Fy")
	})
})
