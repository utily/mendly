import { describe, expect, it } from "vitest"
import { BufferedEnumerator } from "./BufferedEnumerator"
import { Enumerator } from "./Enumerator"

class StringEnumerator extends Enumerator<string> {
	private position: number = 0
	constructor(private content: string) {
		super(() => (this.position < this.content.length ? this.content.charAt(this.position++) : undefined))
	}
}
describe("Utilities.BufferedEnumerator", () => {
	it("empty string", () => {
		const bi = new BufferedEnumerator(new StringEnumerator(""))
		expect(bi.fetch()).toBeUndefined()
	})
	it("enumerate using peek()", () => {
		const testString = "let's enumerate this string using peek()"
		const bi = new BufferedEnumerator(new StringEnumerator(testString))
		let result: string = ""
		while (bi.peek()) {
			result += bi.fetch()
		}
		expect(result).toEqual(testString)
	})
	it("enumerate using next()", () => {
		const testString = "let's enumerate this string using next()"
		const bi = new BufferedEnumerator(new StringEnumerator(testString))
		let character: string | undefined
		let result: string = ""
		while ((character = bi.fetch())) {
			result += character
		}
		expect(result).toEqual(testString)
	})
	it("peek() and next()", () => {
		const testString = "abcdef"
		const bi = new BufferedEnumerator(new StringEnumerator(testString))
		// Force the reader to buffer the entire string
		expect(bi.peek(0)).toEqual("a")
		expect(bi.peek(5)).toEqual("f")
		expect(bi.fetch()).toEqual("a")
		expect(bi.fetch()).toEqual("b")
		expect(bi.fetch()).toEqual("c")
		expect(bi.fetch()).toEqual("d")
		expect(bi.fetch()).toEqual("e")
		expect(bi.fetch()).toEqual("f")
	})
})
