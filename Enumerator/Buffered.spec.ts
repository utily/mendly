import { describe, expect, it } from "vitest"
import { Enumerator } from "."

class StringEnumerator extends Enumerator<string> {
	private position: number = 0
	constructor(private content: string) {
		super(() => (this.position < this.content.length ? this.content.charAt(this.position++) : undefined))
	}
}
describe("Utilities.BufferedEnumerator", () => {
	it("empty string", () => expect(new Enumerator.Buffered(new StringEnumerator("")).fetch()).toBeUndefined())
	it("instanceof Enumerator", () =>
		expect(new Enumerator.Buffered(new StringEnumerator("test")) instanceof Enumerator).toBe(true))
	it("create", () => expect(Enumerator.Buffered.create(new StringEnumerator("test")) instanceof Enumerator).toBe(true))
	it("enumerate using peek()", () => {
		const testString = "let's enumerate this string using peek()"
		const enumerator = new Enumerator.Buffered(new StringEnumerator(testString))
		let result: string = ""
		while (enumerator.peek())
			result += enumerator.fetch()
		expect(result).toEqual(testString)
	})
	it("enumerate using next()", () => {
		const testString = "let's enumerate this string using next()"
		const enumerator = new Enumerator.Buffered(new StringEnumerator(testString))
		let character: string | undefined
		let result: string = ""
		while ((character = enumerator.fetch()))
			result += character
		expect(result).toEqual(testString)
	})
	it("peek() and next()", () => {
		const testString = "abcdef"
		const enumerator = new Enumerator.Buffered(new StringEnumerator(testString))
		// Force the reader to buffer the entire string
		expect(enumerator.peek(0)).toEqual("a")
		expect(enumerator.peek(5)).toEqual("f")
		expect(enumerator.fetch()).toEqual("a")
		expect(enumerator.fetch()).toEqual("b")
		expect(enumerator.fetch()).toEqual("c")
		expect(enumerator.fetch()).toEqual("d")
		expect(enumerator.fetch()).toEqual("e")
		expect(enumerator.fetch()).toEqual("f")
	})
})
