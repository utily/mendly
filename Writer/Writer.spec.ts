import { describe, expect, it } from "vitest"
import { mendly } from "../index"

class RecorderWriter extends mendly.Writer.Writer {
	autoFlush = false
	opened = true
	writable = true
	resource = mendly.Uri.empty
	chunks: string[] = []
	async close(): Promise<boolean> {
		return true
	}
	async flush(): Promise<boolean> {
		return true
	}
	protected async writeImplementation(buffer: mendly.Enumerator<string>): Promise<boolean> {
		this.chunks.push(...buffer.toArray())
		return true
	}
}

describe("mendly.Writer.Writer", () => {
	it.each([
		{ name: "string", message: "a", expected: "a" },
		{ name: "array", message: ["a", "b"], expected: "ab" },
		{ name: "enumerator", message: new mendly.Enumerator.Array(["a", "b"]), expected: "ab" }
	])("write $name", async ({ message, expected }) => {
		const writer = new RecorderWriter()
		expect(await writer.write(message as string)).toBeTruthy()
		expect(writer.chunks.join("")).toEqual(expected)
	})

	it.each([
		{ name: "string", message: "x", expected: "x\n" },
		{ name: "array", message: ["x", "y"], expected: "xy\n" },
		{ name: "enumerator", message: new mendly.Enumerator.Array(["x", "y"]), expected: "xy\n" },
		{ name: "empty", message: undefined, expected: "\n" }
	])("writeLine $name", async ({ message, expected }) => {
		const writer = new RecorderWriter()
		expect(await writer.writeLine(message as string)).toBeTruthy()
		expect(writer.chunks.join("")).toEqual(expected)
	})

	it("open rejects invalid string uri", async () => expect(await mendly.Writer.open("://invalid")).toBeUndefined())

	it("open valid string uri miss", async () => expect(await mendly.Writer.open("miss://store")).toBeUndefined())

	it("register and open uri", async () => {
		const first = async (_: mendly.Uri) => undefined as mendly.Writer | undefined
		const second = async (resource: mendly.Uri) =>
			(resource.scheme[0] == "mem" ? new RecorderWriter() : undefined) as mendly.Writer | undefined
		mendly.Writer.register(first, 1)
		mendly.Writer.register(second, 2)
		expect(await mendly.Writer.open(mendly.Uri.parse("mem://store")!)).toBeTruthy()
		expect(await mendly.Writer.open(mendly.Uri.parse("miss://store")!)).toBeUndefined()
	})
})
