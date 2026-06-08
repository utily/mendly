import { describe, expect, it } from "vitest"
import { mendly } from "../index.js"

describe("mendly.Url.Authority", () => {
	it("empty by default", () => expect(new mendly.Url.Authority().empty).toBe(true))
	it("parse undefined returns undefined", () => expect(mendly.Url.Authority.parse(undefined)).toBeUndefined())
	it.each([
		{ input: "host:80", expected: "host:80" },
		{ input: "host", expected: "host" }
	])("parse without user $input", ({ input, expected }) => {
		const a = mendly.Url.Authority.parse(input)
		expect(a?.toString()).toEqual(expected)
	})
	it("parse with @ separator covers user branch", () => {
		const a = mendly.Url.Authority.parse("user@host")
		expect(a).toBeDefined()
		expect(a?.empty).toBe(false)
	})
	it("toString with user only", () => {
		const a = new mendly.Url.Authority(mendly.Url.User.parse("user"), new mendly.Url.Endpoint())
		expect(a.toString()).toEqual("user@")
		expect(a.empty).toBe(false)
	})
})
