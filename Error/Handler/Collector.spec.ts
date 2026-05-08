import { mendly } from "../../index"

describe("mendly.Error.Handler.Collector", () => {
	const makeError = (description: string, level = "recoverable", type = "unknown") =>
		({
			description,
			level,
			type,
			region: undefined,
			toString: () => `${level}: ${type} Error. ${description}`
		}) as unknown as mendly.Error
	it("errors empty", () => expect(new mendly.Error.Handler.Collector().errors).toEqual([]))
	it("raise", () => {
		const collector = new mendly.Error.Handler.Collector()
		const e1 = makeError("first")
		const e2 = makeError("second")
		collector.raise(e1)
		collector.raise(e2)
		expect(collector.errors).toHaveLength(2)
		expect(collector.errors[0]).toBe(e1)
		expect(collector.errors[1]).toBe(e2)
	})
	it("flush", () => {
		const collector = new mendly.Error.Handler.Collector()
		const e1 = makeError("first")
		const e2 = makeError("second")
		collector.raise(e1)
		collector.raise(e2)
		const snapshot = collector.flush()
		expect(snapshot).toHaveLength(2)
		expect(snapshot[0]).toBe(e1)
		expect(snapshot[1]).toBe(e2)
		expect(collector.errors).toEqual([])
	})
	it("flush empty", () => expect(new mendly.Error.Handler.Collector().flush()).toEqual([]))
	it.each([
		{ name: "empty", errors: [] as mendly.Error[], expected: "" },
		{ name: "single", errors: [makeError("first")], expected: "recoverable: unknown Error. first" },
		{
			name: "multiple",
			errors: [makeError("first"), makeError("second", "warning")],
			expected: "recoverable: unknown Error. first\nwarning: unknown Error. second"
		}
	])("toString $name", ({ errors, expected }) => {
		const collector = new mendly.Error.Handler.Collector()
		errors.forEach(e => collector.raise(e))
		expect(collector.toString()).toBe(expected)
	})
	it("toJSON", () => {
		const collector = new mendly.Error.Handler.Collector()
		collector.raise(makeError("oops", "critical", "parse"))
		expect(collector.toJSON()[0]).toEqual({ description: "oops", level: "critical", type: "parse", region: undefined })
	})
	it("toJSON JSON.stringify", () => {
		const collector = new mendly.Error.Handler.Collector()
		collector.raise(makeError("oops", "critical", "parse"))
		expect(JSON.parse(JSON.stringify(collector))[0]).toMatchObject({
			description: "oops",
			level: "critical",
			type: "parse"
		})
	})
})
