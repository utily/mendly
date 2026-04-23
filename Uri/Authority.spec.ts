import { describe, expect, it } from "vitest"
import { mendly } from "../index"

describe("mendly.Uri.Authority", () => {
	it("empty by default", () => expect(new mendly.Uri.Authority().empty).toBe(true))
	it("parse undefined returns undefined", () => expect(mendly.Uri.Authority.parse(undefined)).toBeUndefined())
	it.each([
		{ input: "host:80", expected: "host:80" },
		{ input: "host", expected: "host" }
	])("parse without user $input", ({ input, expected }) => {
		const a = mendly.Uri.Authority.parse(input)
		expect(a?.toString()).toEqual(expected)
	})
	it("parse with @ separator covers user branch", () => {
		const a = mendly.Uri.Authority.parse("user@host")
		expect(a).toBeDefined()
		expect(a?.empty).toBe(false)
	})
	it("toString with user only", () => {
		const a = new mendly.Uri.Authority(mendly.Uri.User.parse("user"), new mendly.Uri.Endpoint())
		expect(a.toString()).toEqual("user@")
		expect(a.empty).toBe(false)
	})
})
