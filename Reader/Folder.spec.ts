import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { mendly } from "../index.node"

const collect = (reader: mendly.Reader | undefined): string => {
	let result = ""
	for (let current = reader?.read(); current != undefined; current = reader?.read())
		if (current != "\0") result += current
	return result
}

describe("mendly.Reader.Folder", () => {
	it.each([
		{ name: "non file scheme", resource: "https://example.com/*.txt" },
		{ name: "plain file without folder or wildcard", resource: "file:///tmp/file.txt" }
	])("open $name", ({ resource }) => expect(mendly.Reader.Folder.open(mendly.Uri.parse(resource)!)).toBeUndefined())
	it("reads recursive wildcard files", () => {
		const folder = mkdtempSync(join(tmpdir(), "mendly-folder-"))
		mkdirSync(join(folder, "nested"))
		writeFileSync(join(folder, "root.txt"), "ROOT")
		writeFileSync(join(folder, "ignore.md"), "IGNORE")
		writeFileSync(join(folder, "nested", "child.txt"), "CHILD")
		const reader = mendly.Reader.Folder.open(mendly.Uri.parse(`file://${folder}/*.txt`)!)
		const content = collect(reader)
		expect(content.includes("ROOT") && content.includes("CHILD") && !content.includes("IGNORE")).toBeTruthy()
		rmSync(folder, { recursive: true, force: true })
	})
	it("state and close", async () => {
		const folder = mkdtempSync(join(tmpdir(), "mendly-folder-"))
		writeFileSync(join(folder, "only.txt"), "A")
		const reader = mendly.Reader.Folder.open(mendly.Uri.parse(`file://${folder}/*.txt`)!) as mendly.Reader.Folder
		expect(
			reader.opened && reader.readable && reader.resource && reader.location && reader.region && reader.mark()
		).toBeTruthy()
		reader.read()
		reader.tabSize = 6
		expect(reader.tabSize).toEqual(6)
		expect(await reader.close()).toBeFalsy()
		rmSync(folder, { recursive: true, force: true })
	})
	it("reader registry", () => {
		const folder = mkdtempSync(join(tmpdir(), "mendly-folder-"))
		writeFileSync(join(folder, "only.txt"), "A")
		expect(mendly.Reader.open(mendly.Uri.parse(`file://${folder}/*.txt`)!)).toBeTruthy()
		rmSync(folder, { recursive: true, force: true })
	})
})
