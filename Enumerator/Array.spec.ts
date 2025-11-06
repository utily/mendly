import { describe, expect, it } from "vitest"
import { Enumerator } from "."

describe("Utilities.ArrayEnumerator", () => {
	it("empty", () => expect(new Enumerator.Array([]).fetch()).toBeUndefined())
	it("instanceof Enumerator", () => expect(new Enumerator.Array([]) instanceof Enumerator).toBe(true))
	it("single", () => {
		const integers = [1]
		const enumerator = new Enumerator.Array(integers)
		let count = 0
		integers.forEach(value => {
			count++
			expect(enumerator.fetch()).toEqual(value)
		})
		expect(count).toEqual(1)
		expect(enumerator.fetch()).toBeUndefined()
	})
	it("integers", () => {
		const integers = [1, 2, 4, 8, 16]
		const enumerator = new Enumerator.Array(integers)
		let count = 0
		integers.forEach(value => {
			count++
			expect(enumerator.fetch()).toEqual(value)
		})
		expect(count).toEqual(5)
		expect(enumerator.fetch()).toBeUndefined()
	})
	it("map", () => {
		const integers = [0, 1, 2, 3, 4]
		let enumerator: Enumerator<number> = new Enumerator.Array(integers)
		enumerator = enumerator.map(integer => 2 ** integer)
		let count = 0
		integers.forEach(value => {
			count++
			const current = enumerator.fetch()
			expect(current).toEqual(2 ** value)
		})
		expect(count).toEqual(5)
		expect(enumerator.fetch()).toBeUndefined()
	})
	it("map empty", () => {
		const integers: number[] = []
		let enumerator: Enumerator<number> = new Enumerator.Array(integers)
		enumerator = enumerator.map(integer => 2 ** integer)
		let count = 0
		integers.forEach(value => count++)
		expect(count).toEqual(0)
		expect(enumerator.fetch()).toBeUndefined()
	})
	it("map single", () => {
		const integers = [4]
		let enumerator: Enumerator<number> = new Enumerator.Array(integers)
		enumerator = enumerator.map(integer => 2 ** integer)
		let count = 0
		integers.forEach(value => {
			count++
			expect(enumerator.fetch()).toEqual(16)
		})
		expect(count).toEqual(1)
		expect(enumerator.fetch()).toBeUndefined()
	})
	it("last array", () => {
		const content = "let's reduce this string back to an array of single character strings".split(" ")
		const enumerator = new Enumerator.Array(content)
		const result: string[] = []
		while (enumerator.fetch())
			if (enumerator.last)
				result.push(enumerator.last)
		expect(result.join("_")).toEqual("let's_reduce_this_string_back_to_an_array_of_single_character_strings")
	})
})
