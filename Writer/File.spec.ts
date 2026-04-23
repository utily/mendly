import * as fs from "fs"
import { mendly } from "../index.node"

describe("mendly.Writer.File", () => {
	it("open rejects non-file scheme", async () =>
		expect(await mendly.Writer.File.open(mendly.Uri.parse("https://example.com/file.txt")!)).toBeUndefined())

	it("open rejects undefined resource", async () =>
		expect(await mendly.Writer.File.open(undefined as unknown as mendly.Uri)).toBeUndefined())

	it("nothing", async () => {
		const resource = mendly.Uri.parse("file:///./fileWriter-nothing.txt")!
		const writer = await mendly.Writer.open(resource)
		expect(await writer).toBeTruthy()
		expect(await writer!.opened).toBeTruthy()
		expect(await writer!.writable).toBeTruthy()
		expect(await writer!.close()).toBeTruthy()
		expect(await writer!.writable).toBeFalsy()
		const path = resource.path.join("/")
		expect(fs.readFileSync(path).join()).toEqual("")
		fs.unlinkSync(path)
	})

	it("open fails for directory path", async () => {
		const folder = "./fileWriter-as-folder"
		fs.mkdirSync(folder, { recursive: true })
		expect(await mendly.Writer.File.open(mendly.Uri.parse(`file:///${folder}`)!)).toBeUndefined()
		fs.rmSync(folder, { recursive: true, force: true })
	})
	it("simple", async () => {
		const resource = mendly.Uri.parse("file:///./fileWriter-simple.txt")!
		const writer = await mendly.Writer.open(resource)
		expect(await writer).toBeTruthy()
		expect(await writer!.opened).toBeTruthy()
		expect(await writer!.writeLine("The meaning of 42?")).toBeTruthy()
		expect(await writer!.close()).toBeTruthy()
		const path = resource.path.join("/")
		expect(fs.readFileSync(path).toString("utf8")).toEqual("The meaning of 42?\n")
		fs.unlinkSync(path)
	})
	it("multiline", async () => {
		const resource = mendly.Uri.parse("file:///./fileWriter-multiline.txt")!
		const writer = await mendly.Writer.open(resource)
		expect(await writer).toBeTruthy()
		expect(await writer!.opened).toBeTruthy()
		expect(
			(await writer!.writeLine("The meaning of 42?")) && (await writer!.writeLine("The meaning of 43?"))
		).toBeTruthy()
		expect(await writer!.close()).toBeTruthy()
		const path = resource.path.join("/")
		expect(fs.readFileSync(path).toString("utf8")).toEqual("The meaning of 42?\nThe meaning of 43?\n")
		fs.unlinkSync(path)
	})

	it("closed writer flush and write fail", async () => {
		const resource = mendly.Uri.parse("file:///./fileWriter-closed.txt")!
		const writer = await mendly.Writer.open(resource)
		expect(await writer?.close()).toBeTruthy()
		expect(await writer?.flush()).toBeFalsy()
		expect(await writer?.writeLine("x")).toBeFalsy()
		fs.unlinkSync(resource.path.join("/"))
	})

	it("autoflush path", async () => {
		const resource = mendly.Uri.parse("file:///./fileWriter-autoflush.txt")!
		const writer = (await mendly.Writer.open(resource)) as mendly.Writer.File
		writer.autoFlush = true
		expect(await writer.writeLine("auto")).toBeTruthy()
		expect(await writer.close()).toBeTruthy()
		expect(fs.readFileSync(resource.path.join("/")).toString("utf8")).toEqual("auto\n")
		fs.unlinkSync(resource.path.join("/"))
	})
	it("flush error on invalid descriptor", async () => {
		const resource = mendly.Uri.parse("file:///./fileWriter-flush-err.txt")!
		const fd = fs.openSync(resource.path.join("/"), "w")
		fs.closeSync(fd)
		const writer = new mendly.Writer.File(resource, fd)
		expect(await writer.flush()).toBe(false)
		expect(writer.error).toBeDefined()
		fs.unlinkSync(resource.path.join("/"))
	})
	it("write error on invalid descriptor", async () => {
		const resource = mendly.Uri.parse("file:///./fileWriter-write-err.txt")!
		const fd = fs.openSync(resource.path.join("/"), "w")
		fs.closeSync(fd)
		const writer = new mendly.Writer.File(resource, fd)
		expect(await writer.writeLine("x")).toBe(false)
		expect(writer.error).toBeDefined()
		fs.unlinkSync(resource.path.join("/"))
	})
	it("close error on invalid descriptor", async () => {
		const resource = mendly.Uri.parse("file:///./fileWriter-close-err.txt")!
		const fd = fs.openSync(resource.path.join("/"), "w")
		fs.closeSync(fd)
		const writer = new mendly.Writer.File(resource, fd)
		expect(await writer.close()).toBe(false)
		expect(writer.error).toBeDefined()
		fs.unlinkSync(resource.path.join("/"))
	})
})
