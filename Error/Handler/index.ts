import type { Error } from "../"
import { Collector as _Collector } from "./Collector"
import { Console as _Console } from "./Console"

export interface Handler {
	raise: { (message: Error): void }
}
export namespace Handler {
	export import Collector = _Collector
	export import Console = _Console
}
