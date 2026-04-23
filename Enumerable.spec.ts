import { describe, expect, it } from "vitest"
import { mendly } from "./index"

describe("mendly.Enumerable", () => {
	it.each([
		{ name: "array", source: [1, 2, 3], length: 3, first: 1 },
		{ name: "iterable set", source: new Set([1, 2]), length: 2, first: 1 }
	])("from $name", ({ source, length, first }) => {
		const enumerable = mendly.Enumerable.from(source)
		expect(enumerable.length).toEqual(length)
		expect(enumerable.first).toEqual(first)
		expect(enumerable.last).toBeUndefined()
	})
	it("from function source", () => {
		const enumerable = mendly.Enumerable.from(() => new mendly.Enumerator.Array([1, 2, 3]))
		expect(enumerable.toArray()).toEqual([1, 2, 3])
	})
	it("from function raw iterator", () =>
		expect(mendly.Enumerable.from(() => [1, 2][Symbol.iterator]()).toArray()).toEqual([1, 2]))
	it("from null source is lazy", () =>
		expect(mendly.Enumerable.from(null as unknown as never) instanceof mendly.Enumerable).toBeTruthy())
	it("iterator symbol", () => {
		const iterator = mendly.Enumerable.from([1, 2])[Symbol.iterator]()
		expect(iterator.next().value).toEqual(1)
	})
	it("getEnumerator", () =>
		expect(mendly.Enumerable.from([1]).getEnumerator() instanceof mendly.Enumerator).toBeTruthy())

	it("append map filter reduce apply", () => {
		const enumerable = mendly.Enumerable.from([1, 2, 3])
			.append(4)
			.map(n => n * 2)
			.filter(n => n > 4)
		let sum = 0
		enumerable.apply(n => (sum += n))
		expect(sum).toEqual(14)
		expect(enumerable.reduce((r, n) => r + n, 0)).toEqual(14)
	})

	it("empty", () => expect(mendly.Enumerable.empty.toArray()).toEqual([]))
})
