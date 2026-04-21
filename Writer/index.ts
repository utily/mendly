import { Indenter as _Indenter } from "./Indenter"
import { String as _String } from "./String"
import { Writer as _Writer } from "./Writer"

export type Writer = _Writer
export const Writer = Object.assign(_Writer, {
	Indenter: _Indenter,
	String: _String,
	Writer: _Writer,
}) as typeof _Writer & {
	Indenter: typeof _Indenter
	String: typeof _String
	Writer: typeof _Writer
}
export namespace Writer {
	export type Indenter = _Indenter
	export type String = _String
	export type Writer = _Writer
}
