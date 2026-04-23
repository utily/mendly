import { mendly } from "../../index"

describe("mendly.Error.Handler.Console", () => {
	const handler = new mendly.Error.Handler.Console()

	it.each([
		{ name: "logging", level: "logging", expected: "debug" },
		{ name: "debug", level: "debug", expected: "debug" },
		{ name: "warning", level: "warning", expected: "warn" },
		{ name: "recoverable", level: "recoverable", expected: "error" },
		{ name: "critical", level: "critical", expected: "error" },
		{ name: "unknown", level: "unknown", expected: "error" }
	])("raise $name", ({ level, expected }) => {
		const message = `message:${level}`
		const debug = vi.spyOn(console, "debug").mockImplementation(() => undefined)
		const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined)
		const error = vi.spyOn(console, "error").mockImplementation(() => undefined)

		handler.raise({ level, toString: () => message } as unknown as mendly.Error)

		expect(debug).toHaveBeenCalledTimes(expected == "debug" ? 1 : 0)
		expect(warn).toHaveBeenCalledTimes(expected == "warn" ? 1 : 0)
		expect(error).toHaveBeenCalledTimes(expected == "error" ? 1 : 0)
		expect(debug.mock.calls.concat(warn.mock.calls, error.mock.calls)).toContainEqual([message])
		debug.mockRestore()
		warn.mockRestore()
		error.mockRestore()
	})
})
