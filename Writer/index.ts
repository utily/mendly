import "./File"
import { Indenter as _Indenter } from "./Indenter"
import { String as _String } from "./String"
import { Writer as _Writer } from "./Writer"

// Export both the type and the value
export type Writer = _Writer

// Use declaration merging to add namespace to the imported class
export const Writer = _Writer as typeof _Writer & {
	Indenter: typeof _Indenter
	String: typeof _String
	Writer: typeof _Writer
}

// Assign the classes to the constructor function
Object.assign(Writer, {
	Indenter: _Indenter,
	String: _String,
	Writer: _Writer,
})

export namespace Writer {
	export type Indenter = _Indenter
	export type String = _String
	export type Writer = _Writer
}
