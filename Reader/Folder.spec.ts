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
	it("open missing folder returns undefined", () =>
		expect(
			mendly.Reader.Folder.open(mendly.Uri.parse("file:///definitely-not-existing-mendly/*.txt")!)
		).toBeUndefined())
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
	it("reads relative wildcard files", () => {
		const folder = mkdtempSync(join(".", "mendly-folder-relative-"))
		writeFileSync(join(folder, "root.txt"), "ROOT")
		const reader = mendly.Reader.Folder.open(mendly.Uri.parse(`./${folder}/*.txt`)!)
		expect(collect(reader)).toContain("ROOT")
		rmSync(folder, { recursive: true, force: true })
	})
	it("open wildcard with no matches creates empty folder reader", () => {
		const folder = mkdtempSync(join(tmpdir(), "mendly-folder-empty-"))
		writeFileSync(join(folder, "only.md"), "A")
		const reader = mendly.Reader.Folder.open(mendly.Uri.parse(`file://${folder}/*.txt`)!) as mendly.Reader.Folder
		expect(reader).toBeTruthy()
		expect(reader.empty).toBeTruthy()
		expect(reader.readable).toBeFalsy()
		expect(reader.opened).toBeFalsy()
		rmSync(folder, { recursive: true, force: true })
	})
	it("state and close", async () => {
		const folder = mkdtempSync(join(tmpdir(), "mendly-folder-"))
		writeFileSync(join(folder, "only.txt"), "AB")
		const reader = mendly.Reader.Folder.open(mendly.Uri.parse(`file://${folder}/*.txt`)!) as mendly.Reader.Folder
		expect(
			reader.opened && reader.readable && reader.resource && reader.location && reader.region && reader.mark()
		).toBeTruthy()
		expect(reader.empty).toBeFalsy()
		reader.read()
		expect(reader.mark()).toBeTruthy()
		expect(reader.resource.toString()).toContain("only.txt")
		expect(reader.empty).toBeFalsy()
		reader.tabSize = 6
		expect(reader.tabSize).toEqual(6)
		while (reader.read() != undefined);
		expect(reader.empty).toBeTruthy()
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
