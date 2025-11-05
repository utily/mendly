import type { Error } from ".."
import type { Handler } from "."

export class Console implements Handler {
	raise(error: Error): void {
		let invoke: typeof console.error
		switch (error.level) {
			case "logging":
			case "debug":
				invoke = console.debug
				break
			case "warning":
				invoke = console.warn
				break
			case "recoverable":
			case "critical":
			default:
				invoke = console.error
				break
		}
		invoke(error.toString())
	}
}
export namespace Console {}
