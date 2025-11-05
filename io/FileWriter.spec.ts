import "./FileWriter"
import * as fs from "fs"
import { uri } from "../uri"
import { Writer } from "./Writer"

describe("IO.FileWriter", () => {
	it("nothing", async () => {
		const resource = uri.Locator.parse("file:///./fileWriter-nothing.txt")!
		const writer = await Writer.open(resource)
		expect(await writer).toBeTruthy()
		expect(await writer!.opened).toBeTruthy()
		expect(await writer!.close()).toBeTruthy()
		const path = resource.path.join("/")
		expect(fs.readFileSync(path).join()).toEqual("")
		fs.unlinkSync(path)
	})
	it("simple", async () => {
		const resource = uri.Locator.parse("file:///./fileWriter-simple.txt")!
		const writer = await Writer.open(resource)
		expect(await writer).toBeTruthy()
		expect(await writer!.opened).toBeTruthy()
		expect(await writer!.writeLine("The meaning of 42?")).toBeTruthy()
		expect(await writer!.close()).toBeTruthy()
		const path = resource.path.join("/")
		expect(fs.readFileSync(path).toString("utf8")).toEqual("The meaning of 42?\n")
		fs.unlinkSync(path)
	})
	it("multiline", async () => {
		const resource = uri.Locator.parse("file:///./fileWriter-multiline.txt")!
		const writer = await Writer.open(resource)
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
})
