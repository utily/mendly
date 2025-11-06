import { describe, expect, it } from "vitest"
import { mendly } from "../index"

describe("mendly.Writer.String", () => {
	it("empty", async () => {
		const writer = mendly.Writer.String.create() as mendly.Writer.String
		expect(writer.opened)
		expect(writer.result).toEqual("")
	})
	it("short", async () => {
		const writer = mendly.Writer.String.create() as mendly.Writer.String
		expect(writer.writeLine("1337"))
		expect(writer.writeLine("42"))
		expect(writer.result).toEqual("1337\n42\n")
	})
})
