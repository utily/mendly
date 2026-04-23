import { mendly } from "../index"

describe("mendly.Uri.Endpoint", () => {
	it.each([
		{ name: "empty", input: undefined, output: "", empty: true, host: [], port: undefined },
		{
			name: "host only",
			input: "server.example.com",
			output: "server.example.com",
			empty: false,
			host: ["server", "example", "com"],
			port: undefined
		},
		{
			name: "host and port",
			input: "server.example.com:443",
			output: "server.example.com:443",
			empty: false,
			host: ["server", "example", "com"],
			port: 443
		},
		{
			name: "host and invalid port",
			input: "server.example.com:abc",
			output: "server.example.com",
			empty: false,
			host: ["server", "example", "com"],
			port: undefined
		}
	])("parse $name", ({ input, output, empty, host, port }) => {
		const endpoint = mendly.Uri.Endpoint.parse(input)
		expect(endpoint.toString()).toEqual(output)
		expect(endpoint.empty).toEqual(empty)
		expect(endpoint.host).toEqual(host)
		expect(endpoint.port).toEqual(port)
	})
})
