import { describe, expect, it } from "vitest"
import { mendly } from "../index.js"

describe("mendly.Uri.parent", () => {
	it.each([
		{ name: "file path", input: "./folder/file.extension" },
		{ name: "no path", input: "file://" },
		{ name: "top level file", input: "./file.extension" },
		{ name: "folder path", input: "./folder/sub/" },
		{ name: "single segment path", input: "./folder" },
		{ name: "rootless absolute file", input: "/folder/file.extension" },
		{
			name: "keeps scheme authority query fragment",
			input: "https://server.example.com/folder/file.extension?alpha=1#frag"
		}
	])("$name", ({ input }) => expect(mendly.Uri.parse(input)!.parent).toMatchSnapshot())
})
