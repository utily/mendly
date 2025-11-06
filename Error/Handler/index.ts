import type { Error } from "../"
import { Console as _Console } from "./Console"

export interface Handler {
	raise: {
		(message: Error): void
	}
}
export namespace Handler {
	export import Console = _Console
}
