import type { Error } from "../index.js"
import { Collector as _Collector } from "./Collector.js"
import { Console as _Console } from "./Console.js"

export interface Handler {
	raise: { (message: Error): void }
}
export namespace Handler {
	export import Collector = _Collector
	export import Console = _Console
}
