import { mendly } from "../index"

describe("mendly.Uri.User", () => {
	it.each([
		{ name: "empty", input: undefined, output: "", empty: true },
		{ name: "name only", input: "alice", output: "alice", empty: false },
		{ name: "name and password", input: "alice:secret", output: "alice:secret", empty: false },
		{ name: "name with empty password", input: "alice:", output: "alice", empty: false }
	])("parse $name", ({ input, output, empty }) => {
		const user = mendly.Uri.User.parse(input)
		expect(user.toString()).toEqual(output)
		expect(user.empty).toEqual(empty)
	})
})
