import { describe, expect, it } from "vitest"
import { StringWriter } from "./StringWriter"

describe("IO.StringWriter", () => {
	it("empty", async () => {
		const writer = StringWriter.create() as StringWriter
		expect(writer.opened)
		expect(writer.result).toEqual("")
	})
	it("short", async () => {
		const writer = StringWriter.create() as StringWriter
		expect(writer.writeLine("1337"))
		expect(writer.writeLine("42"))
		expect(writer.result).toEqual("1337\n42\n")
	})
})
