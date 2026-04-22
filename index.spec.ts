import { describe, expect, it, vi } from "vitest"

type RootMendly = typeof import("./index")["mendly"]
type OpenersRegistry = { openers: unknown[] }
type Openers = [OpenersRegistry, OpenersRegistry]

async function withRootEntry<T>(run: (mendly: RootMendly, openers: Openers) => Promise<T>): Promise<T>
async function withRootEntry<T>(run: (mendly: RootMendly, openers: Openers) => T): Promise<T>
async function withRootEntry<T>(run: (mendly: RootMendly, openers: Openers) => Promise<T> | T): Promise<T> {
	vi.resetModules()
	const { Reader: BaseReader } = await import("./Reader/Reader")
	const { Writer: BaseWriter } = await import("./Writer/Writer")
	const reader = BaseReader as unknown as OpenersRegistry
	const writer = BaseWriter as unknown as OpenersRegistry
	const previousReaderOpeners = [...reader.openers]
	const previousWriterOpeners = [...writer.openers]
	reader.openers = []
	writer.openers = []
	try {
		const module = await import("./index")
		return await run(module.mendly, [reader, writer])
	} finally {
		reader.openers = previousReaderOpeners
		writer.openers = previousWriterOpeners
	}
}

describe("mendly portable root", () => {
	it("keeps in-memory reader and writer functionality available", async () => {
		await withRootEntry(async mendly => {
			const reader = mendly.Reader.String.create("abc")
			const writer = mendly.Writer.String.create()

			expect(reader.read()).toEqual("a")
			expect(reader.read()).toEqual("b")
			expect(reader.read()).toEqual("c")
			expect(await writer.writeLine("abc")).toEqual(true)
			expect(writer.result).toEqual("abc\n")
		})
	})

	it("does not register filesystem-backed openers", async () => {
		await withRootEntry(async (mendly, [reader, writer]) => {
			const fileResource = mendly.Uri.parse("file:///tmp/example.txt")

			expect(fileResource).toBeTruthy()
			if (!fileResource) throw new Error("expected a file resource")

			expect(reader.openers).toEqual([])
			expect(writer.openers).toEqual([])
			expect(mendly.Reader.open(fileResource)).toBeUndefined()
			expect(await mendly.Writer.open(fileResource)).toBeUndefined()
		})
	})
})
