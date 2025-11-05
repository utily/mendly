import { Indenter } from "./Indenter"
import { StringWriter } from "./StringWriter"

describe("IO.Indenter", () => {
	it("nothing", async () => {
		const result = StringWriter.create() as StringWriter
		const writer = new Indenter(result)
		expect(await writer).toBeTruthy()
		expect(await writer.opened).toBeTruthy()
		expect(await writer.close()).toBeTruthy()
		expect(result.result).toEqual("")
	})
	it("simple", async () => {
		const result = StringWriter.create() as StringWriter
		const writer = new Indenter(result)
		expect(await writer).toBeTruthy()
		expect(await writer.opened).toBeTruthy()
		expect(await writer.writeLine("The power of Attraction."))
		expect(await writer.close()).toBeTruthy()
		expect(result.result).toEqual("The power of Attraction.\n")
	})
	it("indentation", async () => {
		const result = StringWriter.create() as StringWriter
		const writer = new Indenter(result)
		expect(await writer).toBeTruthy()
		expect(await writer.opened).toBeTruthy()
		expect(await writer.writeLine("function foo(bar) {"))
		expect(writer.increase())
		expect(await writer.writeLine("return bar"))
		expect(writer.decrease())
		expect(await writer.writeLine("}"))
		expect(await writer.close()).toBeTruthy()
		expect(result.result).toEqual("function foo(bar) {\n\treturn bar\n}\n")
	})
	it("complex", async () => {
		const result = StringWriter.create() as StringWriter
		const writer = new Indenter(result)
		expect(await writer).toBeTruthy()
		expect(await writer.opened).toBeTruthy()
		expect(await writer.writeLine("function foo(bar) {"))
		expect(writer.increase())
		expect(await writer.writeLine("if (!bar)"))
		expect(writer.increase())
		expect(await writer.writeLine('bar = ""'))
		expect(writer.decrease())
		expect(await writer.writeLine("return bar"))
		expect(writer.decrease())
		expect(await writer.writeLine("}"))
		expect(await writer.close()).toBeTruthy()
		expect(result.result).toEqual('function foo(bar) {\n\tif (!bar)\n\t\tbar = ""\n\treturn bar\n}\n')
	})
})
