import { describe, expect, it } from "vitest"
import { mendly } from "../index.js"

describe("mendly.Uri segment decomposition", () => {
	it.each([
		{
			name: "single segment",
			input: "file",
			expected: { filename: "file", stem: "file", extension: "", suffix: "", base: "" }
		},
		{
			name: "two segments",
			input: "file.tup",
			expected: { filename: "file.tup", stem: "file", extension: "tup", suffix: "tup", base: "file" }
		},
		{
			name: "multiple segments",
			input: "file.site.tup",
			expected: { filename: "file.site.tup", stem: "file", extension: "tup", suffix: "site.tup", base: "file.site" }
		},
		{
			name: "leading dot",
			input: ".env.local",
			expected: { filename: ".env.local", stem: "", extension: "local", suffix: "env.local", base: ".env" }
		},
		{
			name: "trailing dot",
			input: "file.",
			expected: { filename: "file.", stem: "file", extension: "", suffix: "", base: "file" }
		}
	])("$name", ({ input, expected }) => {
		const uri = mendly.Uri.parse(`./${input}`)!
		expect(uri.filename).toEqual(expected.filename)
		expect(uri.stem).toEqual(expected.stem)
		expect(uri.extension).toEqual(expected.extension)
		expect(uri.suffix).toEqual(expected.suffix)
		expect(uri.base).toEqual(expected.base)
	})
})

describe("mendly.Uri segment getters", () => {
	it("exposes filename decomposition from final path segment", () => {
		const uri = mendly.Uri.parse("./folder/file.site.tup")!
		expect(uri.filename).toEqual("file.site.tup")
		expect(uri.stem).toEqual("file")
		expect(uri.extension).toEqual("tup")
		expect(uri.suffix).toEqual("site.tup")
		expect(uri.base).toEqual("file.site")
	})

	it("returns empty derived fields when filename has no dot", () => {
		const uri = mendly.Uri.parse("./folder/file")!
		expect(uri.filename).toEqual("file")
		expect(uri.stem).toEqual("file")
		expect(uri.extension).toEqual("")
		expect(uri.suffix).toEqual("")
		expect(uri.base).toEqual("")
	})
})
