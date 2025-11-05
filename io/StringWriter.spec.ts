import { describe, expect, it } from "vitest"
import { mendly } from "../index"

describe("IO.StringWriter", () => {
	it("empty", async () => {
		const writer = mendly.io.StringWriter.create() as mendly.io.StringWriter
		expect(writer.opened)
		expect(writer.result).toEqual("")
	})
	it("short", async () => {
		const writer = mendly.io.StringWriter.create() as mendly.io.StringWriter
		expect(writer.writeLine("1337"))
		expect(writer.writeLine("42"))
		expect(writer.result).toEqual("1337\n42\n")
	})
})
