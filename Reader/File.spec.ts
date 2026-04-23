import * as fs from "node:fs"
import { describe, expect, it } from "vitest"
import { mendly } from "../index.node"

describe("mendly.Reader.File", () => {
	it("open undefined", () => expect(mendly.Reader.File.open(undefined)).toBeUndefined())

	it("open rejects non-file scheme", () =>
		expect(mendly.Reader.File.open(mendly.Uri.parse("https://example.com/a.txt")!)).toBeUndefined())

	it("open rejects missing path", () =>
		expect(mendly.Reader.File.open(mendly.Uri.parse("file:///./missing-reader-file.txt")!)).toBeUndefined())

	it("read and state", async () => {
		const path = "./reader-file-basic.txt"
		fs.writeFileSync(path, "abc")
		const reader = mendly.Reader.File.open(mendly.Uri.parse(path)!)!
		expect(typeof reader.opened).toEqual("boolean")
		expect(typeof reader.readable).toEqual("boolean")
		expect(typeof reader.empty).toEqual("boolean")
		expect(reader.resource && reader.location && reader.region && reader.mark()).toBeTruthy()
		reader.tabSize = 4
		expect(reader.tabSize).toEqual(4)
		expect(reader.read()).toEqual("a")
		expect(reader.read()).toEqual("b")
		expect(reader.read()).toEqual("c")
		expect(reader.read()).toEqual("\0")
		expect(reader.read()).toBeUndefined()
		expect(await reader.close()).toBeFalsy()
		fs.unlinkSync(path)
	})

	it("reader registry open", () => {
		const path = "./reader-file-registry.txt"
		fs.writeFileSync(path, "abc")
		expect(mendly.Reader.open(mendly.Uri.parse(path)!)).toBeTruthy()
		fs.unlinkSync(path)
	})
})
