import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { pathToFileURL } from "node:url"
import { describe, expect, it, vi } from "vitest"

type NodeMendly = typeof import("./index.node")["mendly"]
type OpenersRegistry = { openers: unknown[] }
type Openers = [OpenersRegistry, OpenersRegistry]

async function withNodeEntry<T>(run: (mendly: NodeMendly, openers: Openers) => Promise<T>): Promise<T>
async function withNodeEntry<T>(run: (mendly: NodeMendly, openers: Openers) => T): Promise<T>
async function withNodeEntry<T>(run: (mendly: NodeMendly, openers: Openers) => Promise<T> | T): Promise<T> {
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
		const module = await import("./index.node")
		return await run(module.mendly, [reader, writer])
	} finally {
		reader.openers = previousReaderOpeners
		writer.openers = previousWriterOpeners
	}
}

describe("mendly node entry", () => {
	it("registers filesystem-backed reader and writer openers", async () => {
		const temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), "mendly-node-spec-"))
		const sourceFile = path.join(temporaryDirectory, "source.txt")
		const folder = path.join(temporaryDirectory, "folder")
		const alphaFile = path.join(folder, "alpha.txt")
		const betaFile = path.join(folder, "beta.txt")
		await mkdir(folder, { recursive: true })
		await writeFile(sourceFile, "portable\n", "utf8")
		await writeFile(alphaFile, "alpha\n", "utf8")
		await writeFile(betaFile, "beta\n", "utf8")

		try {
			await withNodeEntry(async (mendly, [reader, writer]) => {
				expect(reader.openers).toHaveLength(2)
				expect(writer.openers).toHaveLength(1)

				const fileResource = mendly.Uri.parse(pathToFileURL(sourceFile).toString())
				expect(fileResource).toBeTruthy()
				if (!fileResource)
					throw new Error("expected a file resource")

				const fileReader = mendly.Reader.open(fileResource)
				expect(fileReader).toBeTruthy()
				expect(fileReader?.read()).toEqual("p")
				await fileReader?.close()

				const fileWriter = await mendly.Writer.open(fileResource)
				expect(fileWriter).toBeTruthy()
				expect(await fileWriter?.writeLine("node-entry")).toEqual(true)
				expect(await fileWriter?.close()).toEqual(true)

				const folderResource = mendly.Uri.parse(pathToFileURL(`${folder}${path.sep}`).toString())
				expect(folderResource).toBeTruthy()
				if (!folderResource)
					throw new Error("expected a folder resource")

				const folderReader = mendly.Reader.open(folderResource)
				expect(folderReader).toBeTruthy()
				const content = []
				for (let index = 0; index < 64; index++) {
					const character = folderReader?.read()
					if (character != undefined && character != "\0")
						content.push(character)
					if (content.join("").includes("alpha") && content.join("").includes("beta"))
						break
				}
				expect(content.join("")).toContain("alpha")
				expect(content.join("")).toContain("beta")
				await folderReader?.close()
			})
		} finally {
			await rm(temporaryDirectory, { force: true, recursive: true })
		}
	})
})
