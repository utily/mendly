import { describe, expect, it } from "vitest"
import { mendly } from "../index"

describe("mendly.Reader.Until", () => {
	it.each([
		{ name: "undefined backend", backend: undefined as mendly.Reader | undefined, mark: "x", same: false },
		{ name: "undefined endMark", backend: mendly.Reader.String.create("a"), mark: undefined, same: true }
	])("create $name", ({ backend, mark, same }) =>
		expect(mendly.Reader.Until.create(backend, mark as string | undefined)).toBe(same ? backend : undefined))

	it("empty", async () => {
		const reader = mendly.Reader.Until.create(mendly.Reader.String.create(""), "\n")
		expect(await reader.empty).toBeTruthy()
		expect(await reader.close()).toBeFalsy()
	})
	it("state check", () => {
		const reader = mendly.Reader.Until.create(mendly.Reader.String.create(""), "\n")
		expect(reader.location).toBeTruthy()
		expect(reader.resource).toBeTruthy()
	})
	it("tab size", () => {
		const reader = mendly.Reader.Until.create(mendly.Reader.String.create("abc"), "z") as mendly.Reader.Until
		reader.tabSize = 7
		expect(reader.tabSize).toEqual(7)
	})
	it("stop directly", async () => {
		const reader = mendly.Reader.Until.create(mendly.Reader.String.create("\nabcdef"), "\n")
		expect(await reader.empty).toBeFalsy()
		expect(reader.readable && reader.resource && reader.location && reader.region && reader.mark()).toBeTruthy()
		expect(reader.read()).toEqual("\n")
		expect(await reader.empty).toBeTruthy()
		expect(await reader.close()).toBeFalsy()
		expect(reader.read()).toBeUndefined()
	})
	it("simple string", async () => {
		const reader = mendly.Reader.Until.create(mendly.Reader.String.create("abcdef"), "d")
		expect(reader.readable).toBeTruthy()
		expect(reader.empty).toBeFalsy()
		expect(reader.read()).toEqual("a")
		expect(reader.read()).toEqual("b")
		expect(await reader.close()).toBeFalsy()
		expect(reader.opened).toBeFalsy()
		expect(reader.read()).toEqual("c")
		expect(reader.read()).toEqual("d")
		expect(reader.read()).toBeUndefined()
		expect(await reader.empty).toBeTruthy()
	})

	it("close true when mark is already found", async () => {
		const reader = mendly.Reader.Until.create(mendly.Reader.String.create("\nabc"), "\n")
		expect(await reader.close()).toBeTruthy()
	})

	it("supports buffered backend", () => {
		const backend = mendly.Reader.Buffered.create(mendly.Reader.String.create("abc"))
		expect(mendly.Reader.Until.create(backend, "z")).toBeTruthy()
	})
	it("simple string with location", async () => {
		const reader = mendly.Reader.Until.create(mendly.Reader.String.create("abc\ndef"), "e")
		expect(reader.location.column).toEqual(1)
		expect(reader.location.line).toEqual(1)
		expect(reader.read()).toEqual("a")
		expect(reader.location.column).toEqual(2)
		expect(reader.location.line).toEqual(1)
		expect(reader.read()).toEqual("b")
		expect(reader.location.column).toEqual(3)
		expect(reader.location.line).toEqual(1)
		expect(reader.read()).toEqual("c")
		expect(reader.location.column).toEqual(4)
		expect(reader.location.line).toEqual(1)
		expect(reader.read()).toEqual("\n")
		expect(reader.location.column).toEqual(1)
		expect(reader.location.line).toEqual(2)
		expect(reader.read()).toEqual("d")
		expect(reader.location.column).toEqual(2)
		expect(reader.location.line).toEqual(2)
		expect(reader.read()).toEqual("e")
		expect(reader.location.column).toEqual(3)
		expect(reader.location.line).toEqual(2)
		expect(reader.read()).toBeUndefined()
		expect(await reader.empty).toBeTruthy()
	})
})
