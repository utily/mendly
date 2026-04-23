import { mendly } from "../index"

const collect = (reader: mendly.Reader | undefined): string => {
	let result = ""
	for (let current = reader?.read(); current != undefined && current != "\0"; current = reader?.read())
		result += current
	return result
}

describe("mendly.Reader.Prefix", () => {
	it.each([
		{ name: "undefined backend", backend: undefined as mendly.Reader | undefined, prefix: "x", wrapped: undefined },
		{ name: "undefined prefix", backend: mendly.Reader.String.create("a"), prefix: undefined, wrapped: "backend" }
	])("create $name", ({ backend, prefix, wrapped }) =>
		expect(mendly.Reader.Prefix.create(backend, prefix as string | undefined)).toBe(wrapped ? backend : undefined))

	it.each([
		{ name: "stops after unmatched newline", input: "\nabc", prefix: "pre", expected: "\n" },
		{ name: "keeps reading across empty line", input: "\n\nabc", prefix: "pre", expected: "\n\n" },
		{ name: "accepts configured prefix", input: "\nprefixZ", prefix: "prefix", expected: "\nZ" }
	])("read $name", ({ input, prefix, expected }) =>
		expect(collect(mendly.Reader.Prefix.create(mendly.Reader.String.create(input), prefix))).toEqual(expected))

	it("tab size delegates", () => {
		const reader = mendly.Reader.Prefix.create(mendly.Reader.String.create("x"), "pre") as mendly.Reader.Prefix
		reader.tabSize = 8
		expect(reader.tabSize).toEqual(8)
	})

	it("state and marks", async () => {
		const reader = mendly.Reader.Prefix.create(mendly.Reader.String.create("abc"), "pre") as mendly.Reader.Prefix
		expect(reader.readable && reader.opened).toBeTruthy()
		expect(reader.resource && reader.location && reader.region && reader.mark()).toBeTruthy()
		expect(await reader.close()).toBeTruthy()
	})

	it.each([
		{ name: "backend empty", input: "", prefix: "pre", before: true, after: true },
		{ name: "done empty", input: "\nabc", prefix: "pre", before: false, after: true }
	])("empty $name", ({ input, prefix, before, after }) => {
		const reader = mendly.Reader.Prefix.create(mendly.Reader.String.create(input), prefix) as mendly.Reader.Prefix
		expect(reader.empty).toEqual(before)
		reader.read()
		reader.read()
		expect(reader.empty).toEqual(after)
	})
})
