import { mendly } from "../index"

describe("mendly.Error", () => {
	it.each([
		{ name: "default level", input: ["description"] as const, level: "recoverable", type: "unknown" },
		{
			name: "custom level and type",
			input: ["description", "warning", "syntax"] as const,
			level: "warning",
			type: "syntax"
		}
	])("constructor $name", ({ input, level, type }) => {
		const error = new mendly.Error(...input)
		expect(error.level).toEqual(level)
		expect(error.type).toEqual(type)
	})

	it.each([
		{
			name: "without region",
			error: new mendly.Error("bad token", "critical", "syntax"),
			expected: "critical: syntax Error. bad token"
		},
		{
			name: "with region",
			error: new mendly.Error("bad token", "recoverable", "syntax", {
				toString: () => "mock://resource (Ln 1, Col 1 - Ln 1, Col 2) ba"
			} as unknown as mendly.Error.Region),
			expected: "recoverable: syntax Error. bad token @ mock://resource (Ln 1, Col 1 - Ln 1, Col 2) ba"
		}
	])("toString $name", ({ error, expected }) => expect(error.toString()).toEqual(expected))

	it("throw raises itself", () => {
		const error = new mendly.Error("throws", "recoverable", "runtime")
		let raised: unknown
		try {
			error.throw()
		} catch (caught) {
			raised = caught
		}
		expect(raised).toBe(error)
	})
})
