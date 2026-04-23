import { mendly } from "../index"

describe("mendly.Error.Location", () => {
	it.each([
		{ name: "absolute resource", resource: "file:///folder/file.txt", line: 3, column: 7 },
		{ name: "relative resource", resource: "./folder/file.txt", line: 1, column: 2 }
	])("toString $name", ({ resource, line, column }) => {
		const parsed = mendly.Uri.parse(resource)
		expect(parsed).toBeTruthy()
		const location = new mendly.Error.Location(parsed!, line, column)
		expect(location.toString()).toEqual(`${parsed!.toString()} @ Ln ${line}, Col ${column}`)
	})
})
