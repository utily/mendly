import { describe, expect, it } from "vitest"
import { Reader as BaseReader } from "./Reader/Reader"
import { Writer as BaseWriter } from "./Writer/Writer"

type BrowserMendly = typeof import("./index.browser")["mendly"]
type OpenersRegistry = { openers: unknown[] }

async function withBrowserEntry<T>(run: (mendly: BrowserMendly) => Promise<T>): Promise<T>
async function withBrowserEntry<T>(run: (mendly: BrowserMendly) => T): Promise<T>
async function withBrowserEntry<T>(run: (mendly: BrowserMendly) => Promise<T> | T): Promise<T> {
	const reader = BaseReader as unknown as OpenersRegistry
	const writer = BaseWriter as unknown as OpenersRegistry
	const previousReaderOpeners = [...reader.openers]
	const previousWriterOpeners = [...writer.openers]
	reader.openers = []
	writer.openers = []
	try {
		const module = await import("./index.browser")
		return await run(module.mendly)
	} finally {
		reader.openers = previousReaderOpeners
		writer.openers = previousWriterOpeners
	}
}

describe("mendly browser entry", () => {
	it("keeps in-memory reader and writer functionality available", async () => {
		await withBrowserEntry(async mendly => {
			const reader = mendly.Reader.String.create("abc")
			const writer = mendly.Writer.String.create()

			expect(reader.read()).toEqual("a")
			expect(reader.read()).toEqual("b")
			expect(reader.read()).toEqual("c")
			expect(await writer.writeLine("abc")).toEqual(true)
			expect(writer.result).toEqual("abc\n")
		})
	})

	it("does not register file-backed openers", async () => {
		await withBrowserEntry(async mendly => {
			const reader = BaseReader as unknown as OpenersRegistry
			const writer = BaseWriter as unknown as OpenersRegistry
			const fileResource = mendly.Uri.parse("file:///tmp/example.txt")

			expect(fileResource).toBeTruthy()
			if (!fileResource)
				throw new Error("expected a file resource")

			expect(reader.openers).toEqual([])
			expect(writer.openers).toEqual([])
			expect(mendly.Reader.open(fileResource)).toBeUndefined()
			expect(await mendly.Writer.open(fileResource)).toBeUndefined()
		})
	})
})
