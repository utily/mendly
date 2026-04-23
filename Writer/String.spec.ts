import { describe, expect, it } from "vitest"
import { mendly } from "../index"

describe("mendly.Writer.String", () => {
	it("empty", async () => {
		const writer = mendly.Writer.String.create()
		expect(writer.opened)
		expect(writer.result).toEqual("")
	})
	it("short", async () => {
		const writer = mendly.Writer.String.create()
		expect(writer.writeLine("1337"))
		expect(writer.writeLine("42"))
		expect(writer.result).toEqual("1337\n42\n")
	})
	it("flush and close", async () => {
		const writer = mendly.Writer.String.create()
		expect(await writer.flush()).toBe(true)
		expect(await writer.close()).toBe(true)
	})
})
