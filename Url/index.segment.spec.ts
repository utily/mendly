import { describe, expect, it } from "vitest"
import { mendly } from "../index.js"

describe("mendly.Url segment decomposition", () => {
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
		const Url = mendly.Url.parse(`./${input}`)!
		expect(Url.filename).toEqual(expected.filename)
		expect(Url.stem).toEqual(expected.stem)
		expect(Url.extension).toEqual(expected.extension)
		expect(Url.suffix).toEqual(expected.suffix)
		expect(Url.base).toEqual(expected.base)
	})
})

describe("mendly.Url segment getters", () => {
	it("exposes filename decomposition from final path segment", () => {
		const Url = mendly.Url.parse("./folder/file.site.tup")!
		expect(Url.filename).toEqual("file.site.tup")
		expect(Url.stem).toEqual("file")
		expect(Url.extension).toEqual("tup")
		expect(Url.suffix).toEqual("site.tup")
		expect(Url.base).toEqual("file.site")
	})

	it("returns empty derived fields when filename has no dot", () => {
		const Url = mendly.Url.parse("./folder/file")!
		expect(Url.filename).toEqual("file")
		expect(Url.stem).toEqual("file")
		expect(Url.extension).toEqual("")
		expect(Url.suffix).toEqual("")
		expect(Url.base).toEqual("")
	})
})
