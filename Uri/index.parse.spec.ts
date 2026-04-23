import { describe, expect, it } from "vitest"
import { mendly } from "../index"

describe("mendly.Uri.parse", () => {
	it.each([
		{ name: "undefined", input: undefined },
		{ name: "empty", input: "" }
	])("$name", ({ input }) => expect(mendly.Uri.parse(input)).toBeUndefined())

	it.each([
		{
			name: "absolute file",
			input: "file:///folder/file.extension",
			expected: {
				scheme: ["file"],
				authority: { user: { name: undefined, password: undefined }, endpoint: { host: [] } },
				path: ["folder", "file.extension"]
			}
		},
		{
			name: "relative file",
			input: "file://./folder/file.extension",
			expected: {
				scheme: ["file"],
				authority: { user: { name: undefined, password: undefined }, endpoint: { host: [] } },
				path: [".", "folder", "file.extension"]
			}
		},
		{
			name: "explicitly relative path",
			input: "./folder/file.extension",
			expected: {
				scheme: [],
				authority: { user: { name: undefined, password: undefined }, endpoint: { host: [] } },
				path: [".", "folder", "file.extension"]
			}
		},
		{
			name: "implicitly relative path",
			input: "folder/file.extension",
			expected: {
				scheme: [],
				authority: { user: { name: undefined, password: undefined }, endpoint: { host: [] } },
				path: [".", "folder", "file.extension"]
			}
		},
		{
			name: "absolute path",
			input: "/folder/file.extension",
			expected: {
				scheme: [],
				authority: { user: { name: undefined, password: undefined }, endpoint: { host: [] } },
				path: ["folder", "file.extension"]
			}
		},
		{
			name: "explicitly relative folder path",
			input: "./folder/folder.next/",
			expected: {
				scheme: [],
				authority: { user: { name: undefined, password: undefined }, endpoint: { host: [] } },
				path: [".", "folder", "folder.next", ""]
			}
		},
		{
			name: "implicitly relative folder path",
			input: "folder/folder.next/",
			expected: {
				scheme: [],
				authority: { user: { name: undefined, password: undefined }, endpoint: { host: [] } },
				path: [".", "folder", "folder.next", ""]
			}
		},
		{
			name: "absolute folder path",
			input: "/folder/folder.next/",
			expected: {
				scheme: [],
				authority: { user: { name: undefined, password: undefined }, endpoint: { host: [] } },
				path: ["folder", "folder.next", ""]
			}
		},
		{
			name: "full https url",
			input: "https://server.example.com/folder/file.extension",
			expected: {
				scheme: ["https"],
				authority: {
					user: { name: undefined, password: undefined },
					endpoint: { host: ["server", "example", "com"], port: undefined }
				},
				path: ["folder", "file.extension"]
			}
		},
		{
			name: "url with empty port keeps undefined port",
			input: "https://server.example.com:/folder/file.extension",
			expected: { authority: { endpoint: { host: ["server", "example", "com"], port: undefined } } }
		},
		{
			name: "schemaless url",
			input: "//server.example.com/folder/file.extension",
			expected: {
				scheme: [],
				authority: {
					user: { name: undefined, password: undefined },
					endpoint: { host: ["server", "example", "com"], port: undefined }
				},
				path: ["folder", "file.extension"]
			}
		}
	])("$name", ({ input, expected }) => expect(mendly.Uri.parse(input)).toMatchObject(expected))

	it.each([
		{
			name: "query with ampersand separator",
			input: "./folder/file.extension?alpha=1&beta=2",
			expected: { query: { alpha: "1", beta: "2" } }
		},
		{
			name: "query with semicolon separator",
			input: "./folder/file.extension?alpha=1;beta=2",
			expected: { query: { alpha: "1", beta: "2" } }
		},
		{ name: "query keeps empty value", input: "./folder/file.extension?empty=", expected: { query: { empty: "" } } },
		{
			name: "query and fragment decode",
			input: "./folder/file.extension?name=hello%20world#part",
			expected: { query: { name: "hello world" }, fragment: "part" }
		}
	])("$name", ({ input, expected }) => expect(mendly.Uri.parse(input)).toMatchObject(expected))
})
